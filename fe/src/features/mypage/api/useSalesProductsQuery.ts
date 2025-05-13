import { useQuery } from "@tanstack/react-query";
import { getSalesProducts } from "./getSalesProducts";

export const useSalesProductsQuery = () => {
  return useQuery({
    queryKey: ["mypage", "sales"],
    queryFn: getSalesProducts,
  });
};
