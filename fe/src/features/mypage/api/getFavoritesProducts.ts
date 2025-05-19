// src/features/mypage/api/getFavoritesProducts.ts
import axiosInstance from "@/shared/api/axiosInstance";
import { ProductResponse } from "./types";

export const getFavoritesProducts = async ({
  pageParam = 0,
}: {
  pageParam?: number;
}): Promise<ProductResponse> => {
  const res = await axiosInstance.get("/api/posts/my/favorite", {
    params: {
      page: pageParam,
      sort: "createdAt,DESC",
    },
  });
  return res.data;
};
