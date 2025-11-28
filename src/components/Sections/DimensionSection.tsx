import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AxisCube from '../3d/AxisCube';
import ActionTrinity from '../UI/ActionTrinity';

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
    <section id={id} className="relative min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-24 border-t border-white/5">
      
      {/* ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none transition-colors duration-500"
        style={{ background: `radial-gradient(circle at 20% 50%, ${color}15 0%, ${color}02 40%, transparent 70%)` }} 
      />

      {/* CONTAINER: flex-col puts Text FIRST. md:flex-row-reverse puts Text RIGHT. */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row-reverse items-center gap-12 md:gap-32">
        
        {/* 1. TEXT CONTENT (Top on Mobile, Right on Desktop) */}
        {/* Added pt-32 to force text down on mobile, clearing the watermark */}
        <div className="flex-1 text-center md:text-left w-full z-20 pt-32 md:pt-0">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-20%" }}
          >
            {/* Header Block */}
            <div className="relative mb-8 md:mb-12">
              {/* Watermark (Anchored High) */}
              <h2 
                className="text-[25vw] md:text-[6rem] font-black tracking-tighter leading-none opacity-25 select-none absolute -top-20 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 md:-top-24 w-full uppercase" 
                style={{ color: color }}
              >
                {id}
              </h2>
              
              {/* Foreground Title */}
              <div className="relative">
                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-wide uppercase drop-shadow-lg">
                  {label}
                </h3>
                <div className="h-1 w-20 mt-4 mx-auto md:mx-0" style={{ backgroundColor: color }} />
              </div>
            </div>
            
            {/* Description */}
            <p className="text-base md:text-xl text-gray-300 font-light leading-relaxed mb-10 md:mb-12">
              {desc}
            </p>

            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-10 md:mb-12">
              {modules.map((mod) => (
                <div 
                  key={mod.name} 
                  className="flex flex-col p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/[0.08] group cursor-default"
                  style={{ borderLeft: `3px solid ${color}60` }}
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 shrink-0">
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
                  <p className="text-xs md:text-sm text-gray-200 font-normal leading-relaxed pl-14 text-left">
                    {mod.desc}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="w-full md:w-auto mt-8 md:mt-0 mb-12 md:mb-0">
              <ActionTrinity color={color} />
            </div>

          </motion.div>
        </div>

        {/* 2. 3D CUBE VISUAL (Bottom on Mobile, Left on Desktop) */}
        <div className="w-full h-[300px] md:h-[500px] flex-none md:flex-1 relative z-10">
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