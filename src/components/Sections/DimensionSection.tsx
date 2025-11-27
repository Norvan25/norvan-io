import { motion } from 'framer-motion';
import { ArrowRight, LucideIcon } from 'lucide-react';

interface DimensionProps {
  id: string;
  label: string;
  desc: string;
  color: string;
  Icon: LucideIcon;
  index: number;
}

export default function DimensionSection({ id, label, desc, color, Icon, index }: DimensionProps) {
  const isEven = index % 2 === 0;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${isEven ? '70%' : '30%'} 50%, ${color}35 0%, ${color}08 40%, transparent 70%)`
        }}
      />

      <div className={`container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}>

        <div className="flex-1 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[12vw] md:text-8xl font-black tracking-tighter leading-none opacity-20 select-none" style={{ color: color }}>
              {id}
            </h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mt-[-2vw] md:mt-[-20px] tracking-wide uppercase">
              {label}
            </h3>
            <p className="mt-8 text-lg md:text-xl text-gray-300 font-light leading-relaxed max-w-xl mx-auto md:mx-0">
              {desc}
            </p>

            <button
              className="mt-12 group flex items-center gap-3 px-8 py-4 bg-transparent border border-white/20 text-white tracking-[0.2em] text-sm rounded-sm hover:bg-white/5 transition-all mx-auto md:mx-0"
              style={{ borderColor: `${color}50` }}
            >
              <span style={{ color: color }}>INITIATE</span> PROTOCOL
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" style={{ color: color }} />
            </button>
          </motion.div>
        </div>

        <div className="flex-1 flex justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 border-[1px] border-dashed rounded-full animate-[spin_20s_linear_infinite]"
                 style={{ borderColor: `${color}30`, width: '100%', height: '100%' }} />

            <Icon
              size={300}
              strokeWidth={0.5}
              color={color}
              className="drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
