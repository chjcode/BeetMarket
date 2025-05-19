import axiosInstance from "@/shared/api/axiosInstance";
import { ProductItemProps } from "@/shared/types/product";

export const getNearbyProducts = async (
  region: string
): Promise<ProductItemProps[]> => {
  const res = await axiosInstance.get("/api/posts", {
    params: {
      region,
      status: "AVAILABLE",
      sort: "createdAt,DESC",
      page: 0,
    },
  });
  return res.data.content.content;
};