import { motion } from "framer-motion";
import { Mic, MessageSquareCode, Rocket } from "lucide-react";
import StarField from "../StarField";

export default function Overlay() {
  return (
    <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12">

      <div className="absolute inset-0 pointer-events-none">
        <StarField />
      </div>

      <header className="flex justify-between items-start w-full relative z-50">
        <img
          src="/norvan-logo.png"
          alt="Norvan"
          className="h-16 md:h-20 w-auto object-contain pointer-events-auto"
        />

        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          SYSTEM ONLINE
        </div>
      </header>

      <div className="flex-grow"></div>

      <div className="flex flex-col items-center w-full gap-8 relative z-50 mb-12">

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto items-center justify-center">

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto group relative flex items-center gap-3 px-6 py-4 bg-black/20 backdrop-blur-xl border border-[#00A6FB]/30 hover:border-[#00A6FB] rounded-lg transition-all hover:shadow-[0_0_20px_rgba(0,166,251,0.3)] w-full md:w-auto justify-center"
          >
            <Mic className="w-5 h-5 text-[#00A6FB] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-mono font-bold tracking-widest text-white group-hover:text-[#00A6FB] transition-colors">
              NOR-VOICE
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto group relative flex items-center gap-3 px-6 py-4 bg-black/20 backdrop-blur-xl border border-[#009E60]/30 hover:border-[#009E60] rounded-lg transition-all hover:shadow-[0_0_20px_rgba(0,158,96,0.3)] w-full md:w-auto justify-center"
          >
            <MessageSquareCode className="w-5 h-5 text-[#009E60] group-hover:scale-110 transition-transform" />
            <span className="text-sm font-mono font-bold tracking-widest text-white group-hover:text-[#009E60] transition-colors">
              NOR-LINK
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto group relative flex items-center gap-3 px-8 py-4 bg-[#F28500]/10 backdrop-blur-xl border border-[#F28500] hover:bg-[#F28500] rounded-lg transition-all hover:shadow-[0_0_30px_rgba(242,133,0,0.4)] w-full md:w-auto justify-center"
          >
            <Rocket className="w-5 h-5 text-[#F28500] group-hover:text-white transition-colors" />
            <span className="text-sm font-mono font-bold tracking-widest text-[#F28500] group-hover:text-white transition-colors">
              DEPLOY
            </span>
          </motion.button>

        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40 pointer-events-none opacity-60">
        <span className="text-[9px] tracking-[0.3em] text-[#00A6FB]">SCROLL</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#00A6FB] to-transparent animate-pulse" />
      </div>
    </div>
  );
}
