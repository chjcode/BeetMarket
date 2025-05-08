import { ProductList } from "@/shared/ui/Product/ProductList";

import { ProductItemProps } from "@/shared/ui/Product/ProductItem";

const data: ProductItemProps[] = [
  {
    postId: 1,
    title: "1번 제목",
    price: 10000,
    status: true,
    thumbnail: "logo.svg",
    view: 11,
    like: 111,
  },
  {
    postId: 2,
    title: "2번 제목",
    price: 20000,
    status: true,
    thumbnail: "logo.svg",
    view: 22,
    like: 222,
  },
];
const HomePage = () => {


  return (
    <ProductList products={data}/>
    
  );
};

export default HomePage;