// app/page.tsx
import styles from "./page.module.css";
import Footer from "@/components/layout/Footer";
import TopNav from "@/components/layout/TopNav";
import FullscreenVideoSection from "@/components/sections/FullscreenVideoSection/FullscreenVideoSection";
import TextSection from "@/components/sections/TextSection/TextSection";
import SplitImageSection from "@/components/sections/SplitImageSection/SplitImageSection";
import FullImageSection from "@/components/sections/FullImageSection/FullImageSection";
import VideoGridSection from "@/components/sections/VideoGridSection/VideoGridSection";
import { getOptionalPublicEnv } from "@/utils/env";

export default function Home() {
  const video1Url = getOptionalPublicEnv('NEXT_PUBLIC_VIDEO1_URL', '');
  const video2Url = getOptionalPublicEnv('NEXT_PUBLIC_VIDEO2_URL', '');

  return (
    <main className={styles.main}>
      <TopNav />
      {video1Url && <FullscreenVideoSection videoUrl={video1Url} />}

      <TextSection
        title="MAD is a material and design company disrupting unsustainable production practices"
        description1=""
        description2=""
        sectionType="textSection"
        titleStyle="titleText"
        descriptionStyle="descriptionText"
      />

      <SplitImageSection
        variant="four"
        images={[
          { src: "/Images/LandingPhoto/Texture 2.jpeg", alt: "Image 1" },
          { src: "/Images/LandingPhoto/Texture 4.jpeg", alt: "Image 2" },
          { src: "/Images/LandingPhoto/Texture 3.jpeg", alt: "Image 3" },
          { src: "/Images/LandingPhoto/Texture 1.jpeg", alt: "Image 4" },
        ]}
      />

      <TextSection
        title="MAD processes Mycelium -the root like structure of fungi- to develop strong, lightweight, and biodegradable composites as an alternative to plastics and other unsustainable materials."
        description1=""
        description2=""
        sectionType="secondTextSection"
        titleStyle="secondTitle"
        descriptionStyle="secondDescription"
      />

      <FullImageSection
        imageUrl="/Images/LandingPhoto/Mycelium.jpeg"
        altText="Image 1"
        overlayText="We develop custom solutions for your projects and products based on our unique recipes and IP. Get in touch!"
        topOverlayText="We are not industry bound, we are addressing the urgent need for sustainable materials across different industries."
      />

      <TextSection
        title="PILOT PRODUCT #1"
        description1="MADclimb"
        description2="Biodegradable climbing holds made with our MADxR composite engineered for strength, reducing plastic waste with a circular life cycle through natural composting at end-of-life."
        sectionType="thirdTextSection"
        titleStyle="typo-title-2rem"
        description1Style="typo-subtitle-3_5rem"
        description2Style="typo-body-2rem"
      />

      <SplitImageSection
        variant="three"
        images={[
          { src: "/Images/LandingPhoto/MADclimb .jpeg", alt: "Image 1" },
        ]}
      />

      {video2Url && (
        <VideoGridSection
          videoUrl={video2Url}
          count={3}
        />
      )}

      <FullImageSection
        imageUrl="/Images/LandingPhoto/MADbau.jpg"
        altText="Image 1"
        overlayTitle="PILOT PRODUCT #2"
        overlaySubtitle="MADbau"
        overlayDescription="Mycelium panels designed for interior architecture - as partitions or wall elements- offering acoustic and thermal comfort, healthy natural materials and distinctive textured aesthetics."
        overlayPosition="top"
        overlayTitleClass="typo-title-2rem"
        overlaySubtitleClass="typo-subtitle-3_5rem"
        overlayDescriptionClass="typo-body-2rem"
      />

      <TextSection
        title="PILOT PRODUCT #3"
        description1="MADobj"
        description2="Custom-designed mycelium objects with material properties tailored to match the function, form,and purpose of each piece."
        sectionType="fourthTextSection"
        titleStyle="typo-title-2rem"
        description1Style="typo-subtitle-3_5rem"
        description2Style="typo-body-2rem"
      />

      <SplitImageSection
        variant="three"
        images={[
          { src: "/Images/LandingPhoto/MADobj.jpeg", alt: "MADobj combined images" },
        ]}
      />

      <TextSection
        title={`MADE
IN BERLIN
WITH
MUSHROOMS`}
        description1=""
        description2=""
        sectionType="bannerTextSection"
        titleStyle="fourthTitle"
        descriptionStyle="fourthDescription"
        rightBottomTitle="MAD"
        rightBottomText="Mollstraße 1, DE-10178 Berlin"
      />

      <Footer />
    </main>
  );
}
