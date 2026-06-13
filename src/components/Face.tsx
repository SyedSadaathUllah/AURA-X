import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AvatarState } from "../hooks/useAvatarState";

interface FaceProps {
  state: AvatarState;
  audioLevel?: number;
  size: number;
}

export const Face: React.FC<FaceProps> = ({ state, audioLevel = 0, size }) => {
  // Glow color based on state
  const glowColor = state === "error" ? "#ff3333" : "#00d4ff";

  // Determine eye animations and shapes
  const renderLeftEye = () => {
    switch (state) {
      case "happy":
        // Smile eyes (^ shape)
        return (
          <motion.path
            key="happy-left"
            d="M -12,4 Q 0,-8 12,4"
            fill="none"
            stroke={glowColor}
            strokeWidth="5.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.2 }}
          />
        );
      case "error":
        // Concerned/worried eye slanted down-outward ( \ / )
        return (
          <motion.path
            key="error-left"
            d="M -10,-8 L 8,4"
            fill="none"
            stroke={glowColor}
            strokeWidth="5.5"
            strokeLinecap="round"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        );
      case "sleep":
        // Closed flat eye (- -)
        return (
          <motion.path
            key="sleep-left"
            d="M -10,0 L 10,0"
            fill="none"
            stroke={glowColor}
            strokeWidth="4.5"
            strokeLinecap="round"
            initial={{ scaleY: 0.1 }}
            animate={{ scaleY: 1 }}
          />
        );
      case "thinking":
        // Curious round eyes blinking occasionally
        return (
          <motion.ellipse
            key="thinking-left"
            cx="0"
            cy="0"
            rx="7"
            ry="7"
            fill={glowColor}
            animate={{
              scaleY: [1, 1, 0.1, 1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut",
            }}
          />
        );
      case "listening":
        // Large wide-open attentive eyes
        return (
          <motion.ellipse
            key="listening-left"
            cx="0"
            cy="0"
            rx="9"
            ry="17"
            fill={glowColor}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        );
      case "talking":
        // Animated reactive talking eye
        return (
          <motion.ellipse
            key="talking-left"
            cx="0"
            cy="0"
            rx="7"
            ry={13 + audioLevel * 3}
            fill={glowColor}
            animate={{
              scaleY: [1, 1, 0.1, 1],
            }}
            transition={{
              scaleY: {
                duration: 4,
                repeat: Infinity,
                repeatDelay: 3,
              },
            }}
          />
        );
      case "wake":
        // Slowly opening slit
        return (
          <motion.ellipse
            key="wake-left"
            cx="0"
            cy="0"
            rx="8"
            ry="2.5"
            fill={glowColor}
            initial={{ scaleY: 0.1 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5 }}
          />
        );
      case "idle":
      default:
        // Normal oval capsule eyes
        return (
          <motion.ellipse
            key="idle-left"
            cx="0"
            cy="0"
            rx="7.5"
            ry="14"
            fill={glowColor}
            animate={{
              scaleY: [1, 1, 0.1, 1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 4,
              ease: "easeInOut",
            }}
          />
        );
    }
  };

  const renderRightEye = () => {
    switch (state) {
      case "happy":
        return (
          <motion.path
            key="happy-right"
            d="M -12,4 Q 0,-8 12,4"
            fill="none"
            stroke={glowColor}
            strokeWidth="5.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.2 }}
          />
        );
      case "error":
        // Concerned/worried eye slanted down-inward ( / \ )
        return (
          <motion.path
            key="error-right"
            d="M 10,-8 L -8,4"
            fill="none"
            stroke={glowColor}
            strokeWidth="5.5"
            strokeLinecap="round"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
        );
      case "sleep":
        return (
          <motion.path
            key="sleep-right"
            d="M -10,0 L 10,0"
            fill="none"
            stroke={glowColor}
            strokeWidth="4.5"
            strokeLinecap="round"
            initial={{ scaleY: 0.1 }}
            animate={{ scaleY: 1 }}
          />
        );
      case "thinking":
        return (
          <motion.ellipse
            key="thinking-right"
            cx="0"
            cy="0"
            rx="7"
            ry="7"
            fill={glowColor}
            animate={{
              scaleY: [1, 1, 0.1, 1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2.3, // slightly offset blink time
              ease: "easeInOut",
            }}
          />
        );
      case "listening":
        return (
          <motion.ellipse
            key="listening-right"
            cx="0"
            cy="0"
            rx="9"
            ry="17"
            fill={glowColor}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          />
        );
      case "talking":
        return (
          <motion.ellipse
            key="talking-right"
            cx="0"
            cy="0"
            rx="7"
            ry={13 + audioLevel * 3}
            fill={glowColor}
            animate={{
              scaleY: [1, 1, 0.1, 1],
            }}
            transition={{
              scaleY: {
                duration: 4,
                repeat: Infinity,
                repeatDelay: 3.2,
              },
            }}
          />
        );
      case "wake":
        return (
          <motion.ellipse
            key="wake-right"
            cx="0"
            cy="0"
            rx="8"
            ry="2.5"
            fill={glowColor}
            initial={{ scaleY: 0.1 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5 }}
          />
        );
      case "idle":
      default:
        return (
          <motion.ellipse
            key="idle-right"
            cx="0"
            cy="0"
            rx="7.5"
            ry="14"
            fill={glowColor}
            animate={{
              scaleY: [1, 1, 0.1, 1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatDelay: 4.1, // offset blink
              ease: "easeInOut",
            }}
          />
        );
    }
  };

  const renderMouth = () => {
    switch (state) {
      case "happy":
        // Curved smiling mouth
        return (
          <motion.path
            key="mouth-happy"
            d="M -15,-2 Q 0,16 15,-2 Z"
            fill={glowColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        );
      case "error":
        // Downward curved worried mouth
        return (
          <motion.path
            key="mouth-error"
            d="M -10,6 Q 0,-2 10,6"
            fill="none"
            stroke={glowColor}
            strokeWidth="4.5"
            strokeLinecap="round"
            initial={{ y: 2 }}
            animate={{ y: 0 }}
          />
        );
      case "sleep":
        // Tiny relaxed mouth circle
        return (
          <motion.ellipse
            key="mouth-sleep"
            cx="0"
            cy="0"
            rx="3.5"
            ry="2"
            fill="none"
            stroke={glowColor}
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      case "thinking":
        // Thinking wavy line
        return (
          <motion.path
            key="mouth-thinking"
            d="M -10,1 Q -5,-2 0,1 Q 5,4 10,1"
            fill="none"
            stroke={glowColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      case "listening":
        // Attentive flat line
        return (
          <motion.line
            key="mouth-listening"
            x1="-8"
            y1="0"
            x2="8"
            y2="0"
            stroke={glowColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      case "talking":
        // Real-time audio reactive talking mouth!
        // Vertically expands capsules from audioLevel
        const mouthHeight = 1.5 + audioLevel * 10;
        return (
          <motion.rect
            key="mouth-talking"
            x="-8"
            y={-mouthHeight}
            width="16"
            height={mouthHeight * 2}
            rx={8}
            fill={glowColor}
            style={{ originY: 0.5 }}
          />
        );
      case "wake":
        return (
          <motion.line
            key="mouth-wake"
            x1="-5"
            y1="0"
            x2="5"
            y2="0"
            stroke={glowColor}
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        );
      case "idle":
      default:
        // Gentle neutral smile mouth
        return (
          <motion.path
            key="mouth-idle"
            d="M -10,-1 Q 0,3 10,-1"
            fill="none"
            stroke={glowColor}
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
    }
  };

  // Face size is roughly 35% of the overall size, centered inside the visor
  const faceWidth = size * 0.45;
  const faceHeight = size * 0.3;

  return (
    <div
      className="absolute flex items-center justify-center pointer-events-none select-none z-30"
      style={{
        width: faceWidth,
        height: faceHeight,
        // Position it exactly inside the visor area of the body
        transform: `translateY(${size * 0.04}px)`,
      }}
    >
      <svg
        viewBox="0 0 300 200"
        className="w-full h-full overflow-visible"
        style={{
          filter: `drop-shadow(0 0 8px ${glowColor})`,
        }}
      >
        <defs>
          <filter id="nova-visor-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#nova-visor-glow)">
          {/* Left Eye Group */}
          <g transform="translate(100, 90)">
            <AnimatePresence mode="wait">
              {renderLeftEye()}
            </AnimatePresence>
          </g>

          {/* Right Eye Group */}
          <g transform="translate(200, 90)">
            <AnimatePresence mode="wait">
              {renderRightEye()}
            </AnimatePresence>
          </g>

          {/* Mouth Group */}
          <g transform="translate(150, 142)">
            <AnimatePresence mode="wait">
              {renderMouth()}
            </AnimatePresence>
          </g>
        </g>
      </svg>
    </div>
  );
};
