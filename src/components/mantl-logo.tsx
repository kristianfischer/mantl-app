type MantlLogoProps = {
  className?: string;
  size?: number;
};

/** Prism Split mark — matches brand identity SVG */
export function MantlLogo({ className, size = 90 }: MantlLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      className={className}
      aria-hidden
    >
      <line
        x1="28"
        y1="42"
        x2="80"
        y2="68"
        className="stroke-mantl-gold"
        strokeWidth="1.5"
        opacity={0.35}
        strokeLinecap="round"
      />
      <path
        d="M66 48 L94 48 L104 80 L80 100 L56 80 Z"
        fill="none"
        className="stroke-mantl-gold"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <line
        x1="80"
        y1="48"
        x2="80"
        y2="100"
        className="stroke-mantl-gold"
        strokeWidth="0.6"
        opacity={0.12}
      />
      <line
        x1="104"
        y1="80"
        x2="136"
        y2="72"
        className="stroke-mantl-gold"
        strokeWidth="1.8"
        opacity={0.4}
        strokeLinecap="round"
      />
      <line
        x1="104"
        y1="80"
        x2="138"
        y2="88"
        className="stroke-mantl-gold"
        strokeWidth="1.5"
        opacity={0.3}
        strokeLinecap="round"
      />
      <line
        x1="104"
        y1="80"
        x2="134"
        y2="104"
        className="stroke-mantl-gold"
        strokeWidth="1.2"
        opacity={0.2}
        strokeLinecap="round"
      />
      <circle cx="28" cy="42" r="2.5" className="fill-mantl-gold" opacity={0.5} />
      <circle cx="136" cy="72" r="2.5" className="fill-mantl-gold" />
      <circle
        cx="136"
        cy="72"
        r="7"
        fill="none"
        className="stroke-mantl-gold"
        strokeWidth="0.4"
        opacity={0.15}
      />
    </svg>
  );
}
