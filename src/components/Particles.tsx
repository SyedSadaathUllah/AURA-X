import React, { useRef, useEffect } from "react";
import type { AvatarState } from "../hooks/useAvatarState";

interface ParticlesProps {
  state: AvatarState;
  size: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay?: number;
  isZ?: boolean;
  zText?: string;
  rotation?: number;
  rotationSpeed?: number;
}

export const Particles: React.FC<ParticlesProps> = ({ state, size }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const stateRef = useRef<AvatarState>(state);

  // Sync state reference to use inside the requestAnimationFrame loop
  useEffect(() => {
    stateRef.current = state;
    
    // Trigger happy burst immediately when transitioning to happy state
    if (state === "happy") {
      triggerHappyBurst();
    }
  }, [state]);

  const triggerHappyBurst = () => {
    const particles = particlesRef.current;
    const colors = ["#00d4ff", "#c084fc", "#eab308", "#3b82f6", "#ffffff"];
    
    // Spawn 40 particles shooting outward from center
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particles.push({
        x: size / 2,
        y: size / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: 0.015 + Math.random() * 0.02,
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas sizes
    canvas.width = size;
    canvas.height = size;

    const particles = particlesRef.current;

    // Helper to spawn a single ambient drifting particle
    const spawnAmbientParticle = (forceBottom = false) => {
      const px = Math.random() * size;
      const py = forceBottom ? size - 5 : Math.random() * size;
      particles.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.2 - Math.random() * 0.6, // drift upward
        size: 1 + Math.random() * 2,
        color: stateRef.current === "error" ? "#ff4444" : "#00d4ff",
        alpha: 0.15 + Math.random() * 0.4,
      });
    };

    // Helper to spawn a floating Z particle (for Sleep state)
    let zSpawnTimer = 0;
    const spawnZParticle = () => {
      const zLetters = ["z", "Z", "zZ"];
      particles.push({
        x: size * 0.5 + (Math.random() - 0.5) * 35, // float from near head
        y: size * 0.38,
        vx: 0.1 + Math.random() * 0.4, // float slightly right
        vy: -0.3 - Math.random() * 0.5, // float upward
        size: 10 + Math.random() * 8, // Font size
        color: "#00d4ff",
        alpha: 0.7,
        decay: 0.005 + Math.random() * 0.008,
        isZ: true,
        zText: zLetters[Math.floor(Math.random() * zLetters.length)],
        rotation: (Math.random() - 0.5) * 0.3,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
      });
    };

    // Initialize initial ambient particles
    for (let i = 0; i < 15; i++) {
      spawnAmbientParticle();
    }

    // Main animation loop running at 60 FPS
    const update = () => {
      ctx.clearRect(0, 0, size, size);

      const currentState = stateRef.current;

      // 1. Spawning Logic based on state
      if (currentState !== "sleep" && particles.length < 25 && Math.random() < 0.05) {
        spawnAmbientParticle(true);
      }

      if (currentState === "sleep") {
        zSpawnTimer++;
        if (zSpawnTimer >= 80) { // spawn Z roughly every 1.3 seconds
          spawnZParticle();
          zSpawnTimer = 0;
        }
      }

      // 2. Update and Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Apply decay if defined, else slow alpha decay for ambient drifting
        if (p.decay !== undefined) {
          p.alpha -= p.decay;
        } else {
          // Drifters fade out near the top
          if (p.y < 30) {
            p.alpha -= 0.01;
          }
        }

        // Apply Z wobble physics (drift back and forth)
        if (p.isZ) {
          p.vx += Math.sin(p.y * 0.05) * 0.01; // wobble horizontally
          if (p.rotation !== undefined && p.rotationSpeed !== undefined) {
            p.rotation += p.rotationSpeed;
          }
        }

        // Remove dead particles
        if (p.alpha <= 0 || p.x < 0 || p.x > size || p.y < 0 || p.y > size) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.isZ && p.zText) {
          ctx.font = `bold ${p.size}px 'Space Grotesk', sans-serif`;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.translate(p.x, p.y);
          if (p.rotation) {
            ctx.rotate(p.rotation);
          }
          ctx.fillText(p.zText, 0, 0);
        } else {
          // Draw standard circular sparkle or particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = currentState === "happy" ? 8 : 4;
          ctx.fill();
        }
        
        ctx.restore();
      }

      animationFrameId.current = requestAnimationFrame(update);
    };

    update();

    // Cleanup logic to prevent memory leaks and cancel rendering cycles on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        width: size,
        height: size,
      }}
    />
  );
};
