import { useState } from "react";
import { Mic, MessageSquareCode, CalendarCheck, Volume2, Smartphone } from "lucide-react";
import { useNorVoice } from '../../hooks/useNorVoice';
import { useAudioOutput } from '../../hooks/useAudioOutput';
import BookingModal from "./BookingModal";

const Spinner = () => (
  <svg className="animate-spin h-6 w-6 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function GlobalCommandArray() {
  const { isSessionActive, isSpeaking, isLoading, toggleVoice } = useNorVoice();
  const { isSupported, toggleOutput, activeDeviceLabel } = useAudioOutput();
  const [showBooking, setShowBooking] = useState(false);

  const displayLabel = activeDeviceLabel.toLowerCase().includes('speaker') ? 'SPEAKER' : 'PHONE';

  return (
    <>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 md:bottom-10 z-[9999] pointer-events-auto flex items-center gap-[26px] md:gap-[30px]">

        <div className="relative">
          {isSessionActive && isSupported && (
            <div
              onClick={(e) => { e.stopPropagation(); toggleOutput(); }}
              className="absolute -top-14 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-3 py-1.5 bg-black/90 backdrop-blur-md border border-white/20 rounded-full cursor-pointer hover:border-[#00A6FB] hover:text-[#00A6FB] text-gray-300 transition-all shadow-lg"
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
              backdrop-blur-xl border-2
              ${isLoading ? 'scale-95 border-yellow-500/50 bg-yellow-500/10' : ''}
              ${isSessionActive
                ? 'shadow-[0_0_40px_rgba(239,68,68,0.5)] border-red-500 bg-red-500/20'
                : 'shadow-[0_0_30px_rgba(0,166,251,0.2)] border-[#00A6FB]/60 bg-white/10 hover:bg-[#00A6FB]/20 hover:border-[#00A6FB]'}
              ${!isSessionActive && !isLoading ? 'animate-[pulse_3s_ease-in-out_infinite]' : ''}
            `}
          >
            {isSpeaking && <div className="absolute inset-0 rounded-full border-2 border-red-400 opacity-50 animate-ping" />}

            {isLoading ? <Spinner /> : (
              <Mic className={`w-8 h-8 md:w-7 md:h-7 transition-colors ${isSessionActive ? 'text-red-400' : 'text-[#00A6FB] group-hover:text-white'}`} />
            )}
          </button>
        </div>

        <button
          className="group relative rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
            w-[72px] h-[72px] md:w-[64px] md:h-[64px]
            shadow-[0_0_20px_rgba(0,158,96,0.2)] border-2 border-[#009E60]/60 bg-white/10 hover:bg-[#009E60]/20 hover:border-[#009E60] backdrop-blur-xl"
        >
          <MessageSquareCode className="w-8 h-8 md:w-7 md:h-7 text-[#009E60] group-hover:text-white transition-colors" />
        </button>

        <button
          onClick={() => setShowBooking(true)}
          className="group relative rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
            w-[72px] h-[72px] md:w-[64px] md:h-[64px]
            shadow-[0_0_20px_rgba(242,133,0,0.2)] border-2 border-[#F28500]/60 bg-white/10 hover:bg-[#F28500]/20 hover:border-[#F28500] backdrop-blur-xl"
        >
          <div className="absolute inset-1 rounded-full bg-[#F28500]/5 group-hover:bg-[#F28500]/20 transition-colors" />
          <CalendarCheck className="w-8 h-8 md:w-7 md:h-7 text-[#F28500] group-hover:text-white transition-colors" />
        </button>

      </div>

      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
    </>
  );
}
