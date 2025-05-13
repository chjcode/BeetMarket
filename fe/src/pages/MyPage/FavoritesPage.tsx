import { ProductList } from "@/shared/ui/Product/ProductList"
import { ProductItemProps } from "@/shared/ui/Product/ProductItem";

const data: ProductItemProps[] = [
  {
    id: 1,
    status: "AVAILABLE",
    title: "인형팝니다",
    categoryName: "유아동",
    price: 50000,
    region: "인천",
    createdAt: "2025-05-04T21:30:02",
    thumbnailUrl: "/thumbnail1.jpg",
    viewCount: 396,
    favoriteCount: 7,
    authorNickname: "user21",
    isLiked: false,
  },
  {
    id: 2,
    status: "RESERVED",
    title: "유아용 자전거 팝니다",
    categoryName: "유아동",
    price: 80000,
    region: "서울",
    createdAt: "2025-05-02T15:12:45",
    thumbnailUrl: "/thumbnail2.jpg",
    viewCount: 120,
    favoriteCount: 12,
    authorNickname: "babyLover",
    isLiked: true,
  },
  {
    id: 3,
    status: "AVAILABLE",
    title: "전자레인지 판매합니다",
    categoryName: "전자기기",
    price: 30000,
    region: "부산",
    createdAt: "2025-05-01T10:03:11",
    thumbnailUrl: "/thumbnail3.jpg",
    viewCount: 220,
    favoriteCount: 3,
    authorNickname: "techman",
    isLiked: false,
  },
  {
    id: 4,
    status: "AVAILABLE",
    title: "의자 2개 일괄 판매",
    categoryName: "가구/인테리어",
    price: 25000,
    region: "대구",
    createdAt: "2025-04-29T18:42:00",
    thumbnailUrl: "/thumbnail4.jpg",
    viewCount: 87,
    favoriteCount: 1,
    authorNickname: "homeStyle",
    isLiked: false,
  },
  {
    id: 5,
    status: "COMPLETED",
    title: "아이폰 13 Pro Max 판매",
    categoryName: "전자기기",
    price: 950000,
    region: "경기",
    createdAt: "2025-04-28T11:20:15",
    thumbnailUrl: "/thumbnail5.jpg",
    viewCount: 1020,
    favoriteCount: 25,
    authorNickname: "iphoneman",
    isLiked: true,
  },
  {
    id: 6,
    status: "AVAILABLE",
    title: "여름 여성 의류 모음",
    categoryName: "의류/잡화",
    price: 15000,
    region: "광주",
    createdAt: "2025-04-27T09:50:30",
    thumbnailUrl: "/thumbnail6.jpg",
    viewCount: 305,
    favoriteCount: 9,
    authorNickname: "fashionista",
    isLiked: false,
  },
];

const FavoritesPage = () => {
	return (
		<div>
			<ProductList products={data}/>
		</div>
	)
}

export default FavoritesPage