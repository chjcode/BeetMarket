import CategoryScroll from "@/widgets/CategoryScroll/CategoryScroll";
import HomeProductGrid from "@/widgets/HomeProductGrid/HomeProductGrid";

const HomePage = () => {
  return (
    <div className="pt-[20px] pb-[10px]">
      <CategoryScroll />
      <div className="mt-[13px]">
        <h2 className="text-base font-semibold mb-[15px]">상품 추천 or 랜덤 or 기간별 인기</h2>
        <HomeProductGrid />
      </div>
    </div>
  );
};

export default HomePage;
