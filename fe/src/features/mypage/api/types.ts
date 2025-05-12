export interface Product {
  postId: string;
  title: string;
  price: string;
  status: string;
  thumbnail: string;
  view: string;
  like: string;
}

export interface ProductResponse {
  status: {
    code: string;
    message: string;
  };
  content: Product[];
}
