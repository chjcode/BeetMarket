// src/pages/MyPage/FavoritesPage.tsx
import { useEffect, useRef } from "react";
import { useFavoritesProductsQuery } from "@/features/mypage/api/useFavoritesProductsQuery";
import { ProductList } from "@/shared/ui/Product/ProductList";
import { Product } from "@/features/mypage/api/types";

const FavoritesPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useFavoritesProductsQuery();

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

  const allProducts: Product[] = data.pages.flatMap(
    (page) => page.content.content
  );

  return (
    <div className="flex flex-col">
      <ProductList products={allProducts} />
      <div ref={observerRef} className="h-8" />
      {isFetchingNextPage && <p className="text-center mt-2">불러오는 중...</p>}
    </div>
  );
};

export default FavoritesPage;
