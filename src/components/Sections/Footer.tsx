import { Linkedin, Mail, Phone, MapPin, Instagram, Twitter, MessageCircle } from "lucide-react";
import ActionTrinity from "../UI/ActionTrinity";

export default function Footer() {
  const links = [
    { label: "NORX", color: "#007FFF" },
    { label: "NORY", color: "#7F4FC9" },
    { label: "NORZ", color: "#F28500" },
    { label: "NORW", color: "#009E60" },
    { label: "NORV", color: "#00A6FB" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "X / Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: MessageCircle, href: "https://wa.me/60196069033", label: "WhatsApp" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative z-50 bg-black/80 backdrop-blur-xl border-t border-white/10 pt-20 pb-10">
      <div className="container mx-auto px-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* 1. IDENTITY & SOCIAL */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              <img src="/norvan-logo.png" alt="Norvan" className="h-12 w-auto object-contain opacity-80" />
              <p className="text-gray-400 text-sm font-light leading-relaxed max-w-xs">
                The operating system for business intelligence. We diagnose, architect, and execute the systems that power the next generation.
              </p>
            </div>

            {/* SOCIAL SIGNAL */}
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 rounded-full hover:bg-[#00A6FB]/20 hover:text-[#00A6FB] text-gray-400 transition-all border border-transparent hover:border-[#00A6FB]/50"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. SYSTEM NODES (Navigation) */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-mono font-bold text-white tracking-widest uppercase opacity-50">SYSTEM NAVIGATION</h4>
            <div className="grid grid-cols-2 gap-4">
              {links.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.label)}
                  className="text-left text-xs font-mono cursor-pointer hover:opacity-100 opacity-60 transition-opacity flex items-center gap-2"
                  style={{ color: link.color }}
                >
                  <span>●</span> {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. HEADQUARTERS (Contact) */}
          <div className="flex flex-col gap-6">
            <h4 className="text-xs font-mono font-bold text-white tracking-widest uppercase opacity-50">HEADQUARTERS</h4>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex gap-4 text-sm text-gray-400 font-light items-start">
                <MapPin className="w-5 h-5 shrink-0 text-[#00A6FB] mt-1" />
                <p className="leading-relaxed">
                  Norvan LLC. FZ<br/>
                  Meydan Grandstand, 6th Floor<br/>
                  Meydan Road, Nad Al Sheba<br/>
                  Dubai, Dubai
                </p>
              </div>

              {/* Phone (Active Link) */}
              <a
                href="tel:+60196069033"
                className="flex gap-4 text-sm text-gray-400 font-light items-center hover:text-white transition-colors group cursor-pointer"
              >
                <Phone className="w-5 h-5 shrink-0 text-[#00A6FB] group-hover:animate-pulse" />
                <span>+60 19 606 9033</span>
              </a>

              {/* Email (Active Link) */}
              <a
                href="mailto:info@norvan.io"
                className="flex gap-4 text-sm text-gray-400 font-light items-center hover:text-white transition-colors group"
              >
                <Mail className="w-5 h-5 shrink-0 text-[#00A6FB]" />
                <span>info@norvan.io</span>
              </a>
            </div>
          </div>
        </div>

        {/* ACTION TRINITY ROW */}
        <div className="border-t border-white/5 pt-12 pb-12 flex flex-col items-center">
           <h4 className="text-xs font-mono font-bold text-white tracking-widest uppercase opacity-40 mb-8">INITIATE SEQUENCE</h4>
           <ActionTrinity color="#00A6FB" />
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
          <span>© 2024 NORVAN SYSTEMS. DUBAI LLC.</span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            ALL SYSTEMS ONLINE
          </div>
        </div>

      </div>
    </footer>
  );
}
