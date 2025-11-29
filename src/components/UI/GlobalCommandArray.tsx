import { useState } from "react";
import { Mic, MessageSquareCode, Rocket } from "lucide-react";
import { useNorVoice } from '../../hooks/useNorVoice';
import BookingModal from "./BookingModal";

const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function GlobalCommandArray() {
  const { isSessionActive, isSpeaking, isLoading, toggleVoice } = useNorVoice();
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[9999] pointer-events-auto flex items-center gap-3 md:gap-5">

        <button
          onClick={toggleVoice}
          disabled={isLoading}
          className={`group relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
            ${isLoading ? 'scale-95 border-yellow-500/50' : ''}
            ${isSessionActive ? 'shadow-[0_0_30px_rgba(239,68,68,0.4)] border-red-500/50' : 'shadow-[0_0_20px_rgba(0,166,251,0.2)] border-[#00A6FB]/30 hover:border-[#00A6FB]'}
            backdrop-blur-xl border bg-[#0A1628]/80
          `}
        >
          {isSpeaking && <div className="absolute inset-0 rounded-full border border-red-400 opacity-50 animate-ping" />}

          {isLoading ? <Spinner /> : (
            <Mic className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${isSessionActive ? 'text-red-400' : 'text-[#00A6FB] group-hover:text-white'}`} />
          )}
        </button>

        <button
          className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(0,158,96,0.2)] border border-[#009E60]/30 hover:border-[#009E60] backdrop-blur-xl bg-[#0A1628]/80"
        >
          <MessageSquareCode className="w-5 h-5 md:w-6 md:h-6 text-[#009E60] group-hover:text-white transition-colors" />
        </button>

        <button
          onClick={() => setShowBooking(true)}
          className="group relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-[0_0_20px_rgba(242,133,0,0.2)] border border-[#F28500]/30 hover:border-[#F28500] backdrop-blur-xl bg-[#0A1628]/80"
        >
          <div className="absolute inset-1 rounded-full bg-[#F28500]/10 group-hover:bg-[#F28500]/20 transition-colors" />
          <Rocket className="w-5 h-5 md:w-6 md:h-6 text-[#F28500] group-hover:text-white transition-colors" />
        </button>

      </div>

      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
    </>
  );
}
