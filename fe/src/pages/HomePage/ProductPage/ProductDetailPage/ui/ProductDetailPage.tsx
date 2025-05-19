import DetailProductCard from "@/entities/Products/ui/DetailProductCard";
import ProductDetailBottomBar from "@/widgets/ProductDetailBottomBar/ProductDetailBottomBar";
import ProductImageCarousel from "@/entities/Products/ui/ProductImageCarousel";
import { TopBarDetail } from "@/widgets/TopBar/TopBarDetail"
import { useParams, useNavigate } from "react-router-dom"
import { useDragScroll } from "@/shared/hooks/useDragScroll";
// import { productList, sameCategoryProducts, sameCategorySoldHistory } from "@/entities/Products/DummyProducts";
import { useEffect, useState } from "react";

interface ProductDetailResponse {
  title: string;
  sellerNickname: string;
  sellerProfileImage: string;
  sellerRegion: string;
  category: string;
  content: string;
  price: number;
  status: string;
  region: string;
  location: string;
  createdAt: string;
  images: { imageUrl: string }[];
  model3D: string;
  view: number;
  like: number;
  isLiked: boolean;
}

interface RelatedProduct {
  id: number;
  status: string;
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

const ProductDetailPage = () => {

  const { id } = useParams();
  const navigate = useNavigate()

  const sameProductScrollRef = useDragScroll<HTMLDivElement>();
  const soldHistoryScrollRef = useDragScroll<HTMLDivElement>();

  // const productId = parseInt(id ?? "", 10)
  // const product = productList.find((p) => p.id === productId)
  const [product, setProduct] = useState<ProductDetailResponse | null>(null);
  const [availableProducts, setAvailableProducts] = useState<RelatedProduct[]>([]);
  const [completedProducts, setCompletedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // 상품 상세
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://k12a307.p.ssafy.io/api/posts/${id}`);
        const data = await res.json();
        setProduct(data.content);
        console.log("상품 상세 정보 불러오기 성공")
      } catch (err) {
        console.error("상품 정보를 불러오는 데 실패했습니다.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // 동일 카테고리 상품 리스트
  useEffect(() => {
    if (!product?.category) return;

    const fetchRelated = async (status: "AVAILABLE" | "COMPLETED", setter: (data: RelatedProduct[]) => void) => {
      try {
        const res = await fetch(
          `https://k12a307.p.ssafy.io/api/posts?category=${product.category}&status=${status}&page=0&sort=createdAt,DESC`
        );
        const data = await res.json();
        setter(data.content.content); // 페이지 안에 content가 있음
        console.log("동일 상품 카테고리 리스트 불러오기 성공공")
      } catch (err) {
        console.error(`${status} 상품 목록 불러오기 실패`, err);
      }
    };

    fetchRelated("AVAILABLE", setAvailableProducts);
    fetchRelated("COMPLETED", setCompletedProducts);
  }, [product?.category]);

  if (loading) return <div className="p-4 text-center text-gray-500">로딩 중...</div>;
  if (!product) return <div className="p-4 text-center text-red-600">상품을 찾을 수 없습니다.</div>

  return (
    <div className="relative pb-16">
      <div className="absolute top-0 left-0 w-full z-10">
        <TopBarDetail />
      </div>
      {/* 상품 이미지 */}
      <div className="w-full">
        <ProductImageCarousel
          imageUrls={product.images.map((img) => img.imageUrl)}
        />
      </div>

      <div className="px-4 mt-[-48px] pt-[48px]">
        {/* 판매자 정보 */}
        <div className="flex justify-between items-center mb-[18.px]">
          <div className="flex items-center gap-2">
            <img
              src={product.sellerProfileImage}
              alt="프로필"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              {product.sellerNickname} · {product.location}
            </div>
          </div>
          <button
            className="text-sm text-white bg-purple-600 px-3 py-1 rounded-full"
            onClick={() =>
              navigate(`/product/${id}/3d`, {
                state: { model3D: product.model3D },
              })
            }
          >
            3D 보기
          </button>
        </div>

        <div className="border-t border-gray-200 my-[12px]" />

        {/* 제목 + 설명 */}
        <div className="mb-[14px]">
          <div className="text-lg font-bold">{product.title}</div>
          <div className="text-sm text-gray-400 mt-[6px]">
            {product.category}
          </div>
          <div className="text-sm text-gray-600 mt-[10px] whitespace-pre-line break-words">
            {product.content}
          </div>
        </div>

        {/* 찜/조회 수 */}
        <div className="text-xs text-gray-400 mb-[14px]">
          찜 {product.like} | 조회 {product.view}
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 my-[14px]" />

        {/* 동일 카테고리 다른 물건 */}
        <div className="mb-[14px]">
          <div className="font-bold mb-[8px]">동일 카테고리 다른 물건</div>
          <div
            ref={sameProductScrollRef}
            className="flex overflow-x-auto gap-2 no-scrollbar select-none"
          >
            {availableProducts.map((item) => (
              <DetailProductCard
                key={item.id}
                imageUrl={item.thumbnailUrl}
                title={item.title}
                price={item.price}
              />
            ))}
          </div>
        </div>

        {/* 구분선 */}
        <div className="border-t border-gray-200 my-[14px]" />

        {/* 동일 카테고리 거래 내역 */}
        <div className="mb-4">
          <div className="font-bold mb-[8px]">동일 카테고리 거래 내역</div>
          <div
            ref={soldHistoryScrollRef}
            className="flex overflow-x-auto gap-2 no-scrollbar select-none"
          >
            {completedProducts.map((item) => (
              <DetailProductCard
                key={item.id}
                imageUrl={item.thumbnailUrl}
                title={item.title}
                price={item.price}
                isSold
              />
            ))}
          </div>
        </div>
      </div>

      {/* 바텀바 */}
      <ProductDetailBottomBar
        price={product.price}
        onChatClick={async () => {
          try {
            const formData = new FormData();
            formData.append("postId", id!);
            // formData.append("sellerId", product.sellerNickname);

            const res = await fetch(
              "https://k12a307.p.ssafy.io/api/chatrooms",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${
                    localStorage.getItem("accessToken") ?? ""
                  }`,
                },
                body: formData,
              }
            );

            const data = await res.json();
            const chatRoomId = data.content.id;

            if (chatRoomId) {
              navigate(`/chats/${chatRoomId}`);
            } else {
              alert("채팅방 생성에 실패했습니다.");
            }
          } catch (err) {
            console.error("채팅방 생성 오류:", err);
            alert("채팅방을 생성하지 못했습니다.");
          }
        }}
        isLiked={product.isLiked}
      />
    </div>
  );
};

export default ProductDetailPage;
