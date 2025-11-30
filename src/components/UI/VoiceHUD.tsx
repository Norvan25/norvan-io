import { useEffect, useState } from "react";
import { MicOff, X, Activity, Radio } from "lucide-react";
import { useNorVoice } from '../../hooks/useNorVoice';

export default function VoiceHUD() {
  const { isSessionActive, isSpeaking, isLoading, toggleVoice } = useNorVoice();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isLoading || isSessionActive) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isSessionActive]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none transition-opacity duration-700 ${isSessionActive || isLoading ? 'opacity-100' : 'opacity-0'}`}>

      {/* MAIN CARD */}
      <div className="relative w-[90%] max-w-[400px] h-[280px] bg-[#050a14]/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl shadow-black/50 flex flex-col items-center justify-center overflow-hidden pointer-events-auto">

        {/* SCANNER EFFECT */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,166,251,0.05)_50%,transparent_100%)] animate-[scan_3s_linear_infinite] pointer-events-none" />

        {/* CLOSE BUTTON */}
        <button
          onClick={toggleVoice}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/5 transition-colors group z-50"
        >
          <X className="w-4 h-4 text-gray-500 group-hover:text-white" />
        </button>

        {/* ACTIVE CONTENT */}
        <div className="relative z-10 flex flex-col items-center w-full gap-6">

          {/* 1. HEADER */}
          <div className="text-center space-y-2">
            <div className={`mx-auto w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-yellow-400 animate-ping' : 'bg-[#00A6FB] shadow-[0_0_10px_#00A6FB]'}`} />
            <h2 className="text-xs font-mono text-white/80 tracking-[0.3em] uppercase">
              {isLoading ? "INITIALIZING" : "NORVAN NEXUS"}
            </h2>
          </div>

          {/* 2. THE WAVE (Refined) */}
          <div className="h-24 flex items-center justify-center gap-1.5">
            {isLoading ? (
              <div className="w-12 h-12 border-2 border-[#00A6FB]/20 border-t-[#00A6FB] rounded-full animate-spin" />
            ) : (
              <>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-[#00A6FB]/0 via-[#00A6FB] to-[#00A6FB]/0 rounded-full"
                    style={{
                      height: isSpeaking ? `${Math.random() * 60 + 20}%` : '4px',
                      animation: isSpeaking ? `pulse 0.5s infinite ease-in-out ${i * 0.1}s` : 'none',
                      opacity: 0.8,
                      transition: 'height 0.1s ease'
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* 3. STATUS TEXT */}
          <p className="text-[10px] font-mono text-[#00A6FB]/60 tracking-widest animate-pulse">
            {isLoading ? "ESTABLISHING SECURE UPLINK..." : "AUDIO STREAM ACTIVE"}
          </p>

          {/* 4. END BUTTON */}
          {!isLoading && (
            <button
              onClick={toggleVoice}
              className="mt-2 px-6 py-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-full transition-all group"
            >
              <span className="text-[9px] font-mono font-bold text-red-400/80 group-hover:text-red-400 tracking-widest">
                DISCONNECT
              </span>
            </button>
          )}

        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>

    </div>
  );
}
