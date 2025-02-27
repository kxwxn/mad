// app/page.tsx
import Image from "next/image";
import styles from "./page.module.css";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main className={styles.main}>

      <section className={styles.fullscreenSection}>
        <Image
          src="/Images/002.jpg"
          alt="Hero Image"
          fill
          sizes="100vw"
          priority
          quality={100}
          className={styles.heroImage}
          loading="eager"
        />
      </section>


      <section className={styles.textSection}>
        <p className={styles.descriptionTop}>Material Alternative Design</p>
        <p className={styles.descriptionBtm}>
          Transforming the sports industry with mycelium-based alternatives to
          plastics
        </p>
      </section>


      <section className={styles.splitSection}>
        <div className={styles.imageContainer}>
          <Image
            src="/Images/003.jpg"
            alt="Left Split Image 1"
            fill
            sizes="50vw"
            quality={100}
            className={styles.splitImage}
          />
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/Images/004.jpg"
            alt="Right Split Image 1"
            fill
            sizes="50vw"
            quality={100}
            className={styles.splitImage}
          />
        </div>
      </section>


      <section className={styles.videoSection}>
        <video autoPlay loop muted playsInline className={styles.video}>
          <source src="/Videos/MAD_Reel.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>


      <section className={styles.splitSection}>
        <div className={styles.imageContainer}>
          <Image
            src="/Images/Poster.png"
            alt="Left Split Image 2"
            fill
            className={styles.splitImage}
          />
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/Images/Poster_flashyfinal.jpg"
            alt="Right Split Image 2"
            fill
            className={styles.splitImage}
          />
        </div>
      </section>
      <Contact />
      <Footer />  
    </main>
  );
}