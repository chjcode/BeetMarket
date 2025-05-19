import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategoryProducts } from "./getCategoryProducts";

export const useCategoryProductsQuery = (category?: string) => {
  return useInfiniteQuery({
    queryKey: ["category", category],
    queryFn: ({ pageParam = 0 }) =>
      getCategoryProducts({ pageParam, category }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { number: currentPage, totalPages } = lastPage.content;
      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
  });
};
