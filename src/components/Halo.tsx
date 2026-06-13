import React from "react";
import { motion } from "framer-motion";
import type { AvatarState } from "../hooks/useAvatarState";
import { haloVariants } from "../animations/variants";
import haloImage from "../assets/halo.png";

interface HaloProps {
  state: AvatarState;
  size: number;
}

export const Halo: React.FC<HaloProps> = ({ state, size }) => {
  // Determine color and glow styles for the halo
  const getFilterStyle = () => {
    switch (state) {
      case "error":
        // Shift gold (yellow/orange) to deep warning red
        return "hue-rotate(300deg) saturate(6) brightness(0.9) drop-shadow(0 0 18px rgba(239, 68, 68, 0.95))";
      case "sleep":
        return "brightness(0.3) saturate(0.4) blur(1px)";
      case "happy":
        return "brightness(1.2) drop-shadow(0 0 15px rgba(253, 224, 71, 0.8))";
      case "listening":
      case "thinking":
        return "brightness(1.1) drop-shadow(0 0 12px rgba(253, 224, 71, 0.7))";
      case "talking":
      case "wake":
      case "idle":
      default:
        return "brightness(1) drop-shadow(0 0 8px rgba(250, 204, 21, 0.4))";
    }
  };

  // The halo is offset vertically so it floats above the main avatar body
  const haloOffset = -size * 0.42;

  return (
    <div
      className="absolute flex items-center justify-center pointer-events-none select-none z-10"
      style={{
        width: size * 0.95,
        height: size * 0.45,
        transform: `translateY(${haloOffset}px)`,
      }}
    >
      <motion.img
        src={haloImage}
        alt="Nova Halo"
        className="w-full h-full object-contain transition-all duration-300 ease-out"
        variants={haloVariants}
        animate={state}
        style={{
          filter: getFilterStyle(),
          transformOrigin: "center center",
          willChange: "transform, filter",
        }}
      />
    </div>
  );
};
