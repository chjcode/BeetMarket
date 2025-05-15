import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchHistoryState {
  keywords: string[];
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;
  clearAll: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      keywords: [],
      addKeyword: (keyword) => {
        const prev = get().keywords.filter(k => k !== keyword);
        set({ keywords: [keyword, ...prev].slice(0, 10) });
      },
      removeKeyword: (keyword) => {
        set({ keywords: get().keywords.filter(k => k !== keyword) });
      },
      clearAll: () => set({ keywords: [] }),
    }),
    {
      name: "search-history",
    }
  )
);
