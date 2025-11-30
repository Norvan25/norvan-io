import { useEffect, useState } from "react";
import { MicOff, X } from "lucide-react";
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
    <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl transition-opacity duration-500 ${isSessionActive || isLoading ? 'opacity-100' : 'opacity-0'}`}>

      <button
        onClick={toggleVoice}
        className="absolute top-8 right-8 p-4 bg-white/5 rounded-full hover:bg-red-500/20 transition-colors border border-white/10"
      >
        <X className="w-6 h-6 text-gray-400 hover:text-red-500" />
      </button>

      <div className="flex flex-col items-center gap-12 w-full max-w-md px-6">

        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold font-mono tracking-widest text-white">
            {isLoading ? "INITIALIZING UPLINK" : "NORAYR ONLINE"}
          </h2>
          <p className="text-xs md:text-sm font-mono text-[#00A6FB] tracking-[0.2em] animate-pulse">
            {isLoading ? "CONNECTING TO NEURAL CORE..." : "LISTENING..."}
          </p>
        </div>

        <div className="h-32 flex items-center gap-2 md:gap-3">
          {isLoading ? (
            <div className="w-24 h-24 border-4 border-[#00A6FB]/30 border-t-[#00A6FB] rounded-full animate-spin" />
          ) : (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-3 md:w-4 bg-gradient-to-t from-[#00A6FB] to-cyan-200 rounded-full transition-all duration-150 ease-in-out"
                  style={{
                    height: isSpeaking ? `${Math.random() * 100 + 20}%` : '10%',
                    animation: isSpeaking ? `wave 0.5s infinite ease-in-out ${i * 0.1}s` : 'none',
                    opacity: 0.8
                  }}
                />
              ))}
            </>
          )}
        </div>

        <button
          onClick={toggleVoice}
          className="mt-12 group flex items-center gap-4 px-8 py-4 bg-red-500/10 border border-red-500/50 rounded-full hover:bg-red-500/20 transition-all shadow-[0_0_30px_rgba(239,68,68,0.2)]"
        >
          <MicOff className="w-6 h-6 text-red-400" />
          <span className="text-sm font-mono font-bold text-red-400 tracking-widest">
            TERMINATE SESSION
          </span>
        </button>

      </div>

      <style>{`
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>

    </div>
  );
}
