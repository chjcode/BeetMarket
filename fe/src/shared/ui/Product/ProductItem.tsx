import { useNavigate } from "react-router-dom";
// import { Icon } from "@/shared/ui/Icon";
import { saveRecentProduct } from "@/shared/utils/localStorage";
import dayjs from "dayjs";

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
      viewCount: product.viewCount,
      favoriteCount: product.favoriteCount,
      isLiked: product.isLiked,
    });

    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="w-full h-[112px] flex cursor-pointer gap-1"
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
        <div className="font-semibold text">{product.title}</div>
        <div className="text-sm">{product.region?.split(" ").slice(0, 2).join(" ") ?? ""}</div>
        <div className="text-sm">{dayjs(product.createdAt).format("YYYY.MM.DD HH:mm")}</div> {/* ✅ 포맷팅 */}
        <div className="text-sm">{product.price.toLocaleString()} 원</div>
        <div className="flex gap-2 justify-end items-center">
          <div className="text-xs">조회수 {product.viewCount}</div>
          {/* <div className="flex gap-1 items-center"> */}
            <div className="text-xs">찜 {product.favoriteCount}</div>
            {/* <Icon
              name={product.isLiked ? "heartfill" : "heart"}
              className={`w-5 h-5 rounded-full shadow-md bg-gray-100 p-1 text-red-400
                ${product.isLiked ? "" : "stroke-[1.5]"}
              `}
            /> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};