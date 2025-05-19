export interface Product {
  id: number;
  status: "AVAILABLE" | "RESERVED" | "COMPLETED";
  title: string;
  categoryName: string;
  price: number;
  region: string;
  createdAt: string;
  thumbnailUrl: string;
  viewCount: number;
  favoriteCount: number;
  authorNickname: string;
  isLiked: boolean;
}

export interface ProductResponse {
  status: {
    code: string;
    message: string;
  };
  content: {
    content: Product[];
    totalElements: number;
    totalPages: number;
    pageable: object;
    size: number;
    number: number;
    sort: object;
  };
}
