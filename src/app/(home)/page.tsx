// app/page.tsx
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* 첫 번째 섹션: 전체 화면 이미지 */}
      <section className={styles.fullscreenSection}>
        <Image
          src="/images/002.jpg"
          alt="Hero Image"
          fill
          sizes="100vw"
          priority
          quality={100}
          className={styles.heroImage}
        />
      </section>

      {/* 두 번째 섹션: 설명글 */}
      <section className={styles.textSection}>
        <p className={styles.description}>
          이곳에 프로젝트나 작품에 대한 설명글이 들어갑니다. 충분한 여백과 함께
          텍스트를 배치하여 가독성을 높입니다.
        </p>
      </section>

      {/* 세 번째 섹션: 좌우 이미지 1 */}
      <section className={styles.splitSection}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/003.jpg"
            alt="Left Split Image 1"
            fill
            sizes="50vw"
            quality={100}
            className={styles.splitImage}
          />
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/images/004.jpg"
            alt="Right Split Image 1"
            fill
            sizes="50vw"
            quality={100}
            className={styles.splitImage}
          />
        </div>
      </section>

      {/* 네 번째 섹션: 좌우 이미지 2 */}
      <section className={styles.splitSection}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/split-2-left.jpg"
            alt="Left Split Image 2"
            fill
            className={styles.splitImage}
          />
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/images/split-2-right.jpg"
            alt="Right Split Image 2"
            fill
            className={styles.splitImage}
          />
        </div>
      </section>

      {/* 다섯 번째 섹션: 비디오 */}
      <section className={styles.videoSection}>
        <video autoPlay loop muted playsInline className={styles.video}>
          <source src="/videos/main-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>
    </main>
  );
}
