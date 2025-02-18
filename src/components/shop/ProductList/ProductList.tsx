import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import styles from './ProductList.module.css'

export default async function ProductList() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: products, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("Error fetching products:", error);
    return <div>에러가 발생했습니다: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.productGrid}>
        {products?.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div className={styles.imageContainer}>
              <img
                src={product.image_url || "/api/placeholder/400/400"}
                alt={product.name}
                className={styles.image}
              />
            </div>
            
            <div className={styles.productInfo}>
              <h3 className={styles.brand}>
                {product.brand || "Brand Name"}
              </h3>
              
              <h4 className={styles.name}>
                {product.name}
              </h4>
              
              <div className={styles.priceContainer}>
                <span className={styles.price}>
                  ￦{product.price?.toLocaleString()}
                </span>
                {product.original_price && (
                  <span className={styles.originalPrice}>
                    ￦{product.original_price?.toLocaleString()}
                  </span>
                )}
              </div>
              
              {product.status === "SOLD_OUT" && (
                <span className={styles.soldOut}>
                  SOLD OUT
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}