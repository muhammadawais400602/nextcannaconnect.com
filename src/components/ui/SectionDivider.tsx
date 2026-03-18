interface SectionDividerProps {
  reverse?: boolean;
}

export default function SectionDivider({ reverse = false }: SectionDividerProps) {
  return (
    <div className={reverse ? "gradient-divider-reverse" : "gradient-divider"} />
  );
}
