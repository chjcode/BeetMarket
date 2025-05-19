// src/features/mypage/api/useFavoritesProductsQuery.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFavoritesProducts } from "./getFavoritesProducts";

export const useFavoritesProductsQuery = () => {
  return useInfiniteQuery({
    queryKey: ["mypage", "favorites"],
    queryFn: getFavoritesProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { number: currentPage, totalPages } = lastPage.content;
      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
  });
};
