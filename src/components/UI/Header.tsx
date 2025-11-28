export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-start p-6 md:p-12 pointer-events-none">

      <img
        src="/norvan-logo.png"
        alt="Norvan"
        className="h-12 md:h-16 w-auto object-contain pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-sm pointer-events-auto">
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        SYSTEM ONLINE
      </div>

    </header>
  );
}
