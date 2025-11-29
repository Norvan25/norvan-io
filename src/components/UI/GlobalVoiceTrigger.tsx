import { Mic } from "lucide-react";
import { useNorVoice } from '../../hooks/useNorVoice';

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function GlobalVoiceTrigger() {
  const { isSessionActive, isSpeaking, isLoading, toggleVoice } = useNorVoice();

  return (
    <div className="fixed bottom-8 left-8 z-[9999] pointer-events-auto flex items-center gap-4">

      <button
        onClick={toggleVoice}
        disabled={isLoading}
        className={`group relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
          ${isLoading ? 'scale-95' : 'hover:scale-110'}
          ${isSessionActive ? 'shadow-[0_0_40px_rgba(239,68,68,0.4)]' : 'shadow-[0_0_30px_rgba(0,166,251,0.3)]'}
        `}
      >
        <div className={`absolute inset-0 rounded-full backdrop-blur-xl border transition-colors duration-500
          ${isSessionActive
            ? 'bg-red-500/10 border-red-500/50'
            : 'bg-[#0A1628]/80 border-[#00A6FB]/50 group-hover:border-[#00A6FB]'
          }`}
        />

        <div className={`absolute inset-2 rounded-full transition-all duration-500
          ${isSessionActive
            ? 'bg-red-500/20 animate-pulse'
            : 'bg-[#00A6FB]/10'
          }`}
        />

        {isSpeaking && (
          <div className="absolute inset-0 rounded-full border border-red-400 opacity-50 animate-ping" />
        )}

        <div className="relative z-10">
          {isLoading ? (
            <Spinner />
          ) : isSessionActive ? (
            <div className="flex flex-col items-center">
              <Mic className="w-6 h-6 text-red-400" />
              <span className="text-[8px] font-mono text-red-400 tracking-widest mt-1">LIVE</span>
            </div>
          ) : (
            <Mic className="w-6 h-6 text-[#00A6FB] group-hover:text-white transition-colors" />
          )}
        </div>

        <div className="absolute left-full ml-4 px-3 py-1 bg-black/80 backdrop-blur border border-white/10 rounded text-xs font-mono text-white tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
          {isSessionActive ? 'TERMINATE UPLINK' : 'ACTIVATE NOR-VOICE'}
        </div>

      </button>

    </div>
  );
}
