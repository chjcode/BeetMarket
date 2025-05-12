import axiosInstance from "@/shared/api/axiosInstance";
import { ProductResponse } from "./types";

export const getSalesProducts = async (): Promise<ProductResponse> => {
  const res = await axiosInstance.get("/api/posts");
  return res.data;
};