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
  return (
    <div className="w-full h-[136px] border">
      <div className="flex w-full h-full gap-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full aspect-square rounded-xl object-cover"
        />

        {/* 텍스트 정보 */}
        <div className="flex flex-col justify-between py-1 flex-1">
          <div className="text-sm text-gray-900 font-medium">
            {product.title}
          </div>
          <div className="text-base font-bold">
            {product.price.toLocaleString()}원
          </div>
          <div className="text-xs text-gray-500">
            조회수 {product.view} · 좋아요 {product.like}
          </div>
        </div>
      </div>
    </div>
  );
};
