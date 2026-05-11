import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** When true, child is treated as an inline element (uses span instead of div). */
  inline?: boolean;
  /** Spring stagger for child orchestration */
  stagger?: number;
}

const baseSpring = {
  type: "spring" as const,
  tension: 180,
  friction: 24,
  stiffness: 90,
  damping: 18,
  mass: 0.9,
};

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  inline,
  stagger,
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        ...baseSpring,
        delay,
        ...(stagger
          ? { staggerChildren: stagger, delayChildren: delay }
          : {}),
      },
    },
  };

  const Tag = inline ? motion.span : motion.div;

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
      variants={variants}
    >
      {children}
    </Tag>
  );
}
