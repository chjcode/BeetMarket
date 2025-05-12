import { useState } from "react";
import { ProductList } from "@/shared/ui/Product/ProductList";
import { useSalesProductsQuery } from "@/features/mypage/api/useSalesProductsQuery";
import { Product } from "@/features/mypage/api/types";

// const data: ProductItemProps[] = [
//   {
//     postId: 1,
//     title: "인형팝니다1",
//     price: 10000,
//     status: true,
//     thumbnail: "/thumbnail1.jpg",
//     view: 11,
//     like: 111,
//   },
//   {
//     postId: 2,
//     title: "인형팝니다2",
//     price: 20000,
//     status: false,
//     thumbnail: "/thumbnail2.jpg",
//     view: 22,
//     like: 222,
//   },
//   {
//     postId: 3,
//     title: "인형팝니다3",
//     price: 30000,
//     status: true,
//     thumbnail: "/thumbnail3.jpg",
//     view: 33,
//     like: 333,
//   },
//   {
//     postId: 4,
//     title: "인형팝니다4",
//     price: 40000,
//     status: false,
//     thumbnail: "/thumbnail4.jpg",
//     view: 44,
//     like: 444,
//   },
//   {
//     postId: 5,
//     title: "인형팝니다5",
//     price: 50000,
//     status: true,
//     thumbnail: "/thumbnail5.jpg",
//     view: 55,
//     like: 555,
//   },
// ];

export const SalesPage = () => {
  const { data, isLoading, error } = useSalesProductsQuery();
  const [filter, setFilter] = useState<"all" | "selling" | "sold">("all");

  if (isLoading) return <p>로딩 중</p>;
  if (error || !data) return <p>에러 or 데이터 없음</p>;

  const filteredData: Product[] = data.content.filter((item) => {
    if (filter === "all") return true;
    if (filter === "selling") return item.status === "true";
    if (filter === "sold") return item.status === "false";
  });

  return (
    <div className="flex flex-col">
      <div>
        <button onClick={() => setFilter("all")}>전체</button>
        <button onClick={() => setFilter("selling")}>판매중</button>
        <button onClick={() => setFilter("sold")}>판매완료</button>
      </div>
      <ProductList products={filteredData} />
    </div>
  );
};
