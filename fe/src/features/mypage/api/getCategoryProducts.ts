import axiosInstance from "@/shared/api/axiosInstance";
import { ProductResponse } from "./types";

export const getCategoryProducts = async ({
  pageParam = 0,
  category,
}: {
  pageParam?: number;
  category?: string;
}): Promise<ProductResponse> => {
  // console.log(`요청 보낼 category:${category}`);

  const res = await axiosInstance.get("/api/posts", {
    params: {
      page: pageParam,
      sort: "createdAt,DESC",
      category: category,
    },
  });
  return res.data;
};
