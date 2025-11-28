import { Mic, MessageSquareCode, Rocket } from "lucide-react";

export default function ActionTrinity({ color = "#00A6FB" }: { color?: string }) {
  return (
    <div className="flex flex-row gap-2 md:gap-4 w-full md:w-auto items-stretch justify-center mt-8">

      <button className="group relative flex-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 px-1 py-3 md:px-6 md:py-3 bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#00A6FB] rounded-lg transition-all hover:bg-[#00A6FB]/10">
        <Mic className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-[#00A6FB] transition-colors" />
        <span className="text-[9px] md:text-xs font-mono font-bold tracking-wider text-gray-300 group-hover:text-white whitespace-nowrap">
          NOR-VOICE
        </span>
      </button>

      <button className="group relative flex-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 px-1 py-3 md:px-6 md:py-3 bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#009E60] rounded-lg transition-all hover:bg-[#009E60]/10">
        <MessageSquareCode className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-[#009E60] transition-colors" />
        <span className="text-[9px] md:text-xs font-mono font-bold tracking-wider text-gray-300 group-hover:text-white whitespace-nowrap">
          NOR-LINK
        </span>
      </button>

      <button
        className="group relative flex-1 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 px-1 py-3 md:px-8 md:py-3 bg-black/40 backdrop-blur-xl border rounded-lg transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        style={{ borderColor: color }}
      >
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity rounded-lg" style={{ backgroundColor: color }} />
        <Rocket className="w-3 h-3 md:w-4 md:h-4 text-white group-hover:translate-x-1 transition-transform" />
        <span className="text-[9px] md:text-xs font-mono font-bold tracking-wider text-white">
          DEPLOY
        </span>
      </button>

    </div>
  );
}
