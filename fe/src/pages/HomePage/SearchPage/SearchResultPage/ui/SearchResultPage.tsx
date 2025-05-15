import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useSearchUIStore } from "@/shared/store/useSearchUIStore";
import { ProductList } from "@/shared/ui/Product/ProductList";
import { ProductItemProps } from "@/shared/ui/Product/ProductItem";

const dummySearchResults: ProductItemProps[] = [
  {
    id: 101,
    status: "AVAILABLE",
    title: "서치 결과 상품 1",
    categoryName: "생활용품",
    price: 12000,
    region: "서울",
    createdAt: "2025-05-10T11:30:00",
    thumbnailUrl: "/thumbnail6.jpg",
    viewCount: 88,
    favoriteCount: 2,
    authorNickname: "searcher1",
    isLiked: false,
  },
  {
    id: 102,
    status: "RESERVED",
    title: "서치 결과 상품 2",
    categoryName: "가구/인테리어",
    price: 75000,
    region: "대전",
    createdAt: "2025-05-09T13:45:00",
    thumbnailUrl: "/thumbnail6.jpg",
    viewCount: 154,
    favoriteCount: 5,
    authorNickname: "searcher2",
    isLiked: true,
  },
];


const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("query") ?? "";
  const { setQuery, setPlaceholder } = useSearchUIStore();

  useEffect(() => {
    setPlaceholder(queryParam);
    setQuery("");
  }, [queryParam, setQuery, setPlaceholder]);

  return (
    <div className="px-4">
      <ProductList products={dummySearchResults} />
    </div>
  );
};

export default SearchResultPage;
