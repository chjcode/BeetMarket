import { ProductItem, ProductItemProps } from "./ProductItem";

interface ProductListProps {
  products: ProductItemProps[];
}

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {products.map((item) => (
        <>
          <ProductItem key={item.id} {...item} />
          <hr className="border-gray-200"/>
        </>
      ))}
    </div>
  );
};