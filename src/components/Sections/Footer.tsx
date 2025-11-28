import { Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import ActionTrinity from "../UI/ActionTrinity";

export default function Footer() {
  const links = [
    { label: "NORX", color: "#007FFF", href: "#NORX" },
    { label: "NORY", color: "#7F4FC9", href: "#NORY" },
    { label: "NORZ", color: "#F28500", href: "#NORZ" },
    { label: "NORW", color: "#009E60", href: "#NORW" },
    { label: "NORV", color: "#00A6FB", href: "#NORV" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="relative z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pt-16 pb-8">
      <div className="container mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          <div className="flex flex-col gap-6">
            <img src="/norvan-logo.png" alt="Norvan" className="h-10 w-auto object-contain opacity-80" />
            <p className="text-gray-400 text-sm font-light leading-relaxed max-w-xs">
              We diagnose, architect, and execute the systems that power the next generation of business intelligence.
            </p>
            <div className="flex flex-col gap-3 text-xs text-gray-500">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>123 AI Boulevard, Suite 500<br />San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>contact@norvan.ai</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-mono font-bold text-white tracking-widest uppercase opacity-50">SYSTEM NODES</h4>
            <div className="grid grid-cols-2 gap-4">
              {links.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="text-xs font-mono cursor-pointer hover:opacity-100 opacity-60 transition-opacity text-left"
                  style={{ color: link.color }}
                >
                  ● {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-mono font-bold text-white tracking-widest uppercase opacity-50">SECURE CHANNEL</h4>
            <div className="flex gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              </a>
              <a href="mailto:contact@norvan.ai">
                <Mail className="w-5 h-5 text-gray-400 hover:text-white transition-colors cursor-pointer" />
              </a>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-4">
              ENCRYPTED CONNECTION ESTABLISHED
            </p>
          </div>
        </div>

        <div className="mb-12">
          <ActionTrinity color="#00A6FB" />
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
