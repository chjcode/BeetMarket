import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";
import { saveRecentProduct } from "@/shared/utils/localStorage";

export interface ProductItemProps {
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

export const ProductItem = (product: ProductItemProps) => {
  const navigate = useNavigate();
  const isCompleted = product.status === "COMPLETED";

  const handleClick = () => {
    saveRecentProduct({
      id: product.id,
      title: product.title,
      thumbnailUrl: product.thumbnailUrl,
      price: product.price,
      categoryName: product.categoryName,
    });

    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="w-full h-[120px] flex cursor-pointer gap-1"
      onClick={handleClick}
    >
      <div className="h-full aspect-square relative">
        <img
          src={product.thumbnailUrl}
          className={`w-full h-full object-cover rounded-2xl ${
            isCompleted ? "opacity-70" : ""
          }`}
        />
        {isCompleted && (
          <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-lg font-bold rounded-xl">
            거래완료
          </div>
        )}
      </div>

      <div
        className={`w-full h-full flex flex-col justify-between px-3 py-2 ${
          isCompleted ? "text-gray-400" : "text-black"
        }`}
      >
        <div className="font-semibold">{product.title}</div>
        <div className="">{product.region}</div>
        <div className="">{product.createdAt}</div>
        <div className="">{product.price.toLocaleString()} 원</div>
        <div className="flex gap-4 justify-end">
          <div className="">조회수 {product.favoriteCount}</div>
          <div className="flex gap-1 items-center">
            <div className="">찜 {product.favoriteCount}</div>
            <Icon
              name={product.isLiked ? "heart" : "heartfill"}
              className={`w-6 h-6 rounded-full shadow-md bg-gray-100 p-1 text-red-400
                    ${product.isLiked ? "stroke-[2]" : ""}
              `}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
