import React from "react";

interface DetailProductCardProps {
  imageUrl: string;
  title: string;
  price: number;
  isSold?: boolean;
}

const DetailProductCard: React.FC<DetailProductCardProps> = ({ imageUrl, title, price, isSold = false }) => {
  return (
    <div className="w-24 shrink-0 flex flex-col items-center">
      <img src={imageUrl} alt={title} className="w-24 h-24 rounded-lg object-cover" />
      <div className={`text-center mt-1 text-sm ${isSold ? "line-through text-gray-400" : "text-black"}`}>
        {title}
      </div>
      <div className={`text-center text-xs ${isSold ? "line-through text-gray-400" : "text-gray-700"}`}>
        {price.toLocaleString()}원
      </div>
    </div>
  );
};

export default DetailProductCard;
