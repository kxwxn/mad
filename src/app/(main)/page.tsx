// app/page.tsx
import styles from "./page.module.css";
import Footer from "@/components/layout/Footer";
import TopNav from "@/components/layout/TopNav";
import FullscreenVideoSection from "@/components/sections/FullscreenVideoSection/FullscreenVideoSection";
import TextSection from "@/components/sections/TextSection/TextSection";
import SplitImageSection from "@/components/sections/SplitImageSection/SplitImageSection";
import FullImageSection from "@/components/sections/FullImageSection/FullImageSection";
import VideoGridSection from "@/components/sections/VideoGridSection/VideoGridSection";
import SixImageGridSection from "@/components/sections/SixImageGridSection/SixImageGridSection";
import InfoTripletSection from "@/components/sections/InfoTripletSection/InfoTripletSection";

export default function Home() {
  return (
    <main className={styles.main}>
      <TopNav />
      <FullscreenVideoSection videoUrl={process.env.NEXT_PUBLIC_VIDEO1_URL!} />

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
          { src: "/Images/pendingFoto/01.jpg", alt: "Image 1" },
          { src: "/Images/pendingFoto/02.jpg", alt: "Image 2" },
          { src: "/Images/pendingFoto/03.jpg", alt: "Image 3" },
          { src: "/Images/pendingFoto/01.jpg", alt: "Image 4" },
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
        imageUrl="/Images/LandingPhoto/Mycelium.jpg"
        altText="Image 1"
        overlayText="We are not industry bound, we are addressing the urgent need for sustainable materials across different industries."
      />

      <TextSection
        title="We develop custom solutions for your projects and products based on our unique recipes and IP. Get in touch!"
        description1=""
        description2=""
        sectionType="secondTextSection"
        titleStyle="secondTitle"
        descriptionStyle="secondDescription"
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
          { src: "/Images/LandingPhoto/MADclimb 1.jpg", alt: "Image 1" },
          { src: "/Images/LandingPhoto/MADclimb 2.jpg", alt: "Image 2" },
          { src: "/Images/LandingPhoto/MADclimb 3.jpg", alt: "Image 3" },
        ]}
      />

      <VideoGridSection
        videoUrl={process.env.NEXT_PUBLIC_VIDEO2_URL!}
        count={3}
      />

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

      <SixImageGridSection
        images={[
          { src: "/Images/LandingPhoto/MADobj 1.jpg", alt: "Image A" },
          { src: "/Images/LandingPhoto/MADobj 1.jpg", alt: "Image A" },
          { src: "/Images/LandingPhoto/MADobj 1.jpg", alt: "Image A" },
          { src: "/Images/LandingPhoto/MADobj 1.jpg", alt: "Image A" },

          { src: "/Images/LandingPhoto/MADobj 2.jpg", alt: "Image E" },
          { src: "/Images/LandingPhoto/MADobj 2.jpg", alt: "Image E" },
          { src: "/Images/LandingPhoto/MADobj 2.jpg", alt: "Image E" },
          { src: "/Images/LandingPhoto/MADobj 2.jpg", alt: "Image E" },
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

      <InfoTripletSection
        items={[
          {
            subtitle: "Mission Statement",
            content:
              "MAD is a materials and design company disrupting unsustainable production practices at the intersection of biomaterial science and circular design. We engineer high-performance alternative materials using mycelium - the root-like structure of fungi.",
          },
          {
            subtitle: "Commissions + Collaborations",
            content:
              "We develop custom materials and solutions adapted to your project's needs. Open to collaborations with brands, designers, architects, scientists, climbers, and beyond. If you're interested in co-creating, experimenting, or bringing a bold idea to life, let's connect.",
          },
          {
            subtitle: "Impressum",
            content:
              "Material Alternative Design UG\nMollstraße 1\nDE-10178 Berlin\nAmtsgericht Charlottenburg Berlin\nRepresented by: Marta agueda Carlero + Manuela Garcia",
          },
        ]}
      />

      <Footer />
    </main>
  );
}
