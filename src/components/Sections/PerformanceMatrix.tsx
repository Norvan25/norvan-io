import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users, DollarSign } from 'lucide-react';
import CountUp from 'react-countup';

const metrics = [
  {
    icon: TrendingUp,
    value: 350,
    unit: '%',
    label: "Projected ROI Increase",
    color: "#009E60"
  },
  {
    icon: Clock,
    value: 200,
    unit: 'hrs',
    label: "Operational Time Saved Per Month",
    color: "#00A6FB"
  },
  {
    icon: Users,
    value: 85,
    unit: '%',
    label: "Organizational Autonomy Score",
    color: "#7F4FC9"
  },
  {
    icon: DollarSign,
    value: 50,
    unit: '%',
    label: "Friction Cost Reduction in Administration",
    color: "#F28500"
  },
];

const MetricCard = ({ value, unit, label, icon: Icon, color, index }: typeof metrics[0] & { index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      viewport={{ once: true, margin: "-100px" }}
      className="p-6 md:p-8 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex flex-col items-center text-center gap-4 group cursor-default relative overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)]"
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/5 shadow-inner" style={{ color: color }}>
        <Icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
      </div>

      <h3 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
        <CountUp
          end={value}
          duration={3}
          enableScrollSpy={true}
          scrollSpyOnce={true}
          suffix={unit}
          className="drop-shadow-lg"
          style={{ color: color }}
        />
      </h3>

      <p className="text-sm font-mono text-gray-400 leading-relaxed uppercase tracking-widest mt-2">
        {label}
      </p>
    </motion.div>
  );
};

export default function PerformanceMatrix() {
  return (
    <section id="impact" className="relative z-10 py-20 md:py-32 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-4">
            The Performance Matrix
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Transformation is measured in clarity, velocity, and value. These are the typical outcomes achieved through Norvan intelligence architecture.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} {...metric} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
