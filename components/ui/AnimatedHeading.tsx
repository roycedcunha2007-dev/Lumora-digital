"use client";

import { ElementType } from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  as?: ElementType;
  /** animate per "char" or per "word" */
  by?: "char" | "word";
  delay?: number;
  once?: boolean;
};

const container: Variants = {
  hidden: {},
  show: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

const item: Variants = {
  hidden: { y: "110%", opacity: 0, rotateX: -35, filter: "blur(8px)" },
  show: {
    y: "0%",
    opacity: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AnimatedHeading({
  text,
  className,
  as: Tag = "h2",
  by = "word",
  delay = 0,
  once = true,
}: Props) {
  const units = by === "char" ? Array.from(text) : text.split(" ");
  const stagger = by === "char" ? 0.028 : 0.08;

  return (
    <Tag className={cn("[perspective:800px]", className)}>
      <motion.span
        className="inline-block"
        variants={container}
        custom={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount: 0.6 }}
        transition={{ delayChildren: delay }}
      >
        {units.map((unit, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden align-bottom"
            style={{ paddingBottom: "0.08em" }}
          >
            <motion.span
              variants={item}
              className="inline-block will-change-transform"
              style={{ transformOrigin: "bottom" }}
            >
              {unit === " " ? " " : unit}
              {by === "word" && i < units.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
