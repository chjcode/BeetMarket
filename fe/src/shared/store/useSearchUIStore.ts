import { create } from "zustand";

interface SearchUIState {
  query: string;
  setQuery: (v: string) => void;

  placeholder: string;
  setPlaceholder: (v: string) => void;

  submitSearch: (navigate: (path: string) => void, addKeyword: (k: string) => void) => void;

  setOnSearch: (callback: (q: string) => void) => void;
}

export const useSearchUIStore = create<SearchUIState>((set, get) => ({
  query: "",
  setQuery: (v) => set({ query: v }),

  placeholder: "",
  setPlaceholder: (v) => set({ placeholder: v }),

  submitSearch: (navigate, addKeyword) => {
    const q = get().query.trim();
    if (!q) return;
    addKeyword(q);
    navigate(`/search/result?query=${encodeURIComponent(q)}`);
  },

  setOnSearch: (callback) => {
    const currentQuery = get().query;
    callback(currentQuery);
  },
}));
