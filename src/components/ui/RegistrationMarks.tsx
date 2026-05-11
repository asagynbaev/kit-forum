interface Props {
  tone?: "dark" | "light";
  size?: number;
  inset?: number;
}

/**
 * Cinema / blueprint corner registration crosshairs.
 * Renders 4 L-shaped marks at the corners — pure SVG, no JS.
 */
export function RegistrationMarks({
  tone = "dark",
  size = 18,
  inset = 12,
}: Props) {
  const stroke = tone === "dark" ? "rgba(255,255,255,0.45)" : "rgba(10,22,40,0.35)";

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <Mark style={{ top: inset, left: inset }} size={size} stroke={stroke} rotate={0} />
      <Mark style={{ top: inset, right: inset }} size={size} stroke={stroke} rotate={90} />
      <Mark style={{ bottom: inset, right: inset }} size={size} stroke={stroke} rotate={180} />
      <Mark style={{ bottom: inset, left: inset }} size={size} stroke={stroke} rotate={270} />
    </div>
  );
}

function Mark({
  style,
  size,
  stroke,
  rotate,
}: {
  style: React.CSSProperties;
  size: number;
  stroke: string;
  rotate: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      style={{ position: "absolute", transform: `rotate(${rotate}deg)`, ...style }}
    >
      <path
        d="M0 1 H10 M1 0 V10"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="square"
      />
    </svg>
  );
}
