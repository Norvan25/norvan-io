import { motion } from 'framer-motion';
import { Bot, Zap, BarChartBig, Feather, Cpu, BookOpen } from 'lucide-react';

const capabilities = [
  {
    title: "AI Agents & Voice Interface",
    sub: "Intelligent Interfaces",
    desc: "Deploy conversational agents (chat/voice) that represent your brand, qualify leads, and execute tasks autonomously.",
    Icon: Bot,
    color: "#00A6FB",
    axis: "NorV"
  },
  {
    title: "Workflow Automation",
    sub: "Operational Intelligence",
    desc: "Design and implement systems that eliminate repetitive human effort, ensuring speed and consistency across your operations.",
    Icon: Zap,
    color: "#7F4FC9",
    axis: "NorY"
  },
  {
    title: "Diagnostic AI & Auditing",
    sub: "Organizational Insight Mapping",
    desc: "Use AI to scan operational data, identify hidden bottlenecks, and calculate the financial cost of friction in real-time.",
    Icon: BarChartBig,
    color: "#007FFF",
    axis: "NorX"
  },
  {
    title: "Generative AI for Content",
    sub: "Brand Expression Synthesis",
    desc: "Architect content engines that maintain brand voice and scale communication across all channels (marketing, reports, internal docs).",
    Icon: Feather,
    color: "#F28500",
    axis: "NorZ"
  },
  {
    title: "Process Optimization",
    sub: "Efficiency Engineering",
    desc: "Refine existing operational flows by applying architectural logic, ensuring every step adds value and minimizes human error.",
    Icon: Cpu,
    color: "#7F4FC9",
    axis: "NorY"
  },
  {
    title: "Knowledge Management",
    sub: "Capability Transfer Systems",
    desc: "Transform unstructured organizational data into structured, actionable intelligence that instantly elevates team competence and performance.",
    Icon: BookOpen,
    color: "#009E60",
    axis: "NorW"
  },
];

const Card = ({ title, sub, desc, Icon, color, axis, index }: typeof capabilities[0] & { index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col gap-4 group cursor-default relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: color }} />

      <div className="flex items-center gap-4">
        <Icon className="w-8 h-8 text-white shrink-0" style={{ color: color }} />
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      </div>

      <p className="text-base font-light text-gray-300 leading-relaxed flex-1">
        {desc}
      </p>

      <div className="flex items-center mt-2 pt-2 border-t border-white/5">
        <span className="text-xs font-mono text-gray-500 tracking-widest uppercase mr-2">Methodology:</span>
        <span className="text-sm font-mono font-bold" style={{ color: color }}>{axis}</span>
      </div>
    </motion.div>
  );
};

export default function IntelligencePortfolio() {
  return (
    <section id="services" className="relative z-10 py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-4">
            The Intelligence Portfolio
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto font-light">
            We translate complex operational needs into structured solutions. Here are the core capabilities we deploy across the enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((cap, index) => (
            <Card key={cap.title} {...cap} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
