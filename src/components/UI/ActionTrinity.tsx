import { motion } from "framer-motion";
import { Mic, MessageSquareCode, Rocket } from "lucide-react";

interface ActionTrinityProps {
  color?: string;
}

export default function ActionTrinity({ color = "#00A6FB" }: ActionTrinityProps) {
  return (
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
        className="pointer-events-auto group relative flex items-center gap-3 px-8 py-4 bg-black/40 backdrop-blur-xl border rounded-lg transition-all w-full md:w-auto justify-center hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        style={{ borderColor: color }}
      >
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity rounded-lg"
          style={{ backgroundColor: color }}
        />
        <Rocket className="w-5 h-5 text-white group-hover:scale-110 transition-transform relative z-10" />
        <span className="text-sm font-mono font-bold tracking-widest text-white relative z-10">
          DEPLOY
        </span>
      </motion.button>

    </div>
  );
}
