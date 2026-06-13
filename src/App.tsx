import { useState, useEffect, useRef } from "react";
import {
  Activity,
  Mic,
  Cpu,
  Volume2,
  Smile,
  AlertTriangle,
  Moon,
  Sun,
  Code,
  Terminal,
  Play,
  RotateCcw,
  Sliders,
  Settings,
  Flame,
  Radio,
  FileText
} from "lucide-react";
import { NovaAvatar } from "./components/NovaAvatar";
import { useAvatarState } from "./hooks/useAvatarState";
import type { AvatarState } from "./hooks/useAvatarState";

function App() {
  const { state, audioLevel, setState, setAudioLevel } = useAvatarState("idle");
  const [size, setSize] = useState<number>(320);
  const [micSimulationActive, setMicSimulationActive] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const simInterval = useRef<number | null>(null);

  // Add system console logs helper
  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [`[${time}] ${message}`, ...prev.slice(0, 14)]);
  };

  // Log state updates
  useEffect(() => {
    addLog(`Avatar state transitioned to: "${state.toUpperCase()}"`);
  }, [state]);

  // Handle micro-microphone simulation using sine waves
  useEffect(() => {
    if (micSimulationActive) {
      addLog("Mic simulation activated. Simulating vocal frequencies...");
      let tick = 0;
      simInterval.current = window.setInterval(() => {
        tick += 0.15;
        // Generate values between 0.05 and 0.95 simulating speech sound level
        const val = Math.abs(Math.sin(tick) * 0.4) + Math.abs(Math.cos(tick * 2) * 0.4) + Math.random() * 0.15;
        const level = Math.max(0.02, Math.min(0.98, val));
        setAudioLevel(level);
        
        // Also update window.NovaAvatar level if registered
        if (window.NovaAvatar) {
          window.NovaAvatar.setAudioLevel(level);
        }
      }, 100);
    } else {
      if (simInterval.current) {
        window.clearInterval(simInterval.current);
        simInterval.current = null;
      }
      setAudioLevel(0);
      if (window.NovaAvatar) {
        window.NovaAvatar.setAudioLevel(0);
      }
      addLog("Mic simulation deactivated. Audio level reset to 0.");
    }

    return () => {
      if (simInterval.current) {
        window.clearInterval(simInterval.current);
      }
    };
  }, [micSimulationActive, setAudioLevel]);

  // Hook up window functions to log when state/audio is changed externally
  useEffect(() => {
    // Wrap original window API methods to log updates
    if (window.NovaAvatar) {
      const origSetState = window.NovaAvatar.setState;
      const origSetAudioLevel = window.NovaAvatar.setAudioLevel;

      window.NovaAvatar.setState = (s: AvatarState) => {
        addLog(`External Event: setState("${s}") received.`);
        origSetState(s);
      };

      window.NovaAvatar.setAudioLevel = (level: number) => {
        origSetAudioLevel(level);
      };
    }
  }, [setState, setAudioLevel]);

  // Run a mock backend chat conversation flow
  const runSequence = () => {
    addLog("Starting automated pipeline simulation...");
    
    // Step 1: Listening
    setTimeout(() => {
      setState("listening");
      addLog("Pipeline: Nova detected user wake phrase. Listening...");
    }, 200);

    // Step 2: Thinking
    setTimeout(() => {
      setState("thinking");
      addLog("Pipeline: Dispatching request. Thinking...");
    }, 2500);

    // Step 3: Talking with auto voice
    setTimeout(() => {
      setState("talking");
      setMicSimulationActive(true);
      addLog("Pipeline: Received TTS audio stream. Talking...");
    }, 5000);

    // Step 4: Happy Achievement
    setTimeout(() => {
      setMicSimulationActive(false);
      setState("happy");
      addLog("Pipeline: Completed synthesis successfully. Happy!");
    }, 9500);

    // Step 5: Idle
    setTimeout(() => {
      setState("idle");
      addLog("Pipeline: Cycle complete. Returning to Idle state.");
    }, 12000);
  };

  // Code snippets for Backend integration
  const codeSnippetPython = `from fastapi import FastAPI, WebSocket
import asyncio

app = FastAPI()

@app.websocket("/ws/avatar")
async def websocket_avatar(websocket: WebSocket):
    await websocket.accept()
    # Trigger states on events
    await websocket.send_json({"state": "listening"})
    await asyncio.sleep(2)
    
    await websocket.send_json({"state": "thinking"})
    await asyncio.sleep(3)
    
    # Send talking state along with real-time audio amplitudes
    await websocket.send_json({"state": "talking"})
    for amp in [0.2, 0.6, 0.8, 0.4, 0.7, 0.1]:
        await websocket.send_json({"audioLevel": amp})
        await asyncio.sleep(0.1)
        
    await websocket.send_json({"state": "idle"})`;

  const codeSnippetJS = `// Connect to backend WebSocket and update NovaAvatar in real-time
const ws = new WebSocket("ws://localhost:8000/ws/avatar");

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.state && window.NovaAvatar) {
    window.NovaAvatar.setState(data.state);
  }
  
  if (data.audioLevel !== undefined && window.NovaAvatar) {
    window.NovaAvatar.setAudioLevel(data.audioLevel);
  }
};`;

  return (
    <div className="relative min-h-screen bg-dark-bg text-gray-200 cyber-grid pb-12">
      {/* Background glowing gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-glowing/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-glowing/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Header */}
      <header className="border-b border-gray-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center bg-cyan-950/30 glow-cyan-glow">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <h1 className="text-xl font-bold tracking-wider font-display bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              NOVA CORE SYSTEM
            </h1>
          </div>
          <div className="flex items-center gap-2 border border-cyan-500/20 px-3 py-1.5 rounded-full bg-cyan-950/20">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
              ONLINE - STATE: {state}
            </span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Avatar Display (Cols 1-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden">
            {/* Ambient grid lines inside avatar display */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/80 pointer-events-none z-10" />
            
            {/* The main Nova Avatar */}
            <NovaAvatar state={state} audioLevel={audioLevel} size={size} />

            {/* Visualizer bars below the avatar (Only active during talking/listening) */}
            <div className="h-6 flex items-center gap-1 mt-6 z-20">
              {Array.from({ length: 16 }).map((_, i) => {
                const amp = state === "talking" 
                  ? Math.max(0.1, audioLevel * (0.3 + Math.sin(i * 0.5) * 0.7) * (0.8 + Math.random() * 0.2)) 
                  : state === "listening" 
                  ? 0.1 + Math.random() * 0.2
                  : 0.05;
                return (
                  <div
                    key={i}
                    className="w-1.5 rounded-full transition-all duration-75 bg-gradient-to-t from-blue-500 to-cyan-400"
                    style={{
                      height: `${amp * 100}%`,
                      opacity: state === "talking" || state === "listening" ? 0.95 : 0.2,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Quick Simulation controls */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h2 className="font-semibold text-sm uppercase tracking-wider text-cyan-400 font-display">
                  Parameters Configuration
                </h2>
              </div>
              <Settings className="w-4 h-4 text-gray-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Size Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-mono">AVATAR CONTAINER SIZE</span>
                  <span className="font-mono font-bold text-white">{size}px</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="450"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Audio Amplitude Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="font-mono flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5" /> MANUAL AUDIO LEVEL
                  </span>
                  <span className="font-mono font-bold text-white">{(audioLevel * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audioLevel * 100}
                  disabled={micSimulationActive || state !== "talking"}
                  onChange={(e) => {
                    const val = Number(e.target.value) / 100;
                    setAudioLevel(val);
                    if (window.NovaAvatar) {
                      window.NovaAvatar.setAudioLevel(val);
                    }
                  }}
                  className={`w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-amber-400 ${
                    state !== "talking" || micSimulationActive ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            {/* Simulated Microphone frequency generator */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-800/60 pt-4">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-300">Simulate Talking Waveform</span>
                <span className="text-2xs text-gray-500">Injects vocal frequency levels in real-time</span>
              </div>
              <button
                onClick={() => setMicSimulationActive(!micSimulationActive)}
                disabled={state !== "talking"}
                className={`text-xs px-4 py-1.5 rounded-full border transition-all flex items-center gap-1.5 font-bold uppercase tracking-wider ${
                  state !== "talking" 
                    ? "opacity-30 border-gray-800 text-gray-500 cursor-not-allowed"
                    : micSimulationActive
                    ? "border-amber-400 text-amber-400 bg-amber-950/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "border-gray-700 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
                }`}
              >
                <Mic className={`w-3.5 h-3.5 ${micSimulationActive ? "animate-pulse" : ""}`} />
                {micSimulationActive ? "Simulating mic" : "Simulate mic"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: States Controls & Console (Cols 8-12) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Nova State Select Panel */}
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-cyan-400 font-display border-b border-gray-800 pb-2 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> State Selection
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "idle", icon: Sun, label: "1. Idle" },
                { id: "listening", icon: Mic, label: "2. Listening" },
                { id: "thinking", icon: Cpu, label: "3. Thinking" },
                { id: "talking", icon: Volume2, label: "4. Talking" },
                { id: "happy", icon: Smile, label: "5. Happy" },
                { id: "error", icon: AlertTriangle, label: "6. Error" },
                { id: "sleep", icon: Moon, label: "7. Sleep" },
                { id: "wake", icon: Play, label: "8. Wake" },
              ].map((item) => {
                const Icon = item.icon;
                const active = state === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "happy") {
                        setState("happy");
                        // Automatically return to idle after burst finishes (2s)
                        setTimeout(() => {
                          setState("idle");
                        }, 2000);
                      } else {
                        setState(item.id as AvatarState);
                      }
                    }}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      active
                        ? "border-cyan-400 bg-cyan-950/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] scale-[1.03]"
                        : "border-gray-800 hover:border-gray-700 bg-slate-900/40 hover:bg-slate-900 text-gray-300"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-cyan-400" : "text-gray-400"}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-gray-800/60">
              <button
                onClick={runSequence}
                className="w-full py-2.5 rounded-xl border border-cyan-500 text-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all"
              >
                <Play className="w-4 h-4" /> Run Full API Sequence
              </button>
            </div>
          </div>

          {/* System Console Logs */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col min-h-[220px]">
            <h2 className="font-semibold text-xs uppercase tracking-wider text-cyan-400 font-display border-b border-gray-800 pb-2 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2"><Terminal className="w-4 h-4" /> Event Stream Console</span>
              <button 
                onClick={() => setConsoleLogs([])} 
                className="text-2xs text-gray-500 hover:text-cyan-400 uppercase tracking-widest font-mono flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear
              </button>
            </h2>
            <div className="flex-1 bg-slate-950/70 border border-gray-800/50 rounded-xl p-3 font-mono text-[11px] leading-relaxed overflow-y-auto max-h-[160px]">
              {consoleLogs.length === 0 ? (
                <div className="text-gray-600 text-center py-6">Listening for core systems notifications...</div>
              ) : (
                consoleLogs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`${
                      log.includes("TRANSITION") ? "text-cyan-400" :
                      log.includes("API") ? "text-indigo-300" :
                      log.includes("ERROR") ? "text-red-400" :
                      log.includes("Vocal") ? "text-amber-300" :
                      log.includes("External") ? "text-sky-300" : "text-gray-400"
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Integration Code Guides Section */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="glass-panel rounded-3xl p-8">
          <div className="flex items-center gap-2.5 border-b border-gray-800 pb-4 mb-6">
            <Code className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-lg font-bold tracking-wider font-display bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                BACKEND INTEGRATION SPECIFICATION
              </h2>
              <p className="text-2xs text-gray-500 uppercase tracking-wider font-mono">
                How to integrate the animatable interface with FastAPI, Flask, WebSockets, or Electron IPC
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* FastAPI WebSocket Example */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-cyan-400">
                <Flame className="w-4 h-4" /> 1. FastAPI WebSocket Handler (Python)
              </h3>
              <pre className="bg-slate-950 border border-gray-800/80 rounded-2xl p-4 font-mono text-[11px] leading-relaxed overflow-x-auto text-cyan-200">
                <code>{codeSnippetPython}</code>
              </pre>
            </div>

            {/* FrontEnd WebSocket consumer */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-indigo-400">
                <FileText className="w-4 h-4" /> 2. React WebSocket Listener (TypeScript)
              </h3>
              <pre className="bg-slate-950 border border-gray-800/80 rounded-2xl p-4 font-mono text-[11px] leading-relaxed overflow-x-auto text-indigo-200">
                <code>{codeSnippetJS}</code>
              </pre>
              <div className="text-xs border border-cyan-500/20 rounded-xl p-4 bg-cyan-950/10">
                <h4 className="font-bold text-cyan-400 flex items-center gap-1.5 mb-1.5 uppercase text-2xs tracking-widest">
                  <Activity className="w-3.5 h-3.5 animate-pulse" /> Developer Integration Tip
                </h4>
                <p className="text-gray-400 leading-relaxed text-2xs">
                  Whenever the avatar component is active, the useAvatarState hook registers helper setters directly onto the global 
                  <code className="text-cyan-300 bg-slate-900 border border-gray-800 px-1 py-0.5 mx-1 rounded">window.NovaAvatar</code> 
                  object. This allows any external Python script, WebSocket channel, or Electron main process to instantly change 
                  states or push audio amplitudes dynamically by calling 
                  <code className="text-cyan-300 bg-slate-900 border border-gray-800 px-1 py-0.5 mx-1 rounded">window.NovaAvatar.setState("talking")</code> 
                  without triggering React re-renders or breaking layouts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
