// app/page.tsx
import Image from "next/image";
import styles from "./page.module.css";
import Footer from "@/components/Footer";
import TopNav from "@/components/TopNav";

export default function Home() {
  return (
    <main className={styles.main}>
      <TopNav />
      <section className={styles.fullscreenSection}>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={styles.heroVideo}
          preload="auto"
        >
          <source src="/Videos/Video1.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <section className={styles.textSection}>
        <h1 className={styles.titleText}>TEXT A</h1>
        <p className={styles.descriptionText}>XXXXXXXXXX</p>
        <p className={styles.descriptionText}>XXXXXXXXXXXX</p>
      </section>

      <section className={styles.splitSection}>
        <div className={styles.imageContainer}>
          <Image
            src="/Images/pendingFoto/01.jpg"
            alt="Image 1"
            fill
            sizes="33vw"
            quality={100}
            className={styles.splitImage}
          />
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/Images/pendingFoto/01.jpg"
            alt="Image 2"
            fill
            sizes="33vw"
            quality={100}
            className={styles.splitImage}
          />
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/Images/pendingFoto/01.jpg"
            alt="Image 3"
            fill
            sizes="33vw"
            quality={100}
            className={styles.splitImage}
          />
        </div>
      </section>
      
      <section className={styles.secondTextSection}>
        <h1 className={styles.secondTitle}>TEXT B</h1>
        <p className={styles.secondDescription}>XXXXXXXXXX</p>
        <p className={styles.secondDescription}>XXXXXXXXXXXX</p>
      </section>
      <section className={styles.fullImageSection}>
        <div className={styles.fullImageContainer}>
          <Image
            src="/Images/Foto4.jpg"
            alt="Image 1"
            fill
            sizes="200vw"
            quality={100}
            className={styles.fullImage}
          />
        </div>
      </section>

      <section className={styles.videoSection}>
        <div className={styles.videoContainer}>
          <div className={styles.videoWrapper}>
            <video autoPlay loop muted playsInline className={styles.video}>
              <source src="/Videos/Video2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className={styles.videoWrapper}>
            <video autoPlay loop muted playsInline className={styles.video}>
              <source src="/Videos/Video2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className={styles.videoWrapper}>
            <video autoPlay loop muted playsInline className={styles.video}>
              <source src="/Videos/Video2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      <section className={styles.thirdTextSection}>
        <h1 className={styles.thirdTitle}>TEXT C</h1>
        <p className={styles.thirdDescription}>XXXXXXXXXX</p>
        <p className={styles.thirdDescription}>XXXXXXXXXXXX</p>
      </section>

      <section className={styles.sixImageSection}>
        <div className={styles.imageRow}>
          <div className={styles.imageWrapper}>
            <Image
              src="/Images/FotosAF/A.jpg"
              alt="Image A"
              fill
              sizes="33vw"
              quality={100}
              className={styles.sixImage}
            />
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/Images/FotosAF/B.jpg"
              alt="Image B"
              fill
              sizes="33vw"
              quality={100}
              className={styles.sixImage}
            />
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/Images/FotosAF/C.jpg"
              alt="Image C"
              fill
              sizes="33vw"
              quality={100}
              className={styles.sixImage}
            />
          </div>
        </div>
        <div className={styles.imageRow}>
          <div className={styles.imageWrapper}>
            <Image
              src="/Images/FotosAF/D.jpg"
              alt="Image D"
              fill
              sizes="33vw"
              quality={100}
              className={styles.sixImage}
            />
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/Images/FotosAF/E.jpg"
              alt="Image E"
              fill
              sizes="33vw"
              quality={100}
              className={styles.sixImage}
            />
          </div>
          <div className={styles.imageWrapper}>
            <Image
              src="/Images/FotosAF/F.jpg"
              alt="Image F"
              fill
              sizes="33vw"
              quality={100}
              className={styles.sixImage}
            />
          </div>
        </div>
      </section>

      <section className={styles.fourthTextSection}>
        <h1 className={styles.fourthTitle}>MADE{'\n'}IN BERLIN{'\n'}WITH{'\n'}MUSHROOMS</h1>
      </section>

      <Footer />
    </main>
  );
}
