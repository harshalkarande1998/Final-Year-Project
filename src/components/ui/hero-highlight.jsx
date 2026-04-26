"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const HeroHighlight = ({ children, className, containerClassName }) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center w-full overflow-hidden",
        containerClassName
      )}
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        backgroundSize: "24px 24px",
      }}
    >
      <div className={cn("relative z-20 w-full", className)}>{children}</div>
    </div>
  );
};

export const Highlight = ({ children, className }) => {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      animate={{ backgroundSize: "100% 100%" }}
      transition={{ duration: 2, ease: "linear", delay: 0.3 }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        "relative inline-block pb-1 px-1 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600",
        className
      )}
    >
      {children}
    </motion.span>
  );
};
