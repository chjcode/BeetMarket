import { useNavigate } from "react-router-dom";
import { Icon } from "@/shared/ui/Icon";

type ProductItemProps = {
  postId: number;
  title: string;
  price: number;
  status: boolean;
  thumbnail: string;
  view: number;
  like: number;
};

export const ProductItem = ({ product }: ProductItemProps) => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[136px] flex" onClick={()=>{navigate(`/product/${product.postId}`)}}>
      <div className="h-full aspect-square">
        <img
          src={product.thumbnail}
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
      <div className="w-full h-full flex flex-col bg-gray-100">
        <div>{product.title}</div>
        {/* 가격은 나중에 , 넣는거 처리 하겠음 */}
        <div>{product.price} 원</div>
        <div className="flex gap-1">
          <div>{product.like}</div>
          <Icon
            name={product.status ?  "heart" : "heartfill"}
            className="shadow-xl w-6 h-6 rounded-full border"
          />
        </div>
      </div>
    </div>
  );
};

// export const ProductItem = ({ product }: ProductItemProps) => {
//   return (
//     <div className="w-full h-[136px] flex bg-gray-200">
//       <div className="h-full aspect-square bg-red-300">
//         <img src={product.thumbnail} className="w-full h-full object-cover" />
//       </div>
//       <div className="w-full h-full flex flex-col">
//         <div></div>
//         <div></div>
//       </div>
//     </div>
//   );
// };
