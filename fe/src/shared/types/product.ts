export interface ProductItemProps {
  id: number;
  title: string;
  price: number;
  region: string;
  categoryName: string;
  thumbnailUrl: string;
  status: "AVAILABLE" | "RESERVED" | "COMPLETED";
  createdAt: string;
  viewCount: number;
  favoriteCount: number;
  authorNickname: string;
  isLiked: boolean;
  latitude: number;
  longitude: number;
}