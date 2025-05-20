import { useEffect, useState } from "react";
import { getRecentProducts } from "@/shared/utils/localStorage";
import { ProductList } from "@/shared/ui/Product/ProductList";
import type { ProductItemProps } from "@/shared/ui/Product/ProductItem";

const RecentPage = () => {
  const [products, setProducts] = useState<ProductItemProps[]>([]);

  useEffect(() => {
    setProducts(getRecentProducts() as ProductItemProps[]);
  }, []);

  return (
    <div className="p4">
      <h2 className="text-xl font-bold mb-2">최근 본 상품</h2>
      <ProductList products={products} />
    </div>
  );
};

export default RecentPage;
