export const RECENT_VIEWED_KEY = "recentProducts";

export interface RecentProduct {
  id: number;
  title: string;
  thumbnailUrl: string;
  price: number;
  categoryName: string;
  viewCount: number;
  isLiked: boolean;
}

export const saveRecentProduct = (product: RecentProduct) => {
  const data = localStorage.getItem(RECENT_VIEWED_KEY);
  let products: RecentProduct[] = data ? JSON.parse(data) : [];

  products = products.filter((p) => p.id !== product.id);
  products.unshift(product);
  products = products.slice(0, 10);

  localStorage.setItem(RECENT_VIEWED_KEY, JSON.stringify(products));
};

export const getRecentProducts = (): RecentProduct[] => {
  const data = localStorage.getItem(RECENT_VIEWED_KEY);
  return data ? JSON.parse(data) : [];
};