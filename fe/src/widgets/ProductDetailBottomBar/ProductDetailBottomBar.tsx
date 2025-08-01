import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface ProductDetailBottomBarProps {
  price: number;
  isLiked: boolean;
  onChatClick: () => void;
  onToggleLike: (liked: boolean) => void;
  chatButtonText: string;
  isChatDisabled: boolean;
}

const ProductDetailBottomBar: React.FC<ProductDetailBottomBarProps> = ({ 
  price,
  isLiked, 
  onChatClick, 
  onToggleLike,
  chatButtonText,
  isChatDisabled, 
}) => {
  const [liked, setLiked] = useState(isLiked);

  const handleLikeClick = () => {
    onToggleLike(liked);
    setLiked(!liked);
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-white border-t border-gray-200 z-50 w-full max-w-[480px] min-w-[360px] px-4">
      <div className="h-[54px] flex items-center justify-between">
        
        {/* 하트 + 가격 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLikeClick}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
          >
            {liked ? (
              <FaHeart className="text-[#F25555]" />
            ) : (
              <FaRegHeart className="text-gray-500" />
            )}
          </button>
          <span className="text-xl font-bold">
            <span className="text-[#A349A4]">{price.toLocaleString()}</span> 원
          </span>
        </div>

        {/* 채팅 버튼 */}
        <button
          onClick={onChatClick}
          disabled={isChatDisabled}
          className="bg-[#A349A4] text-white font-bold px-4 py-1.5 rounded-xl text-sm shadow-md"
        >
          {chatButtonText}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailBottomBar;