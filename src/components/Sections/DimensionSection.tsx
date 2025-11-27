import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AxisCube from '../3d/AxisCube';

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
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-24 border-t border-white/5">

      <div className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{ background: `radial-gradient(circle at 20% 50%, ${color}15 0%, ${color}02 40%, transparent 70%)` }}
      />

      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row-reverse items-center gap-8 md:gap-32">

        <div className="flex-1 text-center md:text-left w-full">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-20%" }}
          >
            <div className="relative mb-6 md:mb-8">
              <h2 className="text-[25vw] md:text-[6rem] font-black tracking-tighter leading-none opacity-25 select-none absolute top-[-5%] md:-top-20 left-0 w-full uppercase" style={{ color: color }}>
                {id}
              </h2>
              <h3 className="relative text-3xl md:text-5xl font-bold text-white tracking-wide uppercase drop-shadow-lg">
                {label}
              </h3>
              <div className="h-1 w-16 md:w-20 mt-4 mx-auto md:mx-0" style={{ backgroundColor: color }} />
            </div>

            <p className="text-base md:text-xl text-gray-300 font-light leading-relaxed mb-8 md:mb-10">
              {desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-10 md:mb-12">
              {modules.map((mod) => (
                <div
                  key={mod.name}
                  className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.08] group cursor-default"
                  style={{ borderLeft: `3px solid ${color}60` }}
                >
                  <div className="flex items-center gap-3 md:gap-4 mb-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 shrink-0">
                      <img
                        src={mod.icon}
                        alt={mod.name}
                        className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity filter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <span className="text-sm md:text-base font-mono font-bold tracking-wide text-white">
                      <span style={{ color: color }}>{mod.name.substring(0, 3)}</span>
                      <span>{mod.name.substring(3)}</span>
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-200 font-normal leading-relaxed pl-11 md:pl-14">
                    {mod.desc}
                  </p>
                </div>
              ))}
            </div>

            <button
              className="group flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-black/30 backdrop-blur-md border border-white/20 text-white tracking-[0.2em] text-xs font-bold rounded hover:bg-white/10 transition-all mx-auto md:mx-0"
              style={{ borderColor: `${color}80` }}
            >
              <span style={{ color: color }}>EXPLORE</span> {id}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: color }} />
            </button>
          </motion.div>
        </div>

        <div className="flex-1 flex justify-center items-center h-[280px] md:h-[500px] w-full max-w-[300px] md:max-w-[500px] mx-auto relative mt-8 md:mt-0">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="w-full h-full"
          >
            <AxisCube iconPath={iconPath} color={color} />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
