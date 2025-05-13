import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";

export interface ProductItemProps {
  postId: number;
  title: string;
  price: number;
  status: boolean;
  thumbnail: string;
  view: number;
  like: number;
}

export const ProductItem = (product: ProductItemProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="w-full h-[136px] flex"
      onClick={() => navigate(`/product/${product.postId}`)}
    >
      <div className="h-full aspect-square">
        <img
          src={product.thumbnail}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <div className="w-full h-full flex flex-col bg-gray-100">
        <div>{product.title}</div>
        <div>{product.price} 원</div>
        <div className="flex gap-1">
          <div>{product.like}</div>
          <Icon
            name={product.status ? "heart" : "heartfill"}
            className="shadow-xl w-6 h-6 rounded-full border"
          />
        </div>
      </div>
    </div>
  );
};