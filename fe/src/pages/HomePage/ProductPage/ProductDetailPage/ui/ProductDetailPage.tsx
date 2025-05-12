import DetailProductCard from "@/entities/Products/ui/DetailProductCard";
import ProductDetailBottomBar from "@/widgets/ProductDetailBottomBar/ProductDetailBottomBar";
import ProductImageCarousel from "@/entities/Products/ui/ProductImageCarousel";
import { TopBarDetail } from "@/widgets/TopBar/TopBarDetail"
import { useParams, useNavigate } from "react-router-dom"
import { useDragScroll } from "@/shared/hooks/useDragScroll";
import { productList, sameCategoryProducts, sameCategorySoldHistory } from "@/entities/Products/DummyProducts";


const ProductDetailPage = () => {

  const { id } = useParams();
  const navigate = useNavigate()

  const sameProductScrollRef = useDragScroll<HTMLDivElement>();
  const soldHistoryScrollRef = useDragScroll<HTMLDivElement>();

  const productId = parseInt(id ?? "", 10)
  const product = productList.find((p) => p.id === productId)

  if (!product) {
    return <div className="p-4 text-center text-red-600">상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="relative pb-16">
      <div className="absolute top-0 left-0 w-full z-10">
        <TopBarDetail />
      </div>
      {/* 상품 이미지 */}
      <div className="w-full">
        <ProductImageCarousel imageUrls={product.imageUrls} />
      </div>
      
      <div className="px-4 mt-[-48px] pt-[48px]">
        {/* 판매자 정보 */}
        <div className="flex justify-between items-center mb-[18.px]">
          <div className="flex items-center gap-2">
            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="프로필" className="w-8 h-8 rounded-full" />
            <div className="text-sm">{product.sellerName} · {product.sellerLocation}</div>
          </div>
          <button className="text-sm text-white bg-purple-600 px-3 py-1 rounded-full">3D 보기</button>
        </div>

        <div className="border-t border-gray-200 my-[12px]" />
  
        {/* 제목 + 설명 */}
        <div className="mb-[14px]">
          <div className="text-lg font-bold">{product.name}</div>
          <div className="text-sm text-gray-400 mt-[6px]">{product.category}</div>
          <div className="text-sm text-gray-600 mt-[10px] whitespace-pre-line break-words">{product.description}</div>
        </div>

        {/* 찜/조회 수 */}
        <div className="text-xs text-gray-400 mb-[14px]">
          찜 {product.likes} | 조회 {product.views}
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 my-[14px]" />
  
        {/* 동일 카테고리 다른 물건 */}
        <div className="mb-[14px]">
          <div className="font-bold mb-[8px]">동일 카테고리 다른 물건</div>
          <div ref={sameProductScrollRef} className="flex overflow-x-auto gap-2 no-scrollbar select-none">
            {sameCategoryProducts.map((item, idx) => (
              <DetailProductCard key={idx} {...item} />
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 my-[14px]" />
  
        {/* 동일 카테고리 거래 내역 */}
        <div className="mb-4">
          <div className="font-bold mb-[8px]">동일 카테고리 거래 내역</div>
          <div ref={soldHistoryScrollRef} className="flex overflow-x-auto gap-2 no-scrollbar select-none">
            {sameCategorySoldHistory.map((item, idx) => (
              <DetailProductCard key={idx} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* 바텀바 */}
      <ProductDetailBottomBar 
        price={product.price} 
        onChatClick={() => navigate("/chatting")}
      />
    </div>
  );
};

export default ProductDetailPage;
