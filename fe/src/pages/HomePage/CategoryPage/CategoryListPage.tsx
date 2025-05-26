import { useNavigate } from "react-router-dom";

const categories = [
  // { label: "전체보기", img: "/categoryImage/total_icon.png" },
  // { label: "최근 본 상품", img: "/categoryImage/recent_icon.png" },
  { label: "전자기기", img: "/categoryImage/electronics.png" },
  { label: "가구/인테리어", img: "/categoryImage/furniture.png" },
  { label: "유아동", img: "/categoryImage/kids.png" },
  { label: "의류/잡화", img: "/categoryImage/clothing.png" },
  { label: "생활용품", img: "/categoryImage/living_goods.png" },
  { label: "스포츠/레져", img: "/categoryImage/sports_leisure.png" },
  { label: "취미/게임/음반", img: "/categoryImage/hobby_game_music.png" },
  { label: "뷰티/미용", img: "/categoryImage/beauty.png" },
  { label: "티켓/교환권", img: "/categoryImage/ticket.png" },
  { label: "기타", img: "/categoryImage/etc.png" },
];

const CategoryListPage = () => {
  const navigate = useNavigate();
  return (
    // <div className="w-full max-w-[500px] mx-auto p-4">
    //   <div className="text-lg font-bold mb-7">
    //     <span className="border-b-2 border-[#F44336] pb-1 text-[#F44336]">
    //       카테고리
    //     </span>
    //   </div>
    //   <div className="grid grid-cols-2 gap-y-6 gap-x-4">
    //     {categories.map((item, idx) => (
    //       <div
    //         key={idx}
    //         className="flex flex-col items-center gap-3 py-1 cursor-pointer"
    //         onClick={() => navigate(`/category/${item.label}`)}
    //       >
    //         <img
    //           src={item.img}
    //           alt={item.label}
    //           className="w-10 h-10 object-contain"
    //         />
    //         <span className="text-base font-medium">{item.label}</span>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="w-full max-w-[500px] mx-auto p-4">
      <div className="text-lg font-bold mb-7">
        <span className="border-b-2 border-[#F44336] pb-1 text-[#F44336]">
          카테고리
        </span>
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        {categories.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center cursor-pointer"
            onClick={() => navigate(`/category/${item.label}`)}
          >
            <img
              src={item.img}
              alt={item.label}
              className="w-12 h-12 object-contain mb-2"
            />
            <span className="text-sm text-center break-keep">{item.label}</span>
          </div>
        ))}
      </div>
    </div>

  );
};

export default CategoryListPage;
