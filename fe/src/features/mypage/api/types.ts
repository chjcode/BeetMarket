export interface Product {
  postId: number;
  title: string;
  price: number;
  status: boolean;
  thumbnail: string;
  view: number;
  like: number;
}

export interface ProductResponse {
  status: {
    code: string;
    message: string;
  };
  content: Product[];
}
