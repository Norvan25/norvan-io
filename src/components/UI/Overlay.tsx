import { useState } from 'react';
import { Mic, MessageSquareCode, CalendarCheck } from 'lucide-react';
import { useNorVoice } from '../../hooks/useNorVoice';

export default function Overlay() {
  const { toggleVoice, isSessionActive, isLoading } = useNorVoice();
  const [isHovering, setIsHovering] = useState(false);

  const handleBooking = () => {
    window.open('https://calendly.com/emil-petrosyan-norvan/30min', '_blank');
  };

  const getVoiceButtonText = () => {
    if (isLoading) return 'CONNECTING...';
    if (isSessionActive) return 'END UPLINK';
    if (isHovering) return 'GIVE IT A TRY';
    return 'TALK TO NEXUS';
  };

  return (
    <>
      <div className="fixed bottom-16 md:bottom-24 left-0 right-0 z-50 pointer-events-none">
        <div className="container mx-auto px-2 sm:px-6 pointer-events-auto">
          <div className="flex justify-center md:justify-start gap-1.5 md:gap-6">

            <button
              onClick={toggleVoice}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              disabled={isLoading}
              className={`group relative flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2.5 md:py-3 rounded-full transition-all duration-300 border flex-shrink-0
                ${isLoading
                   ? 'border-yellow-500 bg-yellow-500/10 text-yellow-400 cursor-wait'
                   : isSessionActive
                     ? 'border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                     : 'bg-white/5 border-white/20 hover:border-[#00A6FB] hover:bg-[#00A6FB]/10 text-white'
                }
                shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(0,166,251,0.2)]
              `}
            >
              <Mic className={`w-3.5 md:w-5 h-3.5 md:h-5 transition-transform ${isSessionActive ? 'animate-pulse text-red-400' : 'text-[#00A6FB] group-hover:text-white'}`} />
              <span className="text-[0.65rem] md:text-sm font-mono font-light tracking-tight md:tracking-wider whitespace-nowrap">
                {getVoiceButtonText()}
              </span>
            </button>

            <button
              className="group relative flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2.5 md:py-3 rounded-full transition-all duration-300 border border-white/20 bg-white/5 hover:border-[#009E60] hover:bg-[#009E60]/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(0,158,96,0.2)] flex-shrink-0"
            >
              <MessageSquareCode className="w-3.5 md:w-5 h-3.5 md:h-5 text-[#A0E9CC] group-hover:text-white" />
              <span className="text-[0.65rem] md:text-sm font-mono font-light tracking-tight md:tracking-wider whitespace-nowrap">
                CHAT WITH NEXUS
              </span>
            </button>

            <button
              onClick={handleBooking}
              className="group relative flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2.5 md:py-3 rounded-full transition-all duration-300 border border-[#F28500] bg-[#F28500]/20 text-white shadow-[0_0_25px_rgba(242,133,0,0.3)] hover:shadow-[0_0_35px_rgba(242,133,0,0.6)] flex-shrink-0"
            >
              <CalendarCheck className="w-3.5 md:w-5 h-3.5 md:h-5 text-white" />
              <span className="text-[0.65rem] md:text-sm font-mono font-light tracking-tight md:tracking-wider whitespace-nowrap">
                BOOK A BRIEFING
              </span>
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
