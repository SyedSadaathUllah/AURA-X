import { useState, useEffect, useCallback } from "react";

export type AvatarState =
  | "idle"
  | "listening"
  | "thinking"
  | "talking"
  | "happy"
  | "error"
  | "sleep"
  | "wake";

interface WindowNovaAvatar {
  setState: (state: AvatarState) => void;
  setAudioLevel: (level: number) => void;
  getState: () => AvatarState;
  getAudioLevel: () => number;
}

declare global {
  interface Window {
    NovaAvatar?: WindowNovaAvatar;
  }
}

export function useAvatarState(initialState: AvatarState = "idle") {
  const [state, setInternalState] = useState<AvatarState>(initialState);
  const [audioLevel, setInternalAudioLevel] = useState<number>(0);

  // Transition handler that handles Sleep/Wake sequencing
  const setState = useCallback((newState: AvatarState) => {
    setInternalState((currentState) => {
      // If we are transitioning to sleep and are currently awake
      if (newState === "sleep" && currentState === "wake") {
        return "sleep";
      }
      // If waking up from sleep, we go to wake state first
      if (newState === "idle" && currentState === "sleep") {
        // Automatically transition sleep -> wake -> idle
        setTimeout(() => {
          setInternalState("idle");
        }, 1500); // 1.5s wake sequence
        return "wake";
      }
      return newState;
    });
  }, []);

  const setAudioLevel = useCallback((level: number) => {
    // Clamp audioLevel between 0 and 1
    const clampedLevel = Math.max(0, Math.min(1, level));
    setInternalAudioLevel(clampedLevel);
  }, []);

  useEffect(() => {
    // Expose APIs on window for backend integration (FastAPI, WebSockets, Electron IPC)
    window.NovaAvatar = {
      setState,
      setAudioLevel,
      getState: () => state,
      getAudioLevel: () => audioLevel,
    };

    // Clean up global references when component unmounts to prevent memory leaks
    return () => {
      if (window.NovaAvatar) {
        delete window.NovaAvatar;
      }
    };
  }, [state, audioLevel, setState, setAudioLevel]);

  return {
    state,
    audioLevel,
    setState,
    setAudioLevel,
  };
}
