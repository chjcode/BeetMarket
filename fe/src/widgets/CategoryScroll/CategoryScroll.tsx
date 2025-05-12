import { useCategoryIndicator } from "./useCategoryIndicator";

const categories = [
    "전체 보기", "전자기기", "가구/인테리어", "유아동", "의류/잡화", "생활용품", "스포츠/레져",
    "최근 본 상품", "취미/게임/음반", "뷰티/미용", "반려동물", "티켓/교환권", "도서", "기타"
];

const CategoryScroll = () => {
  const { scrollRef, scrollPercent } = useCategoryIndicator();

  const row1 = categories.slice(0, Math.ceil(categories.length / 2));
  const row2 = categories.slice(Math.ceil(categories.length / 2));

  return (
    <div className="relative">
      <div ref={scrollRef} className="overflow-x-auto no-scrollbar pb-4 w-full">
        <div className="flex gap-[12px] w-max">
          <div className="flex flex-col gap-[12px]">
            <div className="flex gap-[12px]">
              {row1.map((label, i) => (
                <CategoryItem key={`row1-${i}`} label={label} />
              ))}
            </div>
            <div className="flex gap-[12px]">
              {row2.map((label, i) => (
                <CategoryItem key={`row2-${i}`} label={label} />
              ))}
            </div>
          </div>
        </div>
      </div>

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

const CategoryItem = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center w-[60px] shrink-0">
    <div className="w-[40px] h-[40px] bg-gray-300 rounded-full" />
    <span className="mt-[4px] text-xs text-center whitespace-nowrap">{label}</span>
  </div>
);

export default CategoryScroll;
