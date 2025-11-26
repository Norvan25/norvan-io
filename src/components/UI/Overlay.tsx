import { useState } from 'react';
import { Box, Database, Cpu, Network, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const dockItems = [
  { id: 'x', icon: Box, label: 'Dimension X' },
  { id: 'y', icon: Database, label: 'Dimension Y' },
  { id: 'z', icon: Cpu, label: 'Dimension Z' },
  { id: 'w', icon: Network, label: 'Dimension W' },
  { id: 'v', icon: Zap, label: 'Dimension V' },
];

export default function Overlay() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <header className="absolute top-0 left-0 right-0 p-8 pointer-events-auto">
        <img
          src="/norvan-logo.png"
          alt="Norvan"
          className="h-12 w-auto"
        />
      </header>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl">
          <div className="flex items-end gap-3">
            {dockItems.map((item) => {
              const Icon = item.icon;
              const isHovered = hoveredId === item.id;

              return (
                <button
                  key={item.id}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    'relative flex items-center justify-center',
                    'w-14 h-14 rounded-xl',
                    'bg-norvan-cyan/10 border border-norvan-cyan/20',
                    'hover:bg-norvan-cyan/20 hover:border-norvan-cyan/40',
                    'transition-all duration-300 ease-out',
                    'group',
                    isHovered && 'scale-125 -translate-y-2'
                  )}
                  aria-label={item.label}
                >
                  <Icon
                    className={cn(
                      'w-6 h-6 text-norvan-cyan transition-colors',
                      isHovered && 'text-norvan-accent'
                    )}
                  />

                  {isHovered && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-norvan-navy/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-norvan-cyan/20">
                        <span className="text-xs font-medium text-norvan-cyan">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-norvan-navy to-transparent pointer-events-none" />
    </div>
  );
}
