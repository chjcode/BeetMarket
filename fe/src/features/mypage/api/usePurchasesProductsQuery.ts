import { useInfiniteQuery } from "@tanstack/react-query";
import { getPurchasesProducts } from "./getPurchasesProducts";

export const usePurchasesProductsQuery = () => {
  return useInfiniteQuery({
    queryKey: ["mypage", "sales"],
    queryFn: getPurchasesProducts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { number: currentPage, totalPages } = lastPage.content;
      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
  });
};
