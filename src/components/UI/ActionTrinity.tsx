import { Mic, MessageSquareCode, Rocket, Loader2 } from "lucide-react";
import { useNorVoice } from '../../hooks/useNorVoice';

export default function ActionTrinity({ color = "#00A6FB" }: { color?: string }) {
  const { isSessionActive, isSpeaking, isLoading, toggleVoice } = useNorVoice();

  return (
    <div className="flex flex-row gap-2 md:gap-4 w-full md:w-auto items-stretch justify-center mt-8 pointer-events-auto relative z-50">

      <button
        onClick={toggleVoice}
        disabled={isLoading}
        className={`group relative flex-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 px-1 py-3 md:px-6 md:py-3 backdrop-blur-md border rounded-lg transition-all hover:cursor-pointer
          ${isLoading
             ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 cursor-wait'
             : isSessionActive
               ? 'border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20'
               : 'bg-white/5 border-white/10 hover:border-[#00A6FB] hover:bg-[#00A6FB]/10 text-gray-300'
          }`}
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin text-yellow-400" />
        ) : (
          <Mic className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${isSpeaking ? 'animate-ping text-red-400' : (isSessionActive ? 'text-red-400' : 'text-gray-400 group-hover:text-[#00A6FB]')}`} />
        )}

        <span className={`text-[9px] md:text-xs font-mono font-bold tracking-wider whitespace-nowrap ${isLoading ? 'text-yellow-400' : (isSessionActive ? 'text-red-400' : 'group-hover:text-white')}`}>
          {isLoading ? 'CONNECTING...' : (isSessionActive ? 'END UPLINK' : 'NOR-VOICE')}
        </span>
      </button>

      <button className="group relative flex-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 px-1 py-3 md:px-6 md:py-3 bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#009E60] rounded-lg transition-all hover:bg-[#009E60]/10 hover:cursor-pointer">
        <MessageSquareCode className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-[#009E60] transition-colors" />
        <span className="text-[9px] md:text-xs font-mono font-bold tracking-wider text-gray-300 group-hover:text-white whitespace-nowrap">
          NOR-LINK
        </span>
      </button>

      <button
        className="group relative flex-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 px-1 py-3 md:px-8 md:py-3 bg-black/40 backdrop-blur-xl border rounded-lg transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:cursor-pointer"
        style={{ borderColor: color }}
      >
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity rounded-lg" style={{ backgroundColor: color }} />
        <Rocket className="w-3 h-3 md:w-4 md:h-4 text-white group-hover:translate-x-1 transition-transform" />
        <span className="text-[9px] md:text-xs font-mono font-bold tracking-wider text-white">
          DEPLOY
        </span>
      </button>

    </div>
  );
}
