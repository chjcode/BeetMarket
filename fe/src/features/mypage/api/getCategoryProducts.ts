import axiosInstance from "@/shared/api/axiosInstance";
import { ProductResponse } from "./types";

export const getCategoryProducts = async ({
  pageParam = 0,
  category,
}: {
  pageParam?: number;
  category?: string;
}): Promise<ProductResponse> => {
  const res = await axiosInstance.get("/api/posts", {
    params: {
      page: pageParam,
      sort: "createdAt,DESC",
      category,
    },
  });
  return res.data;
};
