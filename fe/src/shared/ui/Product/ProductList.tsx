import { ProductItem, ProductItemProps } from "./ProductItem";

interface ProductListProps {
  products: ProductItemProps[];
}

export const ProductList = ({ products }: ProductListProps) => {
  return (
    <div className="flex flex-col gap-3 pt-3 px-3">
      {products.map((item) => (
        <div key={item.id} className="flex flex-col gap-2">
          <ProductItem {...item} />
          <hr className="border-gray-100" />
        </div>
      ))}
    </div>
  );
};