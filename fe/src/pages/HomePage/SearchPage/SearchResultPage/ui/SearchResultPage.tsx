import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchUIStore } from "@/shared/store/useSearchUIStore";
import { ProductList } from "@/shared/ui/Product/ProductList";
import { ProductItemProps } from "@/shared/ui/Product/ProductItem";

// const dummySearchResults: ProductItemProps[] = [
//   {
//     id: 101,
//     status: "AVAILABLE",
//     title: "서치 결과 상품 1",
//     categoryName: "생활용품",
//     price: 12000,
//     region: "서울",
//     createdAt: "2025-05-10T11:30:00",
//     thumbnailUrl: "/thumbnail6.jpg",
//     viewCount: 88,
//     favoriteCount: 2,
//     authorNickname: "searcher1",
//     isLiked: false,
//   },
//   {
//     id: 102,
//     status: "RESERVED",
//     title: "서치 결과 상품 2",
//     categoryName: "가구/인테리어",
//     price: 75000,
//     region: "대전",
//     createdAt: "2025-05-09T13:45:00",
//     thumbnailUrl: "/thumbnail6.jpg",
//     viewCount: 154,
//     favoriteCount: 5,
//     authorNickname: "searcher2",
//     isLiked: true,
//   },
// ];


const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("query") ?? "";
  const { setQuery, setPlaceholder } = useSearchUIStore();

  const [results, setResults] = useState<ProductItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPlaceholder(queryParam);
    setQuery("");

    const fetchSearchResults = async () => {
      if (!queryParam) return;
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://k12a307.p.ssafy.io/api/posts?keyword=${encodeURIComponent(queryParam)}&status=AVAILABLE&sort=createdAt,DESC&page=0`
        );
        const data = await response.json();
        const content = data.content?.content;

        const mapped: ProductItemProps[] = content.map((item: ProductItemProps) => ({
          id: item.id,
          status: item.status,
          title: item.title,
          categoryName: item.categoryName,
          price: item.price,
          region: item.region,
          createdAt: item.createdAt,
          thumbnailUrl: item.thumbnailUrl,
          viewCount: item.viewCount,
          favoriteCount: item.favoriteCount,
          authorNickname: item.authorNickname,
          isLiked: item.isLiked,
        }));

        setResults(mapped);
        console.log("검색 결과 불러오기 성공")
      } catch (e) {
        console.error("검색 결과 불러오기 실패", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [queryParam, setQuery, setPlaceholder]);

  return (
  <div className="px-4">
    {isLoading ? (
      <div className="text-center py-8 text-gray-500">검색 중...</div>
    ) : results.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        해당 키워드의 상품이 없습니다.
      </div>
    ) : (
      <ProductList products={results} />
    )}
  </div>
  );
};

export default SearchResultPage;