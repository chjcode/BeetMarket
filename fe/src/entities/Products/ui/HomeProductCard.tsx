import type { Product } from "@/entities/Products/types";
import { useNavigate } from "react-router-dom";

const HomeProductCard = ({ id, name, price, imageUrl }: Product) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`)
  };

  return (
    <div onClick={handleClick} className="flex flex-col cursor-pointer">
      <img src={imageUrl} alt={name} className="w-full aspect-square rounded-[12px] object-cover" />
      <div className="mt-[5px] text-sm">{name}</div>
      <div className="text-sm font-semibold">{price.toLocaleString()}원</div>
    </div>
  );
};

export default HomeProductCard;
