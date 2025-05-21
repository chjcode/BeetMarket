import type { Product } from "@/entities/Products/types";
import { useNavigate } from "react-router-dom";
import { saveRecentProduct } from "@/shared/utils/localStorage";

const HomeProductCard = ({ id, title, price, thumbnailUrl, categoryName, viewCount, isLiked }: Product) => {
  const navigate = useNavigate();

  const handleClick = () => {
    saveRecentProduct({ 
      id, 
      title, 
      price, 
      thumbnailUrl, 
      categoryName,
      viewCount,
      isLiked
     });
    navigate(`/product/${id}`);
  };

  return (
    <div onClick={handleClick} className="flex flex-col cursor-pointer mb-1">
      <div className="w-full aspect-square relative overflow-hidden rounded-xl shadow-md">
        <img
          loading="lazy"
          src={thumbnailUrl}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover shadow-md rounded-2xl"
          draggable={false}
        />
      </div>

        <div className="flex flex-col justify-between mt-1">
          <div className="pl-2 mt-1 text-xs font-medium">{title}</div>
          <div className="pl-2 text-sm font-semibold">{price.toLocaleString()}원</div>
        </div>
      
    </div>
  );
};

export default HomeProductCard;
