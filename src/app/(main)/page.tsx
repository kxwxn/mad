// app/page.tsx
import Image from "next/image";
import styles from "./page.module.css";
import Footer from "@/components/layout/Footer";
import TopNav from "@/components/layout/TopNav";
import FullscreenVideoSection from "@/components/sections/FullscreenVideoSection/FullscreenVideoSection";
import TextSection from "@/components/sections/TextSection/TextSection";
import SplitImageSection from "@/components/sections/SplitImageSection/SplitImageSection";
import FullImageSection from "@/components/sections/FullImageSection/FullImageSection";
import VideoGridSection from "@/components/sections/VideoGridSection/VideoGridSection";
import SixImageGridSection from "@/components/sections/SixImageGridSection/SixImageGridSection";

export default function Home() {
  return (
    <main className={styles.main}>
      <TopNav />
      <FullscreenVideoSection videoUrl={process.env.NEXT_PUBLIC_VIDEO1_URL!} />

      <TextSection
        title="TEXT A"
        description1="XXXXXXXXXX"
        description2="XXXXXXXXXXXX"
        sectionType="textSection"
        titleStyle="titleText"
        descriptionStyle="descriptionText"
      />

      <SplitImageSection
        images={[
          { src: "/Images/pendingFoto/01.jpg", alt: "Image 1" },
          { src: "/Images/pendingFoto/01.jpg", alt: "Image 2" },
          { src: "/Images/pendingFoto/01.jpg", alt: "Image 3" },
        ]}
      />
      
      <TextSection
        title="TEXT B"
        description1="XXXXXXXXXX"
        description2="XXXXXXXXXXXX"
        sectionType="secondTextSection"
        titleStyle="secondTitle"
        descriptionStyle="secondDescription"
      />
      <FullImageSection imageUrl="/Images/Foto4.jpg" altText="Image 1" />

      <VideoGridSection videoUrl={process.env.NEXT_PUBLIC_VIDEO2_URL!} count={3} />

      <TextSection
        title="TEXT C"
        description1="XXXXXXXXXX"
        description2="XXXXXXXXXXXX"
        sectionType="thirdTextSection"
        titleStyle="thirdTitle"
        descriptionStyle="thirdDescription"
      />

      <SixImageGridSection
        images={[
          { src: "/Images/FotosAF/A.jpg", alt: "Image A" },
          { src: "/Images/FotosAF/B.jpg", alt: "Image B" },
          { src: "/Images/FotosAF/C.jpg", alt: "Image C" },
          { src: "/Images/FotosAF/D.jpg", alt: "Image D" },
          { src: "/Images/FotosAF/E.jpg", alt: "Image E" },
          { src: "/Images/FotosAF/F.jpg", alt: "Image F" },
        ]}
      />

      <TextSection
        title="MADE
IN BERLIN
WITH
MUSHROOMS"
        description1=""
        description2=""
        sectionType="fourthTextSection"
        titleStyle="fourthTitle"
        descriptionStyle="fourthDescription"
      />

      <Footer />
    </main>
  );
}
