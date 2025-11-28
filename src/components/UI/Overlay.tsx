import StarField from "../StarField";
import ActionTrinity from "./ActionTrinity";

export default function Overlay() {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 md:p-12">

      <div className="absolute inset-0 pointer-events-none">
        <StarField />
      </div>

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
