import { ProductItem, ProductItemProps } from "./ProductItem";

interface ProductListProps {
  products: ProductItemProps[];
}

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {products.map((item) => (
        <ProductItem key={item.postId} {...item} />
      ))}
    </div>
  );
};