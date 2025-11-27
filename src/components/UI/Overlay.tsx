import { motion } from "framer-motion";
import { Activity, Layers, Zap, Globe, Cpu, ArrowRight } from "lucide-react";
import StarField from "../StarField";

const DOCK_ITEMS = [
  { id: 'norX', label: 'Insight', color: '#007FFF', icon: Activity },
  { id: 'norY', label: 'Architecture', color: '#7F4FC9', icon: Layers },
  { id: 'norZ', label: 'Expression', color: '#F28500', icon: Zap },
  { id: 'norW', label: 'Enablement', color: '#009E60', icon: Globe },
  { id: 'norV', label: 'Execution', color: '#00A6FB', icon: Cpu },
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

      <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full gap-8 relative z-50">
        <div className="pointer-events-auto bg-white/5 backdrop-blur-2xl border border-white/10 p-2 rounded-full flex gap-2 md:gap-4 mx-auto md:mx-0 shadow-2xl shadow-black/50">
          {DOCK_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1, y: -5 }}
                className="relative group w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border border-white/5 bg-gradient-to-b from-white/5 to-transparent hover:border-white/20 transition-colors"
              >
                <Icon style={{ color: item.color }} size={24} />

                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur px-3 py-1 rounded text-xs font-mono text-white whitespace-nowrap border border-white/10 pointer-events-none">
                  {item.id.toUpperCase()} • {item.label}
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto group flex items-center gap-3 px-6 py-3 bg-black/20 backdrop-blur-md border border-[#00A6FB]/50 text-[#00A6FB] font-light tracking-[0.2em] text-xs md:text-sm rounded-md hover:bg-[#00A6FB]/10 hover:border-[#00A6FB] hover:shadow-[0_0_20px_rgba(0,166,251,0.3)] transition-all duration-500"
        >
          INITIALIZE PROTOCOL
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </div>
  );
}
