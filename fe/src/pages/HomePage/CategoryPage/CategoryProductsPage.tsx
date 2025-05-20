import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ProductList } from "@/shared/ui/Product/ProductList";
import { useCategoryProductsQuery } from "@/features/mypage/api/useCategoryProductsQuery";

const CategoryProductsPage = () => {
  const { category } = useParams(); // 여기서 category 받아오기

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useCategoryProductsQuery(category); // 전달

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

  // 모든 페이지에서 제품 모으기
  const allProducts = data.pages.flatMap((page) => page.content.content);

  return (
    <div className="flex flex-col">
      <ProductList products={allProducts} />
      <div ref={observerRef} className="h-8" />
      {isFetchingNextPage && <p className="text-center mt-2">불러오는 중...</p>}
    </div>
  );
};

export default CategoryProductsPage;
