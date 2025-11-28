import StarField from "../StarField";
import ActionTrinity from "./ActionTrinity";

export default function Overlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12">

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
        <ActionTrinity color="#F28500" />
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40 pointer-events-none opacity-60">
        <span className="text-[9px] tracking-[0.3em] text-[#00A6FB]">SCROLL</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#00A6FB] to-transparent animate-pulse" />
      </div>
    </div>
  );
}
