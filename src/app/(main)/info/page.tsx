import InfoNav from "@/components/InfoNav";
import styles from "./page.module.css";

export default function Page() {
  return (
    <main className={styles.main}>
      <InfoNav />
      <div className={styles.content}>
        {/* 여기에 info 페이지 컨텐츠를 추가하세요 */}
      </div>
    </main>
  );
}
    