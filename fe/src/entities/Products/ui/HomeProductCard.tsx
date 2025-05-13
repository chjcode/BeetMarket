import type { Product } from "@/entities/Products/types";
import { useNavigate } from "react-router-dom";

const HomeProductCard = ({ id, name, price, imageUrl }: Product) => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/product/${id}`)} className="flex flex-col cursor-pointer">
      <div className="w-full aspect-square relative overflow-hidden rounded-[12px]">
        <img
          src={imageUrl}
          alt={name}
          className="absolute top-0 left-0 w-full h-full object-cover"
          draggable={false}
        />
      </div>
      <div className="mt-[5px] text-sm">{name}</div>
      <div className="text-sm font-semibold">{price.toLocaleString()}원</div>
    </div>
  );
};

export default HomeProductCard;
