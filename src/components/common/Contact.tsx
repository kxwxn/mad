"use client";

import styles from "./Contact.module.css";
import Link from "next/link";

export default function Contact() {
  return (
    <section className={styles.contactSection}>
      <div className={styles.contactInfo}>
        <h1 className={styles.title}>
          Material Alternative Design 
          <br />
          MAD
        </h1>
        
        <div className={styles.details}>
          <p>Località Batasiolo 85/A, 12064, La Morra, Italy</p>
          <p>info@memphis.it</p>
          <p>+39 0173 56102</p>
        </div>
      </div>
      
      <div className={styles.buttonWrapper}>
        <Link href="/contact" className={styles.contactButton}>
          <span className={styles.buttonText}>Contact</span>
          <span className={styles.arrow}>→</span>
        </Link>
      </div>
    </section>
  );
}