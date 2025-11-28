import { X, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen || !isMounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 pointer-events-auto">

      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl h-[85vh] bg-[#0A1628] border border-[#00A6FB]/30 rounded-xl shadow-[0_0_60px_rgba(0,166,251,0.3)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 z-[10000]">

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#00A6FB] rounded-full animate-pulse" />
            <span className="text-sm font-mono font-bold tracking-widest text-white">
              INITIALIZE DEPLOYMENT
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors group cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        <div className="flex-1 w-full bg-white/5 relative z-10 overflow-hidden">

          <div className="absolute inset-0 flex flex-col items-center justify-center z-0 pointer-events-none opacity-50">
            <span className="text-xs font-mono text-[#00A6FB] animate-pulse mb-4">ESTABLISHING SECURE UPLINK...</span>
          </div>

          <div className="relative z-10 w-full h-full">
            <InlineWidget
              url="https://calendly.com/emil-petrosyan-norvan/30min"
              styles={{ height: '100%', width: '100%' }}
              pageSettings={{
                backgroundColor: '0A1628',
                hideEventTypeDetails: false,
                hideLandingPageDetails: false,
                primaryColor: '00A6FB',
                textColor: 'ffffff'
              }}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50">
            <a
              href="https://calendly.com/emil-petrosyan-norvan/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] text-gray-500 hover:text-white transition-colors border-b border-transparent hover:border-white pb-0.5"
            >
              <span>Connection issues? Open External Terminal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
