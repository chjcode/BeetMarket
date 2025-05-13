import { useInfiniteScroll } from "@/widgets/HomeProductGrid/useInfiniteProduct";
import { useInfiniteProducts } from "@/widgets/HomeProductGrid/useInfiniteProduct";
import HomeProductCard from "@/entities/Products/ui/HomeProductCard";

const HomeProductGrid = () => {
  const products = useInfiniteProducts(state => state.products);
  const { bottomRef } = useInfiniteScroll();

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-[15px]">
        {products.map((product) => (
          <HomeProductCard key={product.id} {...product} />
        ))}
      </div>
      <div ref={bottomRef} className="h-10" />
    </>
  );
};

export default HomeProductGrid;
