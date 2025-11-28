import { X } from "lucide-react";
import { useEffect } from "react";
import { InlineWidget } from "react-calendly";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 pointer-events-auto">

      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl h-[80vh] bg-[#0A1628] border border-[#00A6FB]/30 rounded-xl shadow-[0_0_50px_rgba(0,166,251,0.4)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 z-[10000]">

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 relative z-20">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#00A6FB] rounded-full animate-pulse" />
            <span className="text-sm font-mono font-bold tracking-widest text-white">
              INITIALIZE DEPLOYMENT
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg transition-all group border border-transparent hover:border-red-500/50 cursor-pointer relative z-50"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
          </button>
        </div>

        <div className="flex-1 w-full bg-white/5 relative z-10 overflow-hidden">
          <InlineWidget
            url="https://calendly.com/emil-petrosyan-norvan/30min"
            styles={{ height: '100%', width: '100%' }}
            prefill={{
              email: '',
              firstName: '',
              lastName: '',
              name: '',
            }}
          />
        </div>

      </div>
    </div>
  );
}
