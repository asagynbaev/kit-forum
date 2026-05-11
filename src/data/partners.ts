export interface Partner {
  id: string;
  /** Path under /public — accessibility name only, not rendered on the tile */
  name: string;
  src: string;
}

/**
 * Real partner logos provided by the organizer.
 * Files live in /public/partners/. Names are kept for alt-text only —
 * tiles render the logo image without a visible caption.
 */
export const partners: Partner[] = [
  { id: "p1", name: "Международный Университет Кыргызстана", src: "/partners/p1.png" },
  { id: "p2", name: "High Technology Park of the Kyrgyz Republic", src: "/partners/p2.png" },
  { id: "p3", name: "THE TECH", src: "/partners/p3.png" },
  { id: "p4", name: "Партнёр форума", src: "/partners/p4.png" },
  { id: "p5", name: "Партнёр форума", src: "/partners/p5.png" },
  { id: "p6", name: "Партнёр форума", src: "/partners/p6.png" },
  { id: "p8", name: "Партнёр форума", src: "/partners/p8.png" },
  { id: "p9", name: "Партнёр форума", src: "/partners/p9.png" },
  { id: "p10", name: "Партнёр форума", src: "/partners/p10.png" },
  { id: "p11", name: "Партнёр форума", src: "/partners/p11.png" },
  { id: "p12", name: "Партнёр форума", src: "/partners/p12.png" },
  { id: "p13", name: "Партнёр форума", src: "/partners/p13.png" },
  { id: "p14", name: "Партнёр форума", src: "/partners/p14.png" },
  { id: "p15", name: "Партнёр форума", src: "/partners/p15.png" },
  { id: "p16", name: "Партнёр форума", src: "/partners/p16.png" },
];
