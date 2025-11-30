import { useState } from "react";
import { Mic, MessageSquareCode, CalendarCheck, Volume2, Smartphone } from "lucide-react";
import { PopupModal } from "react-calendly";
import { useNorVoice } from '../../hooks/useNorVoice';
import { useAudioOutput } from '../../hooks/useAudioOutput';

const Spinner = () => (
  <svg className="animate-spin h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function GlobalCommandArray() {
  const { isSessionActive, isSpeaking, isLoading, toggleVoice } = useNorVoice();
  const { isSupported, toggleOutput, activeDeviceLabel } = useAudioOutput();
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const displayLabel = activeDeviceLabel.toLowerCase().includes('speaker') ? 'SPEAKER' : 'PHONE';

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 md:bottom-10 z-[9999] pointer-events-auto flex items-center gap-[26px] md:gap-[30px]">

      <div className="relative">
        {isSessionActive && isSupported && (
          <div
            onClick={(e) => { e.stopPropagation(); toggleOutput(); }}
            className="absolute -top-14 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-3 py-1.5 bg-black/90 backdrop-blur-md border border-white/20 rounded-full cursor-pointer hover:border-[#00A6FB] hover:text-[#00A6FB] text-gray-300 transition-all shadow-[0_0_20px_rgba(0,0,0,0.8)]"
          >
            {displayLabel === 'SPEAKER' ? <Volume2 className="w-3 h-3" /> : <Smartphone className="w-3 h-3" />}
            <span className="text-[9px] font-mono font-bold tracking-wider whitespace-nowrap">
              {displayLabel}
            </span>
          </div>
        )}

        <button
          onClick={toggleVoice}
          disabled={isLoading}
          className={`group relative rounded-full flex items-center justify-center transition-all duration-500
            w-[72px] h-[72px] md:w-[64px] md:h-[64px]
            backdrop-blur-2xl border-2
            ${isLoading
               ? 'border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_50px_rgba(234,179,8,0.4)]'
               : isSessionActive
                 ? 'border-red-500/50 bg-red-500/20 shadow-[0_0_60px_rgba(239,68,68,0.7)] animate-pulse'
                 : 'border-[#00A6FB]/40 bg-[#00A6FB]/10 shadow-[0_0_40px_rgba(0,166,251,0.3)] hover:shadow-[0_0_60px_rgba(0,166,251,0.6)] hover:border-[#00A6FB]/80'
            }
          `}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-70" />
          {isSpeaking && <div className="absolute inset-[-8px] rounded-full border border-red-400/50 opacity-40 animate-ping" />}
          <div className="relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
            {isLoading ? <Spinner /> : (
              <Mic className={`w-8 h-8 md:w-7 md:h-7 transition-colors ${isSessionActive ? 'text-white' : 'text-cyan-200 group-hover:text-white'}`} />
            )}
          </div>
        </button>
      </div>

      <button
        className="group relative rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
          w-[72px] h-[72px] md:w-[64px] md:h-[64px]
          shadow-[0_0_40px_rgba(0,158,96,0.25)] hover:shadow-[0_0_60px_rgba(0,158,96,0.5)]
          border border-[#009E60]/40 bg-[#009E60]/10 hover:bg-[#009E60]/20 hover:border-[#009E60]/80 backdrop-blur-2xl"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50" />
        <MessageSquareCode className="relative z-10 w-8 h-8 md:w-7 md:h-7 text-emerald-200 group-hover:text-white transition-colors drop-shadow-[0_0_15px_rgba(0,158,96,0.8)]" />
      </button>

      <button
        onClick={() => setIsCalendlyOpen(true)}
        className="group relative rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
          w-[72px] h-[72px] md:w-[64px] md:h-[64px]
          shadow-[0_0_40px_rgba(242,133,0,0.25)] hover:shadow-[0_0_60px_rgba(242,133,0,0.5)]
          border border-[#F28500]/40 bg-[#F28500]/10 hover:bg-[#F28500]/20 hover:border-[#F28500]/80 backdrop-blur-2xl"
      >
        <div className="absolute inset-1 rounded-full bg-[#F28500]/5 group-hover:bg-[#F28500]/20 transition-colors" />
        <CalendarCheck className="relative z-10 w-8 h-8 md:w-7 md:h-7 text-orange-200 group-hover:text-white transition-colors drop-shadow-[0_0_15px_rgba(242,133,0,0.8)]" />
      </button>

      <PopupModal
        url="https://calendly.com/emil-petrosyan-norvan/30min"
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")!}
      />
    </div>
  );
}
