"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Scroll-triggered reveal: small translate + fade, fired once. Optional stagger
// for children via <Reveal stagger>...<Reveal.Item/>...
export function Reveal({
  children,
  className = "",
  stagger = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={
        stagger
          ? { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: delay } } }
          : {
              hidden: { opacity: 0, y: 22 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1], delay } },
            }
      }
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.2, 0.7, 0.2, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
