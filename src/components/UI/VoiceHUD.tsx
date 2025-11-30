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
    <div className={`fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none transition-opacity duration-500 ${isSessionActive || isLoading ? 'opacity-100' : 'opacity-0'}`}>

      <div className="relative w-[90%] max-w-lg h-[30vh] min-h-[300px] bg-[#0A1628]/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,166,251,0.2)] flex flex-col items-center justify-center overflow-hidden pointer-events-auto">

        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,3px_100%] pointer-events-none" />

        <button
          onClick={toggleVoice}
          className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-red-500/20 transition-colors border border-white/10 z-50 group"
        >
          <X className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
        </button>

        <div className="relative z-10 flex flex-col items-center w-full">

          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-emerald-400'} animate-pulse`} />
              <span className="text-[10px] font-mono text-gray-400 tracking-widest uppercase">
                {isLoading ? "SYSTEM HANDSHAKE" : "NEURAL LINK ESTABLISHED"}
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-bold font-mono text-white tracking-wider">
              {isLoading ? "CONNECTING TO INTELLIGENCE..." : "NORAYR LISTENING"}
            </h2>
          </div>

          <div className="relative w-full h-24 flex items-center justify-center">
            {isLoading ? (
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-[#00A6FB]/30 rounded-full" />
                <div className="absolute inset-0 border-t-2 border-[#00A6FB] rounded-full animate-spin" />
                <Radio className="absolute inset-0 m-auto w-6 h-6 text-[#00A6FB] animate-pulse" />
              </div>
            ) : (
              <div className="relative w-64 h-full flex items-center justify-center">
                <div className={`absolute inset-0 border-2 border-[#00A6FB]/30 rounded-[40%] animate-[spin_6s_linear_infinite] transition-all duration-500 ${isSpeaking ? 'scale-110 opacity-100' : 'scale-90 opacity-30'}`} />
                <div className={`absolute inset-0 border border-cyan-400/50 rounded-[35%] animate-[spin_4s_linear_infinite_reverse] transition-all duration-300 ${isSpeaking ? 'scale-125 opacity-100' : 'scale-95 opacity-20'}`} />
                <div className={`absolute inset-0 m-auto w-20 h-20 bg-[#00A6FB]/20 rounded-full blur-xl transition-all duration-200 ${isSpeaking ? 'scale-150 bg-[#00A6FB]/40' : 'scale-100'}`} />

                <Activity className={`w-8 h-8 text-white transition-transform duration-100 ${isSpeaking ? 'scale-110' : 'scale-100'}`} />
              </div>
            )}
          </div>

          {!isLoading && (
            <button
              onClick={toggleVoice}
              className="mt-8 flex items-center gap-2 px-6 py-2 bg-red-500/10 border border-red-500/30 rounded-full hover:bg-red-500/20 transition-all cursor-pointer"
            >
              <MicOff className="w-3 h-3 text-red-400" />
              <span className="text-[10px] font-mono font-bold text-red-400 tracking-widest">
                END SESSION
              </span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
