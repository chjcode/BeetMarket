import { useEffect, useRef } from "react";
import { create } from "zustand";
import type { Product } from "@/entities/Products/types";

interface ProductStore {
  products: Product[];
  hasMore: boolean;
  fetchNext: () => void;
}

const dummyProducts = [
    { id: 1, name: "인형 팝니다1", price: 10001, imageUrl: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 2, name: "인형 팝니다2", price: 10002, imageUrl: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 3, name: "인형 팝니다3", price: 1500, imageUrl: "https://randomuser.me/api/portraits/women/3.jpg" },
    { id: 4, name: "인형 팝니다4", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 5, name: "인형 팝니다5", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 6, name: "인형 팝니다6", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/3.jpg" },
    { id: 7, name: "인형 팝니다7", price: 1500, imageUrl: "https://randomuser.me/api/portraits/women/4.jpg" },
    { id: 8, name: "인형 팝니다8", price: 1500, imageUrl: "https://randomuser.me/api/portraits/women/5.jpg" },
    { id: 9, name: "인형 팝니다9", price: 1500, imageUrl: "https://randomuser.me/api/portraits/women/6.jpg" },
    { id: 10, name: "인형 팝니다10", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/4.jpg" },
    { id: 11, name: "인형 팝니다11", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/5.jpg" },
    { id: 12, name: "인형 팝니다12", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/6.jpg" },
    { id: 13, name: "인형 팝니다13", price: 1500, imageUrl: "https://randomuser.me/api/portraits/women/7.jpg" },
    { id: 14, name: "인형 팝니다14", price: 1500, imageUrl: "https://randomuser.me/api/portraits/women/8.jpg" },
    // { id: 15, name: "인형 팝니다15", price: 1500, imageUrl: "https://randomuser.me/api/portraits/women/9.jpg" },
    // { id: 16, name: "인형 팝니다16", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/7.jpg" },
    // { id: 17, name: "인형 팝니다17", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/8.jpg" },
    // { id: 18, name: "인형 팝니다18", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/9.jpg" },
    // { id: 19, name: "인형 팝니다19", price: 1500, imageUrl: "https://randomuser.me/api/portraits/women/10.jpg" },
    // { id: 20, name: "인형 팝니다20", price: 1500, imageUrl: "https://randomuser.me/api/portraits/women/11.jpg" },
    // { id: 21, name: "인형 팝니다21", price: 1500, imageUrl: "https://randomuser.me/api/portraits/women/12.jpg" },
    // { id: 22, name: "인형 팝니다22", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/10.jpg" },
    // { id: 23, name: "인형 팝니다23", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/11.jpg" },
    // { id: 24, name: "인형 팝니다24", price: 1500, imageUrl: "https://randomuser.me/api/portraits/men/12.jpg" },
];

export const useInfiniteProducts = create<ProductStore>((set, get) => ({
//   products: [],
  products: dummyProducts,
  hasMore: true,
  fetchNext: () => {
    const current = get().products.length;
    if (current >= 24) {
      set({ hasMore: false });
      return;
    }

    const newProducts = Array.from({ length: 6 }, (_, i) => ({
      id: current + i + 1,
      name: `추가된 데이터입니다. ${current + i + 1}`,
      price: 307,
      imageUrl: `https://randomuser.me/api/portraits/men/${current + i + 1}.jpg`
    }));

    set((state) => ({
      products: [...state.products, ...newProducts]
    }));
  }
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
