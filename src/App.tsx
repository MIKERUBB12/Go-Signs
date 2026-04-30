import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Zap, CheckCircle2, AlertCircle, 
  Sun, Moon, ArrowUpRight, Phone, Mail, Instagram, Linkedin 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AIDesignLab from './components/AIDesignLab';
import ROICalculator from './components/ROICalculator';
import { DesignResult } from './types';

import ACMAnimation from './components/ACMAnimation';

// Notification Toast Component
const Toast = ({ message, type, isDarkMode }: { message: string, type: 'success' | 'error', isDarkMode: boolean }) => (
  <motion.div 
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 50, opacity: 0 }}
    className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 border shadow-2xl backdrop-blur-lg ${
      isDarkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/10'
    }`}
  >
    {type === 'success' ? (
      <CheckCircle2 className="text-emerald-500 w-5 h-5" />
    ) : (
      <AlertCircle className="text-red-500 w-5 h-5" />
    )}
    <span className="font-mono text-[10px] uppercase tracking-widest font-bold">
      {message}
    </span>
  </motion.div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Persistent ROI State
  const [roiTraffic, setRoiTraffic] = useState(25000);
  const [roiTicket, setRoiTicket] = useState(65);

  // Persistent Lab State
  const [labPrompt, setLabPrompt] = useState('Modern gas station canopy with matte black ACM panels and red LED halo signage, hyper-realistic, 8k');
  const [labResult, setLabResult] = useState<DesignResult | null>(null);
  const [labMockImage, setLabMockImage] = useState<string | null>(null);
  const [labSitePhoto, setLabSitePhoto] = useState<string | null>(null);
  const [labClientLogo, setLabClientLogo] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [signBox, setSignBox] = useState({ x: 30, y: 30, w: 40, h: 15 });

  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, [activeTab]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-700 selection:bg-red-600 selection:text-white ${
      isDarkMode ? 'bg-[#050505] text-zinc-50' : 'bg-[#fafafa] text-zinc-950'
    }`}>
      
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} type={toast.type} isDarkMode={isDarkMode} />
        )}
      </AnimatePresence>

      {/* Industrial Header */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b backdrop-blur-xl ${
        isDarkMode ? 'bg-black/80 border-white/5' : 'bg-white/80 border-black/5'
      }`}>
        <div className="w-full px-4 sm:px-8 lg:px-16 h-20 flex justify-between items-center">
          <div className="flex items-center cursor-pointer group" onClick={() => navigateTo('home')}>
            <div className="flex flex-col items-start justify-center">
              <div className="flex text-3xl font-display font-black leading-none tracking-tighter transition-transform group-hover:-translate-y-0.5">
                <span className={isDarkMode ? "text-white" : "text-zinc-950"}>G</span>
                <span className="text-red-600">O</span>
              </div>
              <div className="flex items-center gap-1 text-[7px] font-bold tracking-[0.4em] mt-1">
                <span className="text-red-600 opacity-50">/</span>
                <span className={isDarkMode ? "text-zinc-400" : "text-zinc-600"}>Go Signs</span>
                <span className="text-red-600 opacity-50">/</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-12">
            {['home', 'services', 'portfolio', 'contact'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => navigateTo(tab)} 
                className={`text-[15px] font-mono uppercase tracking-[0.3em] transition-all relative py-2 ${
                  activeTab === tab ? 'text-red-600' : (isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-black')
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 w-full h-[1px] bg-red-600" />
                )}
              </button>
            ))}
            <div className="w-px h-6 bg-zinc-800"></div>
            <button 
              onClick={() => navigateTo('lab')} 
              className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white text-[13px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              <Zap className="w-4 h-4 fill-current" /> AI LAB
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2 transition-colors ${isDarkMode ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-black'}`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="md:hidden flex items-center">
             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed inset-0 z-40 md:hidden pt-24 px-8 ${isDarkMode ? 'bg-black' : 'bg-white'}`}
          >
            <div className="flex flex-col gap-8">
              {['home', 'services', 'portfolio', 'contact', 'lab'].map((tab) => (
                <button 
                  key={tab} 
                  onClick={() => navigateTo(tab)}
                  className="text-4xl font-display font-black uppercase tracking-tighter text-left py-4 border-b border-zinc-800"
                >
                  {tab}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Views */}
      <main className="pt-20">
        {activeTab === 'home' && (
          <HomeView 
            navigateTo={navigateTo} 
            isDarkMode={isDarkMode}
            roiTraffic={roiTraffic}
            setRoiTraffic={setRoiTraffic}
            roiTicket={roiTicket}
            setRoiTicket={setRoiTicket}
          />
        )}
        {activeTab === 'services' && <ServicesView isDarkMode={isDarkMode} />}
        {activeTab === 'portfolio' && <PortfolioView isDarkMode={isDarkMode} />}
        {activeTab === 'contact' && <ContactView isDarkMode={isDarkMode} showToast={showToast} />}
        {activeTab === 'lab' && (
          <AIDesignLab 
            isDarkMode={isDarkMode} 
            showToast={showToast}
            prompt={labPrompt}
            setPrompt={setLabPrompt}
            result={labResult}
            setResult={setLabResult}
            mockImage={labMockImage}
            setMockImage={setLabMockImage}
            sitePhoto={labSitePhoto}
            setSitePhoto={setLabSitePhoto}
            clientLogo={labClientLogo}
            setClientLogo={setLabClientLogo}
            customerEmail={customerEmail}
            setCustomerEmail={setCustomerEmail}
            customerPhone={customerPhone}
            setCustomerPhone={setCustomerPhone}
            signBox={signBox}
            setSignBox={setSignBox}
          />
        )}
      </main>

      {/* High-Concept Footer */}
      <footer className={`border-t py-24 ${isDarkMode ? 'bg-black border-white/5' : 'bg-zinc-50 border-black/5'}`}>
        <div className="w-full px-8 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-32 max-w-7xl mx-auto">
            <div className="col-span-2">
              <h2 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-none mb-8">
                Ready to <br/><span className="text-red-600">Fabricate?</span>
              </h2>
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest max-w-xs leading-loose">
                Engineering precision for architectural identities since 2008.
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-6">Technical HQ</p>
              <div className="space-y-4">
                <p className="text-sm font-bold flex items-center gap-3">
                  <ArrowUpRight className="w-4 h-4 text-red-600" /> 29444 Joy Rd, MI 48150
                </p>
                <p className="text-sm font-bold flex items-center gap-3">
                  <Phone className="w-4 h-4 text-red-600" /> +1 (313) 929-8386
                </p>
              </div>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-6">Network</p>
              <div className="flex gap-6">
                <Instagram className="w-5 h-5 hover:text-red-600 cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 hover:text-red-600 cursor-pointer transition-colors" />
                <Mail className="w-5 h-5 hover:text-red-600 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          
          <div className="relative h-48 overflow-hidden border-y border-zinc-800 mt-24">
             <div className="absolute inset-0 opacity-40">
                <ACMAnimation isDarkMode={isDarkMode} />
             </div>
             <div className="relative h-full flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                <h1 className="text-4xl md:text-5xl font-display font-black tracking-[0.2em] text-red-600 select-none">
                  GO SIGNS
                </h1>
                <div className="absolute bottom-4 right-8 font-mono text-[8px] text-zinc-500 uppercase tracking-widest animate-pulse">
                  System: Fabrication_Active // All Rights Reserved
                </div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- View Components ---

function HomeView({ 
  navigateTo, 
  isDarkMode,
  roiTraffic,
  setRoiTraffic,
  roiTicket,
  setRoiTicket
}: { 
  navigateTo: (tab: string) => void; 
  isDarkMode: boolean;
  roiTraffic: number;
  setRoiTraffic: (v: number) => void;
  roiTicket: number;
  setRoiTicket: (v: number) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="transition-all duration-700">
      <section className="relative min-h-[90vh] flex flex-col lg:flex-row border-b border-zinc-800 overflow-hidden">
        {/* Spatial Grid Layer */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#ff0000_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>

        <div className="flex-1 p-8 lg:p-24 flex flex-col justify-center relative z-10">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "circOut" }}
          >
            <div className="inline-flex items-center gap-3 text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase mb-10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 64 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-[2px] bg-red-600"
              ></motion.div> Engineering Reality
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-display font-black uppercase tracking-tighter leading-[0.82] mb-10 select-none">
              <motion.span 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="block"
              >
                Structural
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-red-600"
              >
                Identity.
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className={`max-w-md text-xl font-medium leading-relaxed mb-16 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}
            >
              We bridge the gap between high-concept vision and industrial form. Precision ACM cladding, CNC routing, and intelligent signage systems.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex flex-wrap gap-6"
            >
              <button 
                onClick={() => navigateTo('lab')} 
                className="group relative px-12 py-6 bg-red-600 text-white font-black uppercase tracking-[0.2em] transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">Launch AI Lab <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
              <button 
                onClick={() => navigateTo('portfolio')} 
                className={`px-12 py-6 border-2 font-black uppercase tracking-[0.2em] transition-all ${
                  isDarkMode ? 'border-white hover:bg-white hover:text-black' : 'border-zinc-950 hover:bg-zinc-950 hover:text-white'
                }`}
              >
                Portfolio
              </button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="flex-1 bg-zinc-950 overflow-hidden relative group min-h-[500px]"
        >
           <ACMAnimation isDarkMode={isDarkMode} />
           
           <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent lg:hidden"></div>
           
           {/* Animated Telemetry Overlay */}
           <div className="absolute top-12 right-12 z-20 font-mono text-[10px] text-red-600 uppercase tracking-widest vertical-rl h-40 flex items-center justify-between border-r border-red-600/30 pr-4 bg-black/40 backdrop-blur-md p-2">
              <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}>ISO 9001:2015</motion.span>
              <span className="text-white font-black">PROJECT: GS-ACM-SPEC</span>
              <span>EST 2026 // INSTALLATION</span>
           </div>
        </motion.div>
      </section>
      
      <ROICalculator 
        isDarkMode={isDarkMode} 
        navigateTo={navigateTo} 
        traffic={roiTraffic}
        setTraffic={setRoiTraffic}
        ticket={roiTicket}
        setTicket={setRoiTicket}
      />
      
      {/* Capability Grid */}
      <section className={`py-24 px-8 lg:px-24 ${isDarkMode ? 'bg-zinc-950' : 'bg-zinc-100'}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 px-1 bg-zinc-800 border-x border-zinc-800 max-w-7xl mx-auto">
          {[
            { title: "ACM CLADDING", desc: "Premium architectural composite materials for flawless finishes." },
            { title: "PRECISION MILLING", desc: "Automated CNC routing for complex industrial geometries." },
            { title: "SMART SIGNAGE", desc: "Integrated LED and IoT branding solutions for modern retail." }
          ].map((item, idx) => (
            <div key={idx} className={`p-16 ${isDarkMode ? 'bg-black hover:bg-zinc-900' : 'bg-white hover:bg-zinc-50'} transition-colors group cursor-default`}>
              <h3 className="text-2xl font-display font-black mb-6 tracking-tighter group-hover:text-red-600 transition-colors uppercase">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">{item.desc}</p>
              <div className="w-12 h-[2px] bg-zinc-800 group-hover:w-full group-hover:bg-red-600 transition-all duration-500" />
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function ServicesView({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className="p-12 lg:p-24 animate-in fade-in duration-1000 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 text-red-600 font-mono text-[10px] tracking-[0.4em] uppercase mb-10">
        <div className="w-16 h-[2px] bg-red-600"></div> Fabrication Scope
      </div>
      <h2 className="text-7xl font-display font-black uppercase tracking-tighter mb-20 leading-none">Engineering <br />Solutions.</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format" className="w-full grayscale opacity-80" alt="Factory" />
        <div className="space-y-12 py-8">
           <div className="border-l-2 border-red-600 pl-8">
              <h4 className="text-xl font-bold uppercase tracking-tight mb-4">ACM Panel Systems</h4>
              <p className="text-zinc-500 text-sm leading-loose">We specialize in rainscreen and pressure-equalized facade systems. Our precision-routed aluminum composite panels offer superior flat-panel aesthetics with zero oil-canning.</p>
           </div>
           <div className="border-l-2 border-zinc-800 pl-8">
              <h4 className="text-xl font-bold uppercase tracking-tight mb-4">Illuminated Architecturals</h4>
              <p className="text-zinc-500 text-sm leading-loose">Channel letters, push-through acrylics, and custom halo lighting utilizing high-efficiency LED modules for maximum impact and minimum maintenance.</p>
           </div>
           <div className="border-l-2 border-zinc-800 pl-8">
              <h4 className="text-xl font-bold uppercase tracking-tight mb-4">Millwork & Metal</h4>
              <p className="text-zinc-500 text-sm leading-loose">Structural steel frames, laser-cut aluminum skeletons, and architectural millwork for retail interiors and exterior landmark features.</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioView({ isDarkMode }: { isDarkMode: boolean }) {
  const images = [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600",
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600",
    "https://images.unsplash.com/photo-1503387762-5929c69d3978?q=80&w=600"
  ];
  return (
    <div className="p-12 lg:p-24 max-w-7xl mx-auto">
      <h2 className="text-7xl font-display font-black uppercase tracking-tighter mb-20">The Works.</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((src, i) => (
          <div key={i} className="aspect-video bg-zinc-900 overflow-hidden group relative">
            <img src={src} className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-700" alt="Work" />
            <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
               <p className="font-mono text-[8px] uppercase tracking-widest text-red-600 mb-2">Sector: Corporate</p>
               <h4 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Project Alpha-7</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactView({ isDarkMode, showToast }: { isDarkMode: boolean, showToast: (m: string) => void }) {
  return (
    <div className="p-12 lg:p-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        <div>
          <h2 className="text-7xl font-display font-black uppercase tracking-tighter mb-12">Connect.</h2>
          <form onSubmit={(e) => { e.preventDefault(); showToast("Inquiry Transmitted to info@gosigns.co"); }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest">Client Name</label>
                <input className={`w-full p-4 border-b-2 outline-none focus:border-red-600 transition-colors tracking-tight ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'}`} required />
              </div>
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-widest">Industry</label>
                <input className={`w-full p-4 border-b-2 outline-none focus:border-red-600 transition-colors tracking-tight ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'}`} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase tracking-widest">Brief / Parameters</label>
              <textarea rows={4} className={`w-full p-4 border-b-2 outline-none focus:border-red-600 transition-colors tracking-tight resize-none ${isDarkMode ? 'bg-black border-zinc-800' : 'bg-white border-zinc-200'}`} required />
            </div>
            <button className="w-full py-6 bg-red-600 text-white font-black uppercase tracking-widest hover:bg-black transition-colors">Start Final Engineering</button>
          </form>
          
          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-zinc-800 pt-12">
            <div>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Direct Line</p>
              <p className="text-xl font-display font-black text-red-600 underline">313.929.8386</p>
            </div>
            <div>
              <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Email HQ</p>
              <p className="text-xl font-display font-black">info@gosigns.co</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <p className="font-mono text-[10px] text-red-600 uppercase tracking-[0.4em] mb-4">Industrial Logistics HQ</p>
          <div className="relative aspect-video w-full border-2 border-zinc-800 grayscale hover:grayscale-0 transition-all duration-700 overflow-hidden group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2948.334460599042!2d-83.3364446845437!3d42.35655597918712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8824b221e784562b%3A0x3348126e0696778f!2s29444%20Joy%20Rd%2C%20Livonia%2C%20MI%2048150!5e0!3m2!1sen!2sus!4v1682828000000!5m2!1sen!2sus"
              className="w-full h-full border-0 grayscale opacity-80 group-hover:opacity-100 transition-opacity"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            
            {/* Custom Logo Pin Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
              <div className="bg-red-600 text-white p-2 rounded-sm shadow-2xl skew-x-[-12deg] flex flex-col items-center">
                <div className="flex text-lg font-display font-black leading-none tracking-tighter">
                  <span>G</span><span className="text-black">O</span>
                </div>
                <div className="text-[5px] font-bold tracking-widest mt-0.5">Go Signs</div>
              </div>
              <div className="w-1 h-3 bg-red-600/50 mt-[-2px]"></div>
            </div>
          </div>
          <div className={`p-8 font-mono text-[10px] leading-relaxed uppercase tracking-widest ${isDarkMode ? 'bg-zinc-900/50' : 'bg-zinc-100'}`}>
            <span className="text-red-600 font-black">Location Notice:</span><br/>
            Our fabrication yard in Livonia (48150) handles all ACM, CNC, and assembly logistics. Direct consultation available by appointment for structural signage projects.
          </div>
        </div>
      </div>
    </div>
  );
}
