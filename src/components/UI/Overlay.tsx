import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import StarField from "../StarField";

const DOCK_ITEMS = [
  { id: 'norX', letter: 'X', label: 'Insight', color: '#007FFF' },
  { id: 'norY', letter: 'Y', label: 'Architecture', color: '#7F4FC9' },
  { id: 'norZ', letter: 'Z', label: 'Expression', color: '#F28500' },
  { id: 'norW', letter: 'W', label: 'Enablement', color: '#009E60' },
  { id: 'norV', letter: 'V', label: 'Execution', color: '#00A6FB' },
];

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

      <div className="flex flex-col items-center w-full gap-8 mb-12">
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between w-full gap-8 relative z-50">

          <div className="relative mx-auto md:mx-0">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] text-[#00A6FB] tracking-[0.2em] whitespace-nowrap opacity-70">
              SELECT DIMENSION
            </div>

            <div className="pointer-events-auto bg-white/5 backdrop-blur-2xl border border-white/10 p-2 rounded-full flex gap-3 shadow-2xl">
              {DOCK_ITEMS.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="relative group w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border border-white/5 bg-gradient-to-b from-white/10 to-transparent hover:border-white/20 transition-all"
                >
                  <span className="font-mono font-bold text-lg md:text-xl" style={{ color: item.color }}>
                    {item.letter}
                  </span>

                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 backdrop-blur px-3 py-1 rounded text-[10px] font-mono text-white whitespace-nowrap border border-white/10 pointer-events-none">
                    <span style={{ color: item.color }}>{item.id}</span> • {item.label}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto group flex items-center gap-3 px-8 py-3 bg-black/40 backdrop-blur-md border border-[#00A6FB]/50 text-[#00A6FB] font-light tracking-[0.2em] text-xs md:text-sm rounded-md hover:bg-[#00A6FB]/10 hover:border-[#00A6FB] hover:shadow-[0_0_20px_rgba(0,166,251,0.3)] transition-all duration-500"
          >
            ENTER SYSTEM
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
