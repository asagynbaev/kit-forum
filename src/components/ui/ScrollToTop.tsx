import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-top"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Наверх"
          className="fixed bottom-6 right-6 z-50 grid h-11 w-11 place-items-center rounded-xl bg-ink/85 text-white ring-1 ring-white/15 backdrop-blur-md shadow-glow hover:bg-brand hover:ring-white/30 active:scale-[0.94] transition-colors duration-300"
        >
          <ArrowUp size={16} strokeWidth={1.8} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
