import { motion } from 'framer-motion';
import { Utensils, ShoppingBag, HeartPulse, Briefcase, Factory, Building, Users, Truck, Banknote } from 'lucide-react';

const industries = [
  { title: "Corporate Enterprise", tagline: "Designing complex, unified intelligence architecture across all departments.", Icon: Users, color: "#7F4FC9" },
  { title: "Professional Services", tagline: "Converting billable expertise into structured, scalable IP.", Icon: Briefcase, color: "#009E60" },
  { title: "Finance & Banking", tagline: "Deploying governance, risk mapping, and high-velocity transaction intelligence.", Icon: Banknote, color: "#007FFF" },

  { title: "Retail & E-commerce", tagline: "Mapping the customer journey and automating inventory intelligence.", Icon: ShoppingBag, color: "#F28500" },
  { title: "Manufacturing", tagline: "Physical process auditing, supply chain diagnosis, and execution automation.", Icon: Factory, color: "#00A6FB" },
  { title: "Logistics & Supply Chain", tagline: "Optimizing flow, demand sensing, and autonomous routing to minimize friction.", Icon: Truck, color: "#7F4FC9" },

  { title: "Healthcare & Pharma", tagline: "Ensuring data precision, compliance, and rapid knowledge transfer.", Icon: HeartPulse, color: "#007FFF" },
  { title: "Restaurants & Hospitality", tagline: "Optimizing dynamic, high-volume customer flows.", Icon: Utensils, color: "#F28500" },
  { title: "Real Estate", tagline: "Structuring asset data for portfolio optimization and high-value transactions.", Icon: Building, color: "#00A6FB" },
];

const Card = ({ title, tagline, Icon, color, index }: typeof industries[0] & { index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      className="p-6 rounded-xl bg-black/40 backdrop-blur-lg border border-white/10 hover:border-[#00A6FB]/50 transition-all duration-300 flex flex-col gap-4 group cursor-default relative overflow-hidden hover:shadow-[0_0_25px_rgba(0,166,251,0.1)]"
    >
      <div className="flex items-center justify-between">
        <Icon
          className="w-7 h-7 text-white shrink-0 group-hover:animate-pulse"
          style={{ color: color }}
          strokeWidth={1.5}
        />
        <span className="text-xs font-mono opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: color }}>{index < 9 ? '0' + (index + 1) : index + 1}</span>
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight pt-2">{title}</h3>
      <p className="text-sm font-light text-gray-400 leading-relaxed">
        {tagline}
      </p>
    </motion.div>
  );
};

export default function IndustryEcosystem() {
  return (
    <section id="industries" className="relative z-10 py-20 md:py-32 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-4">
            The Industry Ecosystem
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Intelligence is domain-agnostic. Our architecture is built to solve fundamental friction across diverse, high-growth sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind, index) => (
            <Card key={ind.title} {...ind} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
