import CategoryScroll from "@/widgets/CategoryScroll/CategoryScroll";
import HomeProductGrid from "@/widgets/HomeProductGrid/HomeProductGrid";

const HomePage = () => {
  return (
    <div className=" w-full max-w-[480px] mx-auto overflow-x-hidden">
      <CategoryScroll />
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">
          오늘의 상품 추천
        </h2>
        <HomeProductGrid />
      </div>
    </div>
  );
};

export default HomePage;
