import InfoNav from "@/components/layout/InfoNav";
import styles from "./page.module.css";
import InfoTripletSection from "@/components/sections/InfoTripletSection/InfoTripletSection";

export default function Page() {
  return (
    <main className={styles.main}>
      <InfoNav />
      <div className={styles.content}>
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
      </div>
    </main>
  );
}
