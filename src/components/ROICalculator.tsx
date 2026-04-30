import React, { useState } from 'react';
import { motion } from 'motion/react';

interface ROICalculatorProps {
  isDarkMode: boolean;
  navigateTo: (tab: string) => void;
  traffic: number;
  setTraffic: (v: number) => void;
  ticket: number;
  setTicket: (v: number) => void;
}

export default function ROICalculator({ 
  isDarkMode, 
  navigateTo,
  traffic,
  setTraffic,
  ticket,
  setTicket
}: ROICalculatorProps) {
  // High-level estimation: A quality facade can increase capture rate by roughly 0.3% to 1.5%
  // We use a conservative 0.3% here to maintain professional credibility.
  const captureIncrease = 0.003;
  const hiddenRevenue = (traffic * captureIncrease * ticket * 30);

  return (
    <section className={`py-24 px-4 lg:px-24 border-b ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-2 text-red-600 font-mono text-[10px] tracking-[0.3em] uppercase mb-6">
            <div className="w-8 h-[1px] bg-red-600"></div> Business Intelligence
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-black uppercase tracking-tighter mb-6 leading-none">
            Facade ROI <br/><span className="text-red-600">Engine.</span>
          </h2>
          <p className={`max-w-md text-sm leading-relaxed mb-12 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-600'}`}>
            A modern facade isn't just aesthetic—it's a high-yield asset. Calculate the monthly revenue currently lost to visual friction and outdated branding.
          </p>
          
          <div className="space-y-10 max-w-sm">
            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="font-mono text-[10px] uppercase tracking-widest">Daily Traffic Volume</label>
                <span className="text-lg font-display font-black">{traffic.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="5000" 
                max="100000" 
                step="1000"
                value={traffic} 
                onChange={(e) => setTraffic(parseInt(e.target.value))} 
                className="w-full h-px bg-zinc-800 appearance-none accent-red-600 cursor-pointer" 
              />
              <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-zinc-500 mt-2">
                <span>Small Scale</span>
                <span>Urban Hub</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                <label className="font-mono text-[10px] uppercase tracking-widest">Avg Transaction Size</label>
                <span className="text-lg font-display font-black">${ticket}</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="500" 
                step="5"
                value={ticket} 
                onChange={(e) => setTicket(parseInt(e.target.value))} 
                className="w-full h-px bg-zinc-800 appearance-none accent-red-600 cursor-pointer" 
              />
              <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest text-zinc-500 mt-2">
                <span>Casual</span>
                <span>Premium</span>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className={`p-12 border-2 border-red-600 flex flex-col justify-center items-center text-center relative overflow-hidden ${
            isDarkMode ? 'bg-zinc-900' : 'bg-zinc-50'
          }`}
        >
          <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-zinc-500 uppercase tracking-widest">Est. 48-Month Lifecycle</div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-6">Est. Monthly Growth Opportunity</p>
          <motion.div 
            key={hiddenRevenue}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-7xl lg:text-8xl font-display font-black tracking-tighter text-red-600 mb-10"
          >
            ${Math.round(hiddenRevenue).toLocaleString()}
          </motion.div>
          <button 
            onClick={() => navigateTo('contact')} 
            className="w-full py-5 bg-zinc-950 text-white font-black uppercase tracking-widest hover:bg-red-600 transition-colors"
          >
            Capture This Revenue
          </button>
          <p className="mt-6 text-[8px] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed">
            *Based on standardized 0.3% street-to-store conversion optimization.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
