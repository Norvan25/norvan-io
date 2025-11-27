import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface DimensionProps {
  id: string;
  label: string;
  desc: string;
  color: string;
  iconPath: string;
  index: number;
  modules: string[];
}

export default function DimensionSection({ id, label, desc, color, iconPath, index, modules }: DimensionProps) {
  const isEven = index % 2 === 0;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 border-t border-white/5">

      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{
          background: `radial-gradient(circle at ${isEven ? '90%' : '10%'} 50%, ${color}20 0%, ${color}05 40%, transparent 70%)`
        }}
      />

      <div className={`container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-24 ${isEven ? '' : 'md:flex-row-reverse'}`}>

        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-20%" }}
          >
            <h2 className="text-[12vw] md:text-[8rem] font-black tracking-tighter leading-none opacity-10 select-none absolute -top-16 md:-top-32 left-0 w-full" style={{ color: color }}>
              {id}
            </h2>
            <div className="relative">
              <h3 className="text-3xl md:text-6xl font-bold text-white tracking-wide uppercase drop-shadow-lg">
                {label}
              </h3>
              <div className="h-1 w-24 mt-4 mb-8 mx-auto md:mx-0" style={{ backgroundColor: color }} />
            </div>
            <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-xl mx-auto md:mx-0 drop-shadow-md">
              {desc}
            </p>

            <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
              {modules.map((mod) => (
                <div
                  key={mod}
                  className="px-4 py-2 rounded border border-white/10 bg-white/5 text-[10px] md:text-xs font-mono font-bold tracking-widest uppercase transition-all hover:scale-105 cursor-default"
                  style={{
                    borderColor: `${color}40`,
                    color: color,
                    boxShadow: `0 0 10px ${color}05`
                  }}
                >
                  {mod}
                </div>
              ))}
            </div>

            <button
              className="mt-12 group flex items-center gap-3 px-8 py-4 bg-black/30 backdrop-blur-md border border-white/20 text-white tracking-[0.2em] text-sm rounded hover:bg-white/10 transition-all mx-auto md:mx-0"
              style={{ borderColor: `${color}80` }}
            >
              <span style={{ color: color, fontWeight: 'bold' }}>EXPLORE</span> {id}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: color }} />
            </button>
          </motion.div>
        </div>

        <div className="flex-1 flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 border border-dashed rounded-full animate-[spin_30s_linear_infinite]"
                 style={{ borderColor: `${color}40`, width: '100%', height: '100%' }} />

            <img
              src={iconPath}
              alt={label}
              className="w-[280px] h-[280px] md:w-[350px] md:h-[350px] object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              style={{ filter: `drop-shadow(0 0 20px ${color}40)` }}
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
