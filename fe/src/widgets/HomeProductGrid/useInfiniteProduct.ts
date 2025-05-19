import { useEffect, useRef } from "react";
import { create } from "zustand";
import type { Product } from "@/entities/Products/types";

interface ProductStore {
  products: Product[];
  hasMore: boolean;
  page: number;
  isLoading: boolean;
  fetchNext: () => void;
}

export const useInfiniteProducts = create<ProductStore>((set, get) => ({
  products: [],
  hasMore: true,
  page: 0,
  isLoading: false,
  fetchNext: async () => {
    const { page, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;

    set({ isLoading: true });

    try {
      const res = await fetch(
        `https://k12a307.p.ssafy.io/api/posts?page=${page}&sort=createdAt,DESC`
      );
      const data = await res.json();
      const newProducts: Product[] = data.content.content;

      set((state) => ({
        products: [...state.products, ...newProducts],
        hasMore: !data.content.last, // 마지막 페이지 여부에 따라 결정
        page: state.page + 1,
        isLoading: false,
      }));
      console.log("상품 불러오기 성공")
    } catch (error) {
      console.error("상품 불러오기 실패:", error);
      set({ isLoading: false });
    }
  },
}));

export const useInfiniteScroll = () => {
  const { fetchNext, hasMore } = useInfiniteProducts();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore) {
          fetchNext();
        }
      },
      { threshold: 1.0 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [fetchNext, hasMore]);

  return { bottomRef };
};
