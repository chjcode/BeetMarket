import { useEffect, useRef, useState } from "react";
import { ProductList } from "@/shared/ui/Product/ProductList";
import { useSalesProductsQuery } from "@/features/mypage/api/useSalesProductsQuery";
import { Product } from "@/features/mypage/api/types";

const SalesPage = () => {
  const [filter, setFilter] = useState<"all" | "selling" | "sold">("all");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useSalesProductsQuery();

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    const el = observerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) return <p>로딩 중</p>;
  if (error || !data) return <p>에러 또는 데이터 없음</p>;

  const allProducts: Product[] = data.pages
    .flatMap((page) => page.content.content)
    .filter((item) => {
      if (filter === "all") return true;
      if (filter === "selling")
        return item.status === "AVAILABLE" || item.status === "RESERVED";
      if (filter === "sold") return item.status === "COMPLETED";
    });

  const buttonClass = (type: typeof filter) =>
    `px-4 py-2 rounded-full border text-sm font-medium transition 
     ${
       filter === type
         ? "bg-[#A349A4] text-white"
         : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
     }`;

  return (
    <div className="flex flex-col px-4 py-2">
      <div className="flex gap-2 mt-1">
        <button className={buttonClass("all")} onClick={() => setFilter("all")}>
          전체
        </button>
        <button
          className={buttonClass("selling")}
          onClick={() => setFilter("selling")}
        >
          판매 중
        </button>
        <button
          className={buttonClass("sold")}
          onClick={() => setFilter("sold")}
        >
          판매 완료
        </button>
      </div>

      <ProductList products={allProducts} />

      <div ref={observerRef} className="h-8" />
      {isFetchingNextPage && <p className="text-center mt-2">불러오는 중...</p>}
    </div>
  );
};

export default SalesPage;
