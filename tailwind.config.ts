import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
      colors: {
        // Backgrounds
        canvas: "#FFFFFF",
        surface: "#F5F8FC",
        tint: "#E6F0FF",
        // Ink
        ink: {
          DEFAULT: "#0A1628",
          soft: "#4A5C7A",
          mute: "#8A98B0",
        },
        // Brand
        brand: {
          DEFAULT: "#0066FF",
          deep: "#003D99",
          glow: "#00D4FF",
          tint: "#E6F0FF",
        },
        line: "rgba(10,22,40,0.08)",
        lineStrong: "rgba(10,22,40,0.12)",
      },
      fontFamily: {
        display: [
          "Inter Display",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        // Editorial scale
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.2em" }],
        micro: ["0.6875rem", { lineHeight: "1", letterSpacing: "0.18em" }],
      },
      letterSpacing: {
        tightest: "-0.04em",
        verytight: "-0.03em",
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      boxShadow: {
        soft: "0 8px 28px -16px rgba(10,22,40,0.12), 0 2px 6px -2px rgba(10,22,40,0.06)",
        lift: "0 22px 44px -22px rgba(10,22,40,0.18), 0 6px 12px -6px rgba(10,22,40,0.08)",
        ring: "inset 0 0 0 1px rgba(10,22,40,0.08)",
        glow: "0 0 0 1px rgba(0,102,255,0.25), 0 16px 40px -16px rgba(0,102,255,0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse at top, rgba(0,102,255,0.06), transparent 60%)",
        "hero-veil":
          "linear-gradient(180deg, rgba(10,22,40,0) 0%, rgba(10,22,40,0.18) 55%, rgba(10,22,40,0.55) 100%)",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.32, 0.72, 0, 1)",
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(-50%,0,0)" },
        },
        "marquee-rev": {
          "0%": { transform: "translate3d(-50%,0,0)" },
          "100%": { transform: "translate3d(0,0,0)" },
        },
        "chevron-bob": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.55" },
          "50%": { transform: "translateY(6px)", opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translate3d(0,24px,0)" },
          "100%": { opacity: "1", transform: "translate3d(0,0,0)" },
        },
      },
      animation: {
        marquee: "marquee 42s linear infinite",
        "marquee-rev": "marquee-rev 48s linear infinite",
        "chevron-bob": "chevron-bob 1.8s ease-in-out infinite",
        "fade-up": "fade-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
