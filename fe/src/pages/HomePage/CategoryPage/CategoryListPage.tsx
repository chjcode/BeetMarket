import { useNavigate } from "react-router-dom";

const categories = [
  // { label: "전체보기", img: "/categoryImage/total_icon.png" },
  // { label: "최근 본 상품", img: "/categoryImage/recent_icon.png" },
  { label: "전자기기", img: "/categoryImage/electronics.png", navname:"electronics" },
  { label: "가구/인테리어", img: "/categoryImage/furniture.png", navname:"furniture" },
  { label: "유아동", img: "/categoryImage/kids.png", navname:"kids" },
  { label: "의류/잡화", img: "/categoryImage/clothing.png", navname:"clothing" },
  { label: "생활용품", img: "/categoryImage/living_goods.png", navname:"living_goods" },
  { label: "스포츠/레져", img: "/categoryImage/sports_leisure.png", navname:"sports_leisure" },
  { label: "취미/게임/음반", img: "/categoryImage/hobby_game_music.png", navname:"hobby_game_music" },
  { label: "뷰티/미용", img: "/categoryImage/beauty.png", navname:"beauty" },
  { label: "티켓/교환권", img: "/categoryImage/ticket.png", navname:"ticket" },
  { label: "기타", img: "/categoryImage/etc.png", navname:"etc" },
];

const CategoryListPage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-xs mx-auto py-4">
      <div className="text-lg font-bold mb-7">
        <span className="border-b-2 border-[#F44336] pb-1 text-[#F44336]">
          카테고리
        </span>
      </div>
      <div className="grid grid-cols-2 gap-y-6 gap-x-10">
        {categories.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 py-1 cursor-pointer"
            onClick={() => navigate(`/category/${item.navname}`)}
          >
            <img
              src={item.img}
              alt={item.label}
              className="w-10 h-10 object-contain"
            />
            <span className="text-base font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryListPage;
