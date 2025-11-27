import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Module {
  name: string;
  icon: string;
  desc: string;
}

interface DimensionProps {
  id: string;
  label: string;
  desc: string;
  color: string;
  iconPath: string;
  index: number;
  modules: Module[];
}

export default function DimensionSection({ id, label, desc, color, iconPath, index, modules }: DimensionProps) {
  const isTextRight = index % 2 !== 0;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 border-t border-white/5">

      <div className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{ background: `radial-gradient(circle at ${isTextRight ? '20%' : '80%'} 50%, ${color}15 0%, ${color}02 40%, transparent 70%)` }}
      />

      <div className={`container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-32 ${isTextRight ? 'md:flex-row-reverse' : ''}`}>

        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: isTextRight ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-20%" }}
          >
            <div className="relative mb-8">
              <h2 className="text-[8vw] md:text-[6rem] font-black tracking-tighter leading-none opacity-10 select-none absolute -top-12 md:-top-20 left-0 w-full" style={{ color: color }}>
                {id}
              </h2>
              <h3 className="relative text-3xl md:text-5xl font-bold text-white tracking-wide uppercase drop-shadow-lg">
                {label}
              </h3>
              <div className="h-1 w-20 mt-4 mx-auto md:mx-0" style={{ backgroundColor: color }} />
            </div>

            <p className="text-lg text-gray-300 font-light leading-relaxed mb-10">
              {desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {modules.map((mod) => (
                <div
                  key={mod.name}
                  className="flex flex-col p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.08] group cursor-default"
                  style={{ borderLeft: `3px solid ${color}60` }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 shrink-0">
                      <img
                        src={mod.icon}
                        alt={mod.name}
                        className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity filter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <span className="text-base font-mono font-bold tracking-wide text-white">
                      <span style={{ color: color }}>
                        {mod.name.substring(0, 3)}
                      </span>
                      <span>
                        {mod.name.substring(3)}
                      </span>
                    </span>
                  </div>

                  <p className="text-sm text-gray-200 font-normal leading-relaxed pl-14">
                    {mod.desc}
                  </p>
                </div>
              ))}
            </div>

            <button
              className="group flex items-center gap-3 px-8 py-3 bg-transparent border border-white/20 text-white tracking-[0.2em] text-xs font-bold rounded hover:bg-white/5 transition-all mx-auto md:mx-0"
              style={{ borderColor: `${color}60` }}
            >
              <span style={{ color: color }}>EXPLORE</span> {id}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: color }} />
            </button>
          </motion.div>
        </div>

        <div className="flex-1 flex justify-center relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -20 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]"
          >
            <div className="absolute inset-0 border border-dashed rounded-full animate-[spin_40s_linear_infinite]"
                 style={{ borderColor: `${color}30` }} />

            <img
              src={iconPath}
              alt={id}
              className="absolute inset-0 w-full h-full object-contain p-12 drop-shadow-[0_0_60px_rgba(0,0,0,0.6)]"
              style={{ filter: `drop-shadow(0 0 30px ${color}30)` }}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
