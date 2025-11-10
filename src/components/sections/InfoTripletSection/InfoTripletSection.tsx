import sectionStyles from "./InfoTripletSection.module.css";

export interface InfoTripletItem {
  subtitle: string;
  content: string;
}

interface InfoTripletSectionProps {
  items: InfoTripletItem[]; // 기대 길이 3
  align?: "left" | "center";
}

export default function InfoTripletSection({ items, align = "left" }: InfoTripletSectionProps) {
  const alignClass = align === "center" ? sectionStyles.center : sectionStyles.left;

  return (
    <section className={`${sectionStyles.container} ${alignClass}`}>
      <div className={sectionStyles.grid}>
        {items.slice(0, 3).map((item, idx) => (
          <div key={idx} className={sectionStyles.card}>
            <h3 className={sectionStyles.subtitle}>{item.subtitle}</h3>
            <p className={sectionStyles.content}>{item.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


