import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function ProductList() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: products, error } = await supabase
    .from("products")  // 대문자로 시작하는 테이블명 사용
    .select("*");

  if (error) {
    console.error("Error fetching products:", error);
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  console.log(products)

  return (
    <ul>
      {products?.map((product) => (
        <li key={product.id}>
          {product.name} - ${product.price}
          <p>Description: {product.description}</p>
          <p>Product Info: {product.product_info}</p>
          <p>Shipping: {product.shipping}</p>
        </li>
      ))}
    </ul>
  );
}
