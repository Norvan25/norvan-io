import { X } from "lucide-react";
import { useEffect } from "react";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">

      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl h-[80vh] bg-[#0A1628] border border-[#00A6FB]/30 rounded-xl shadow-[0_0_50px_rgba(0,166,251,0.2)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-[#00A6FB] rounded-full animate-pulse" />
            <span className="text-sm font-mono font-bold tracking-widest text-white">
              INITIALIZE DEPLOYMENT
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
          >
            <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
          </button>
        </div>

        <div className="flex-1 w-full bg-white/5 relative">
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <span className="text-xs font-mono text-[#00A6FB] animate-pulse">ESTABLISHING UPLINK...</span>
          </div>

          <iframe
            src="https://calendly.com/norvan-systems/discovery"
            width="100%"
            height="100%"
            frameBorder="0"
            className="relative z-10 w-full h-full"
            title="Schedule Deployment"
          ></iframe>
        </div>

      </div>
    </div>
  );
}
