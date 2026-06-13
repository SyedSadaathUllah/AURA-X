import React from "react";
import { motion } from "framer-motion";
import type { AvatarState } from "../hooks/useAvatarState";
import { glowVariants } from "../animations/variants";
import glowImage from "../assets/glow.png";

interface GlowProps {
  state: AvatarState;
  audioLevel?: number;
  size: number;
}

export const Glow: React.FC<GlowProps> = ({ state, audioLevel = 0, size }) => {
  // Determine CSS filters for hue shifting and intensity based on the state
  const getFilterStyle = () => {
    switch (state) {
      case "error":
        // Shift cyan/blue to red
        return "hue-rotate(135deg) saturate(4) brightness(1.2) drop-shadow(0 0 35px rgba(239, 68, 68, 0.9))";
      case "happy":
        // Shift cyan/blue to purple/magenta
        return "hue-rotate(85deg) saturate(2.5) brightness(1.1) drop-shadow(0 0 30px rgba(217, 70, 239, 0.8))";
      case "listening":
        return "brightness(1.3) drop-shadow(0 0 35px rgba(0, 212, 255, 0.9))";
      case "thinking":
        return "brightness(1.1) drop-shadow(0 0 25px rgba(0, 212, 255, 0.7))";
      case "talking":
        // Dynamic drop shadow driven by real-time audioLevel
        const shadowAmt = 20 + audioLevel * 40;
        return `brightness(${1 + audioLevel * 0.4}) drop-shadow(0 0 ${shadowAmt}px rgba(0, 212, 255, 0.85))`;
      case "sleep":
        return "brightness(0.3) saturate(0.4) blur(4px)";
      case "wake":
        return "brightness(1) saturate(1.2)";
      case "idle":
      default:
        return "brightness(1) drop-shadow(0 0 20px rgba(0, 212, 255, 0.4))";
    }
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      style={{
        width: size,
        height: size,
      }}
    >
      <motion.img
        src={glowImage}
        alt="Nova Underglow"
        className="w-full h-full object-contain mix-blend-screen transition-all duration-300 ease-out"
        variants={glowVariants}
        animate={state}
        custom={audioLevel}
        style={{
          filter: getFilterStyle(),
          transformOrigin: "center center",
          willChange: "transform, filter, opacity",
        }}
      />
    </div>
  );
};
