import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Norvan's Insight Architecture (NorX) located a $450k operational leakage we didn't know existed. It wasn't consulting; it was forensic engineering.",
    name: "Alexander K.",
    title: "Chief Operating Officer",
    company: "Global Logistics Group",
    color: "#007FFF"
  },
  {
    quote: "We achieved 5x faster decision cycles and cut administrative overhead by 40%. The organizational clarity they installed is our most valuable asset.",
    name: "Priya V.",
    title: "CEO",
    company: "Vertex Financial Services",
    color: "#7F4FC9"
  },
  {
    quote: "The brand synchronization system (NorZ) aligned our entire marketing team instantly. Our messaging went from chaos to pure, measurable signal.",
    name: "Marcus L.",
    title: "VP of Marketing",
    company: "E-Commerce Tech",
    color: "#F28500"
  },
];

const TestimonialCard = ({ quote, name, title, company, color, index }: typeof testimonials[0] & { index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true, amount: 0.5 }}
      className="p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex flex-col gap-6 relative overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:border-[#00A6FB]/30 transition-all duration-300"
    >

      <Quote className="w-10 h-10 absolute top-4 left-4 text-white/10 opacity-70" />

      <p className="text-xl md:text-2xl font-light text-white leading-snug italic pt-4">
        {quote}
      </p>

      <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
        <p className="text-base font-bold text-white flex items-center gap-2" style={{ color: color }}>
          <Star className="w-4 h-4" strokeWidth={1.5} /> {name}
        </p>
        <p className="text-sm font-mono text-gray-500 tracking-widest">{title} at {company}</p>
      </div>
    </motion.div>
  );
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative z-10 py-20 md:py-32 overflow-hidden bg-black/50 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg mb-4">
            Validated Transformation
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto font-light">
            Clarity. Velocity. Value. Hear from the leaders whose systems we have architected. (Projected client data.)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <TestimonialCard key={t.name} {...t} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
