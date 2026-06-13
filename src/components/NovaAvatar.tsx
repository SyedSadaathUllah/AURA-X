import React from "react";
import { motion } from "framer-motion";
import type { AvatarState } from "../hooks/useAvatarState";
import { bodyVariants } from "../animations/variants";

// Import the pre-rendered character images cropped from the spec image
import idleImg from "../assets/idle.png";
import listeningImg from "../assets/listening.png";
import thinkingImg from "../assets/thinking.png";
import talkingImg from "../assets/talking.png";
import happyImg from "../assets/happy.png";
import errorImg from "../assets/error.png";

interface NovaAvatarProps {
  state: AvatarState;
  audioLevel?: number;
  size?: number;
}

export const NovaAvatar: React.FC<NovaAvatarProps> = ({
  state,
  audioLevel = 0,
  size = 320,
}) => {
  // Determine which image file to use for the character
  const getCharacterImage = () => {
    switch (state) {
      case "listening":
        return listeningImg;
      case "thinking":
        return thinkingImg;
      case "talking":
        return talkingImg;
      case "happy":
        return happyImg;
      case "error":
        return errorImg;
      case "sleep":
      case "wake":
      case "idle":
      default:
        return idleImg;
    }
  };

  // Sleep state applies a dimming/saturation filter to the idle image
  const getImageFilter = () => {
    if (state === "sleep") {
      return "brightness(0.35) saturate(0.5) contrast(0.9) blur(1px)";
    }
    return "none";
  };

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Main Single-Image Animated Character Container */}
      <motion.div
        className="relative flex items-center justify-center w-[74%] h-[74%] z-20"
        variants={bodyVariants}
        animate={state === "talking" ? "talking" : state}
        custom={audioLevel}
        style={{
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        <img
          src={getCharacterImage()}
          alt={`Nova AI - ${state}`}
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out"
          style={{
            filter: getImageFilter(),
          }}
        />
      </motion.div>
    </div>
  );
};

export default NovaAvatar;
