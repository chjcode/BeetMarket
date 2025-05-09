import { ProductItem, ProductItemProps } from "./ProductItem";

export const ProductList = ({products}: ProductItemProps[]) => {
	return (
    <div className="flex flex-col gap-2">
      {products.map((item) => (
        <ProductItem key={item.postId} product={item} />
      ))}
    </div>
  );
}