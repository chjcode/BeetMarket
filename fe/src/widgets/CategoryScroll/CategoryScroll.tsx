import { useDragScroll } from "@/shared/hooks/useDragScroll";
import { useCategoryIndicator } from "./useCategoryIndicator";
import { CategoryItem } from "./CategoryItem";
import { useNavigate } from "react-router-dom";

const categories = [
  { label: "전체 보기", image: "" },
  { label: "전자기기", image: "electronics.png" },
  { label: "가구/인테리어", image: "furniture.png" },
  { label: "유아동", image: "kids.png" },
  { label: "의류/잡화", image: "clothing.png" },
  { label: "생활용품", image: "living_goods.png" },
  { label: "스포츠/레져", image: "sports_leisure.png" },
  { label: "최근 본 상품", image: "sdfs" },
  { label: "취미/게임/음반", image: "hobby_game_music.png" },
  { label: "뷰티/미용", image: "beauty.png" },
  { label: "반려동물", image: "pet.png" },
  { label: "티켓/교환권", image: "ticket.png" },
  { label: "도서", image: "book.png" },
  { label: "기타", image: "etc.png" },
];

const CategoryScroll = () => {
  const scrollRef = useDragScroll<HTMLDivElement>();
  const scrollPercent = useCategoryIndicator(scrollRef as React.RefObject<HTMLDivElement>);
  const navigate = useNavigate();

  const row1 = categories.slice(0, Math.ceil(categories.length / 2));
  const row2 = categories.slice(Math.ceil(categories.length / 2));

  const getPath = (label: string) => {
    if (label === "전체 보기") return "/category";
    if (label === "최근 본 상품") return "/recent";
    return `/category/${encodeURIComponent(label)}`;
  };

  return (
    <div className="relative w-full overflow-x-hidden">
      <div
        ref={scrollRef}
        className="overflow-x-auto no-scrollbar pb-4 w-full select-none"
      >
        <div className="flex w-max gap-3 px-1">
          {row1.map((category, i) => (
            <div
              key={i}
              className="shrink-0 w-[20vw] max-w-[96px] flex flex-col gap-3 items-center"
            >
              <div onClick={() => navigate(getPath(category.label))}>
                <CategoryItem label={category.label} imageName={category.image} />
              </div>
              {row2[i] && (
                <div onClick={() => navigate(getPath(row2[i].label))}>
                  <CategoryItem
                    label={row2[i].label}
                    imageName={row2[i].image}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 인디케이터 */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] flex justify-center">
        <div className="relative w-[100px] h-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full w-[40px] bg-[#9C7A7A] rounded-full transition-all duration-300"
            style={{
              transform: `translateX(${scrollPercent * 60}px)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryScroll;