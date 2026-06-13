import type { Variants } from "framer-motion";

// Body movement animation variants (Floating, Leaning, Shaking, Spinning)
export const bodyVariants: Variants = {
  idle: {
    y: [-10, 10, -10],
    rotate: 0,
    scale: 1,
    transition: {
      y: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  listening: {
    y: [-4, 4, -4],
    rotate: [5, 7, 5], // slight tilt while floating
    scale: 1.05,
    transition: {
      scale: { duration: 0.5, ease: "easeOut" },
      y: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
      rotate: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  thinking: {
    x: [0, 6, 0, -6, 0], // Circular motion X
    y: [-6, 0, 6, 0, -6], // Circular motion Y (out of phase)
    rotate: [-3, 3, -3], // Gentle left/right tilt
    scale: 1,
    transition: {
      x: {
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
      y: {
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
      rotate: {
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  talking: (audioLevel: number = 0) => ({
    y: [0, -3 - audioLevel * 15, 0], // continuous bobble driven by audio level
    scale: [1, 1.01 + audioLevel * 0.04, 1],
    transition: {
      y: {
        duration: 0.45,
        repeat: Infinity,
        ease: "easeInOut",
      },
      scale: {
        duration: 0.45,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  }),
  happy: {
    y: [-15, 5, -15], // continuous bouncing
    rotate: [-15, 15, -15], // continuous side-to-side wobble swing
    scale: [1.1, 1.15, 1.1], // breathing pulse
    transition: {
      y: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
      rotate: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
      scale: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  error: {
    x: [-6, 6, -6, 6, -3, 3, 0], // Shake animation jitter
    y: 0,
    rotate: 0,
    scale: 0.95,
    transition: {
      x: {
        duration: 0.5,
        repeat: Infinity, // continuously shake in error state
        ease: "easeInOut",
      },
    },
  },
  sleep: {
    y: [-5, 5, -5],
    rotate: 0,
    scale: 0.9,
    transition: {
      y: {
        duration: 6, // Slow floating
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  wake: {
    scale: [0.9, 1.05, 1],
    y: 0,
    rotate: 0,
    transition: {
      duration: 1.2,
      ease: "easeOut",
    },
  },
};

// Halo rotation animation variants
export const haloVariants: Variants = {
  idle: {
    rotate: [0, 360],
    transition: {
      rotate: {
        duration: 8, // Normal rotation
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
  listening: {
    rotate: [0, 360],
    transition: {
      rotate: {
        duration: 4, // 2x speed
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
  thinking: {
    rotate: [0, 360],
    transition: {
      rotate: {
        duration: 3, // Faster rotation
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
  talking: {
    rotate: [0, 360],
    transition: {
      rotate: {
        duration: 6,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
  happy: {
    rotate: [0, 720], // Quick rotation
    transition: {
      rotate: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  },
  error: {
    rotate: [-15, 15, -15, 15, 0], // Red halo twitching/shaking
    transition: {
      rotate: {
        duration: 0.6,
        repeat: 1,
        ease: "easeInOut",
      },
    },
  },
  sleep: {
    rotate: 0, // Stopped
    transition: {
      duration: 1,
    },
  },
  wake: {
    rotate: [0, 180, 360],
    transition: {
      duration: 1.5,
      ease: "easeInOut",
    },
  },
};

// Glow pulse and breathe variants
export const glowVariants: Variants = {
  idle: {
    scale: [1, 1.08, 1],
    opacity: [0.6, 0.85, 0.6],
    transition: {
      duration: 4, // Continuous breathing pulse
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  listening: {
    scale: 1.15,
    opacity: 0.95,
    transition: {
      duration: 0.3,
    },
  },
  thinking: {
    scale: [1.02, 1.1, 1.02],
    opacity: [0.7, 0.9, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  talking: (audioLevel: number = 0) => ({
    // React to audio level in real-time
    scale: 1.05 + audioLevel * 0.15,
    opacity: 0.7 + audioLevel * 0.3,
    transition: {
      duration: 0.08,
    },
  }),
  happy: {
    scale: 1.25,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  error: {
    scale: [1, 1.12, 1],
    opacity: 0.9,
    transition: {
      duration: 0.3,
      repeat: 3,
    },
  },
  sleep: {
    scale: 0.85,
    opacity: 0.25, // Very dim
    transition: {
      duration: 2,
    },
  },
  wake: {
    scale: [0.85, 1.1, 1],
    opacity: [0.25, 0.8, 0.6],
    transition: {
      duration: 1.5,
    },
  },
};
