import { Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const links = [
    { label: "NORX", color: "#007FFF" },
    { label: "NORY", color: "#7F4FC9" },
    { label: "NORZ", color: "#F28500" },
    { label: "NORW", color: "#009E60" },
    { label: "NORV", color: "#00A6FB" },
  ];

  return (
    <footer className="relative z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          <div className="flex flex-col gap-6">
            <img src="/norvan-logo.png" alt="Norvan" className="h-10 w-auto object-contain opacity-80" />
            <p className="text-gray-400 text-sm font-light leading-relaxed max-w-xs">
              We diagnose, architect, and execute the systems that power the next generation of business intelligence.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-mono font-bold text-white tracking-widest uppercase opacity-50">SYSTEM NODES</h4>
            <div className="grid grid-cols-2 gap-4">
              {links.map((link) => (
                <span
                  key={link.label}
                  className="text-xs font-mono cursor-pointer hover:opacity-100 opacity-60 transition-opacity"
                  style={{ color: link.color }}
                >
                  ● {link.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-mono font-bold text-white tracking-widest uppercase opacity-50">SECURE CHANNEL</h4>
            <div className="flex gap-4">
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              <Mail className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
            </div>
            <p className="text-xs text-gray-500 font-mono mt-4">
              ENCRYPTED CONNECTION ESTABLISHED
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
          <span>© 2024 NORVAN SYSTEMS. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            OPERATIONAL
          </div>
        </div>

      </div>
    </footer>
  );
}
