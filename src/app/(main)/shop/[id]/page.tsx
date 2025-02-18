import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import styles from './ProductDetail.module.css';
import { notFound } from 'next/navigation';

// 타입 정의
interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  original_price?: number;
  description?: string;
  images: string[];  // 여러 이미지 URL을 저장하는 배열
  details?: string[];
  size_guide?: string;
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  // Supabase 클라이언트 생성
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 상품 데이터 가져오기
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className={styles.container}>
      {/* 왼쪽: 이미지 섹션 */}
      <section className={styles.imageSection}>
        {product.images?.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl || "/api/placeholder/400/400"}
            alt={`${product.name} - Image ${index + 1}`}
            className={styles.productImage}
          />
        ))}
      </section>

      {/* 중앙: 구분선 */}
      <div className={styles.divider} />

      {/* 오른쪽: 상품 정보 섹션 */}
      <section className={styles.infoSection}>
        {/* 상단 헤더 - 브랜드, 상품명, 가격 */}
        <div className={styles.header}>
          <div className={styles.brand}>{product.brand}</div>
          <h1 className={styles.productName}>{product.name}</h1>
          <div className={styles.priceContainer}>
            <span className={styles.price}>₩{product.price?.toLocaleString()}</span>
            {product.original_price && (
              <span className={styles.originalPrice}>
                ₩{product.original_price?.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* 사이즈 선택 */}
        <div className={styles.sizeSection}>
          <button className={styles.sizeGuideButton}>
            [SIZE GUIDE]
          </button>
          <div className={styles.sizeSelector}>
            <select className={styles.selectSize}>
              <option value="">SELECT SIZE</option>
              {/* 사이즈 옵션들은 데이터에 따라 동적으로 생성 */}
            </select>
          </div>
        </div>

        {/* 구매 버튼 */}
        <div className={styles.actionButtons}>
          <button className={styles.addToCartButton}>
            ADD TO CART
          </button>
          <button className={styles.wishlistButton}>
            ♡
          </button>
        </div>

        {/* 상품 설명 */}
        <div className={styles.description}>
          <h2>EDITORS NOTE [-]</h2>
          <p>{product.description}</p>

          {/* 상품 상세 정보 리스트 */}
          <ul className={styles.detailsList}>
            {product.details?.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}