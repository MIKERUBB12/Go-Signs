import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function ACMAnimation({ isDarkMode }: { isDarkMode: boolean }) {
  const [scanPos, setScanPos] = useState(0);
  const [isInverted, setIsInverted] = useState(false);
  
  const rows = 5;
  const cols = 7;
  const panels = Array.from({ length: rows * cols }).map((_, i) => ({
    id: i,
    r: Math.floor(i / cols),
    c: i % cols,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos(prev => (prev + 1) % 200);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Every full scan cycle, toggle the theme inversion for dramatic effect
    if (Math.floor(scanPos) === 0) {
      setIsInverted(prev => !prev);
    }
  }, [scanPos]);

  // Derived colors based on inversion state
  const bg = isInverted ? 'bg-white' : 'bg-black';
  const stroke = isInverted ? 'stroke-zinc-400' : 'stroke-zinc-600';
  const accent = isInverted ? 'fill-black' : 'fill-white';
  const highlight = 'fill-red-600';

  return (
    <div className={`absolute inset-0 w-full h-full ${bg} transition-colors duration-1000 overflow-hidden`}>
      {/* Background Technical Grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isInverted ? "black" : "white"} strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <div className="relative w-full h-full p-12 grid grid-cols-7 grid-rows-5 gap-2">
        {panels.map((p) => {
          const panelProgress = (scanPos / 2) - (p.c * 10);
          const isActive = panelProgress > 0;
          
          return (
            <div key={p.id} className="relative group perspective-1000">
              {/* The "Blueprint" Sketch Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <rect 
                  x="0" y="0" width="100%" height="100%" 
                  fill="none" 
                  strokeDasharray="4 2"
                  className={`${stroke} transition-opacity duration-500 ${isActive ? 'opacity-20' : 'opacity-100'}`}
                />
                <circle cx="4" cy="4" r="1" className={stroke} />
                <circle cx="calc(100% - 4)" cy="4" r="1" className={stroke} />
                <circle cx="4" cy="calc(100% - 4)" r="1" className={stroke} />
                <circle cx="calc(100% - 4)" cy="calc(100% - 4)" r="1" className={stroke} />
              </svg>

              {/* The "Physical Panel" Layer */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ rotateY: 90, opacity: 0, scale: 0.9 }}
                    animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                    exit={{ rotateY: -90, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={`absolute inset-0 shadow-2xl ${
                      p.id % 9 === 0 ? highlight : accent
                    }`}
                  >
                    {/* Industrial Texture / Rivet detail */}
                    <div className="absolute inset-0 border border-black/10"></div>
                    <div className={`absolute top-2 left-2 w-1 h-1 rounded-full ${isInverted ? 'bg-white/20' : 'bg-black/20'}`} />
                    <div className={`absolute top-2 right-2 w-1 h-1 rounded-full ${isInverted ? 'bg-white/20' : 'bg-black/20'}`} />
                    <div className={`absolute bottom-2 left-2 w-1 h-1 rounded-full ${isInverted ? 'bg-white/20' : 'bg-black/20'}`} />
                    <div className={`absolute bottom-2 right-2 w-1 h-1 rounded-full ${isInverted ? 'bg-white/20' : 'bg-black/20'}`} />
                    
                    {/* Technical ID Label */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-[6px] font-mono tracking-tighter transition-colors ${
                        p.id % 9 === 0 ? 'text-white' : (isInverted ? 'text-white' : 'text-black')
                      }`}>
                         PX_{p.id.toString().padStart(3, '0')}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* The Scanning "Laser" Line */}
      <motion.div 
        style={{ left: `${scanPos / 2}%` }}
        className="absolute top-0 bottom-0 w-[2px] bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)] z-30"
      >
        <div className="absolute top-0 left-4 whitespace-nowrap">
          <div className="text-[10px] font-mono text-red-600 font-black uppercase tracking-widest bg-black/80 px-2 py-1">
            Structural_Scan_Active
          </div>
          <div className="text-[8px] font-mono text-white/50 px-2">
            POS_X: {(scanPos/2).toFixed(2)}%
          </div>
        </div>
      </motion.div>

      {/* Technical HUD elements */}
      <div className="absolute bottom-8 right-8 text-right font-mono text-[8px] space-y-1 z-20">
        <div className="text-red-600 flex items-center justify-end gap-2">
          STATUS: <span className="animate-pulse">ASSEMBLING_ACM_PANELS</span>
        </div>
        <div className={isInverted ? "text-zinc-400" : "text-zinc-600"}>
          ENGINEERING_PRECISION: 0.001mm
        </div>
        <div className={isInverted ? "text-zinc-400" : "text-zinc-600"}>
          VERSION: REV_2026.04
        </div>
      </div>

      {/* Corner Brackets */}
      <div className={`absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 ${isInverted ? 'border-black' : 'border-white'} z-20 opacity-50`} />
      <div className={`absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 ${isInverted ? 'border-black' : 'border-white'} z-20 opacity-50`} />
      <div className={`absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 ${isInverted ? 'border-black' : 'border-white'} z-20 opacity-50`} />
    </div>
  );
}
