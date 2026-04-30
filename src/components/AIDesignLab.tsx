import React, { useState, useRef } from 'react';
import { 
  Zap, Camera, RefreshCw, Download, Printer, 
  Layers, Sliders, Box, Info, CheckCircle2,
  FileText, Upload, Plus, Minus, Maximize, Move
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { generateDesignConcept, generateDesignImage } from '../services/geminiService';
import { DesignResult } from '../types';

interface AIDesignLabProps {
  isDarkMode: boolean;
  showToast: (msg: string) => void;
  prompt: string;
  setPrompt: (v: string) => void;
  result: DesignResult | null;
  setResult: (v: DesignResult | null) => void;
  mockImage: string | null;
  setMockImage: (v: string | null) => void;
  sitePhoto: string | null;
  setSitePhoto: (v: string | null) => void;
  clientLogo: string | null;
  setClientLogo: (v: string | null) => void;
  customerEmail: string;
  setCustomerEmail: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  signBox: { x: number; y: number; w: number; h: number };
  setSignBox: React.Dispatch<React.SetStateAction<{ x: number; y: number; w: number; h: number }>>;
}

export default function AIDesignLab({ 
  isDarkMode, 
  showToast, 
  prompt, 
  setPrompt, 
  result, 
  setResult, 
  mockImage, 
  setMockImage, 
  sitePhoto, 
  setSitePhoto, 
  clientLogo, 
  setClientLogo,
  customerEmail,
  setCustomerEmail,
  customerPhone,
  setCustomerPhone,
  signBox,
  setSignBox
}: AIDesignLabProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSiteInViewport, setShowSiteInViewport] = useState(false);
  const [isDualView, setIsDualView] = useState(false);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  
  // Sign Placement State moved to parent App.tsx
  const [isPlacingSign, setIsPlacingSign] = useState(false);
  
  // Zoom & Pan State
  const [scale, setScale] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'site' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'site') setSitePhoto(reader.result as string);
        else setClientLogo(reader.result as string);
        showToast(`${type === 'site' ? 'Site' : 'Logo'} asset integrated.`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);
    setScale(1); 
    setIsDualView(false);
    try {
      // Calculate spatial context for automation
      const spatialContext = sitePhoto ? 
        `Positioned at X:${signBox.x}% Y:${signBox.y}% on the facade, measuring ${Math.round(signBox.w/2)}ft x ${Math.round(signBox.h/2)}ft.` : "";
      
      const logoContext = clientLogo ? "Incorporating provided client branding/logo into the architectural language." : "";
      const fullPrompt = `${prompt}. ${spatialContext} ${logoContext}`;
      
      const data = await generateDesignConcept(fullPrompt);
      setResult(data);
      
      showToast("Synthesizing visual proof...");
      
      try {
        const imageUrl = await generateDesignImage(data.visualDescription, sitePhoto, clientLogo);
        setMockImage(imageUrl);
        showToast("Design synthesis complete.");
      } catch (imgError) {
        console.error("Image generation failed:", imgError);
        // Do not use random Unsplash images anymore if sitePhoto exists
        if (sitePhoto) {
          setMockImage(null); // Clear previous mock if any
          showToast("AI Vision Synthesis encountered an issue. Please retry or adjust parameters.");
        } else {
          setMockImage(`https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1000&auto=format&sig=${Date.now()}`);
          showToast("Visual synthesis failed. Using generic reference photo.");
        }
      }
    } catch (error) {
      showToast("Synthesis failed. Check parameters.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const zoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.5, 1));
  const resetZoom = () => setScale(1);

  return (
    <div className="min-h-[80vh] flex flex-col lg:flex-row relative">
      <AnimatePresence>
        {isProofModalOpen && result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className={`w-full max-w-5xl h-full max-h-[90vh] overflow-y-auto border-2 border-red-600 bg-white text-black p-12 md:p-24 relative font-sans print:p-0 print:border-0`}
            >
              <button 
                onClick={() => setIsProofModalOpen(false)}
                className="absolute top-8 right-8 p-4 hover:bg-zinc-100 transition-colors print:hidden"
              >
                <RefreshCw className="w-6 h-6 rotate-45" />
              </button>

              <div className="flex justify-between items-start mb-12 pb-10 border-b-4 border-zinc-950">
                <div className="flex items-center gap-8">
                  {/* GO SIGNS LOGO - LARGE VERSION FOR PRINT */}
                  <div className="flex flex-col items-start justify-center">
                    <div className="flex text-7xl font-display font-black leading-none tracking-tighter">
                      <span className="text-zinc-950">G</span>
                      <span className="text-red-600">O</span>
                    </div>
                    <div className="flex items-center gap-1 text-[12px] font-bold tracking-[0.5em] mt-1 pr-2 border-r-2 border-red-600">
                      <span className="text-zinc-900">Go Signs</span>
                    </div>
                  </div>
                  <div className="w-px h-24 bg-zinc-200"></div>
                  <div>
                    <h1 className="text-4xl font-display font-black tracking-tighter uppercase mb-2">Technical Proof Case</h1>
                    <div className="flex flex-col gap-1">
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Project ID: GS-AI-SPEC-{Math.floor(Math.random() * 10000)}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-2 pt-2">
                  <p className="font-black text-sm uppercase tracking-widest text-red-600">GO SIGNS HQ</p>
                  <p className="text-[11px] font-mono text-zinc-700 uppercase tracking-widest font-bold">29444 Joy Rd, Livonia, MI 48150</p>
                  <p className="text-[11px] font-mono text-zinc-700 uppercase tracking-widest font-bold">+1 (313) 929-8386</p>
                  <p className="text-[11px] font-mono text-zinc-700 uppercase tracking-widest font-bold">info@gosigns.co</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-12 bg-zinc-100 p-8 border-l-8 border-red-600 print:bg-transparent print:border-l-4 print:p-4">
                <div className="space-y-3">
                  <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold italic">Prepared For (Customer Email)</label>
                  <div className="font-display font-black text-xl tracking-tight border-b-2 border-zinc-300 pb-2">
                    {customerEmail || "PENDING_CONTACT_DATA"}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold italic">Primary Contact Number</label>
                  <div className="font-display font-black text-xl tracking-tight border-b-2 border-zinc-300 pb-2">
                    {customerPhone || "PENDING_CONTACT_DATA"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                <div className="col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {sitePhoto && (
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-400 mb-2 font-bold">Existing Condition (Reference)</p>
                        <img src={sitePhoto} className="w-full grayscale border border-zinc-100 opacity-60" alt="Before" />
                      </div>
                    )}
                    <div className={sitePhoto ? "" : "col-span-2"}>
                      {/* Client Logo Overlay if exists */}
                      {clientLogo && (
                        <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md shadow-lg border border-black/5 w-16 h-16 flex items-center justify-center z-10">
                          <img src={clientLogo} className="w-full h-full object-contain" alt="Client Logo" />
                        </div>
                      )}
                      <img src={mockImage!} className="w-full border-2 border-zinc-950 shadow-2xl relative z-0" alt="Proposed" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-display font-black uppercase text-sm mb-2">Technical Dimensions</h4>
                      <p className="font-mono text-[10px] text-zinc-600 bg-zinc-100 p-2 border-l-2 border-red-600">
                        Proposed Signature Area: {Math.round(signBox.w / 2)}ft (W) x {Math.round(signBox.h / 2)}ft (H) // Center Point Alignment: {Math.round(signBox.x + signBox.w/2)}%, {Math.round(signBox.y + signBox.h/2)}%
                      </p>
                    </div>
                    <div>
                      <h4 className="font-display font-black uppercase text-sm mb-2">Artistic Direction</h4>
                      <p className="text-xs text-zinc-600 leading-relaxed italic">{result.visualDescription}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-100 pb-2 mb-4">Structural Analysis</h4>
                    <p className="text-[11px] leading-relaxed font-bold font-mono">{result.technicalAnalysis}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-100 pb-2 mb-4">Material Schedule</h4>
                    <p className="text-[11px] leading-relaxed font-bold font-mono">{result.materialRecommendation}</p>
                  </div>
                  <div>
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-100 pb-2 mb-4">Logistics Timeline</h4>
                    <p className="text-[11px] leading-relaxed font-bold font-mono">Estimated Production Window: {result.estimatedLeadTime}</p>
                  </div>
                </div>
              </div>

              <div className="border-t-2 border-zinc-950 pt-12 flex justify-between items-end print:pt-6">
                <div className="space-y-4">
                  <div className="w-48 h-12 border border-zinc-300 flex items-center justify-center font-mono text-[8px] text-zinc-300">ENGINEERING SEAL HERE</div>
                  <p className="text-[8px] font-mono text-zinc-400 max-w-xs leading-relaxed uppercase tracking-tighter">
                    This document is an AI-synthesized conceptual proof for Go Signs fabrication. 
                    All structural specifications must be reviewed by GO SIGNS Engineering HQ before final release.
                  </p>
                </div>
                <div className="flex gap-4 print:hidden">
                  <button 
                    onClick={() => {
                      if (!customerEmail || !customerPhone) {
                        showToast("Please provide customer contact info.");
                        return;
                      }
                      setIsTransmitting(true);
                      showToast("Transmitting Technical Package...");
                      
                      // Simulate professional transmission
                      setTimeout(() => {
                        setIsTransmitting(false);
                        setIsSubmitted(true);
                        console.log("SENDING LEAD TO info@gosigns.co", {
                          customerEmail,
                          customerPhone,
                          dimensions: `${Math.round(signBox.w / 2)}'x${Math.round(signBox.h / 2)}'`,
                          projectID: Math.floor(Math.random() * 10000),
                        });
                        window.print();
                        showToast("Submission Successful // Closing Secure Link.");
                      }, 2500);
                    }}
                    className="px-10 py-5 bg-red-600 text-white font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-3 shadow-xl disabled:opacity-50"
                    disabled={isTransmitting}
                  >
                    {isTransmitting ? <RefreshCw className="animate-spin w-4 h-4" /> : <Printer className="w-4 h-4" />}
                    {isTransmitting ? "Transmitting..." : "Finalize & Submit"}
                  </button>
                </div>
              </div>

              {/* Success Overlay for Close Simulation */}
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center text-center p-12 print:hidden"
                  >
                    <div className="w-24 h-24 rounded-full border-4 border-red-600 flex items-center justify-center mb-8">
                      <CheckCircle2 className="w-12 h-12 text-red-600" />
                    </div>
                    <h2 className="text-5xl font-display font-black uppercase tracking-tighter text-white mb-4">Project Transmitted</h2>
                    <p className="text-zinc-400 font-mono text-[10px] uppercase tracking-[0.4em] mb-12">Sent to info@gosigns.co // Secure link closing</p>
                    <button 
                      onClick={() => setIsProofModalOpen(false)}
                      className="px-8 py-4 border border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      Return to Design Lab
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`w-full lg:w-[450px] border-r p-8 ${isDarkMode ? 'bg-[#0f0f0f] border-white/10' : 'bg-white border-black/10'}`}>
        <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest mb-8">
          <Zap className="w-4 h-4" /> Design Simulation v4.0
        </div>
        <h3 className="text-3xl font-display font-black uppercase tracking-tighter mb-4">Parameters</h3>
        
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-[8px] font-mono text-zinc-500 mb-2 uppercase tracking-[0.2em]">Reference Site</p>
            {sitePhoto ? (
              <div className="relative group aspect-square overflow-hidden border border-zinc-800">
                <img src={sitePhoto} className="w-full h-full object-cover grayscale" alt="Site" />
                <button onClick={() => setSitePhoto(null)} className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-mono text-[8px] uppercase text-white">Remove</button>
              </div>
            ) : (
              <label className="block border border-dashed aspect-square cursor-pointer hover:border-red-600 transition-colors relative border-zinc-800 bg-black/20">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'site')} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <Upload className="w-3 h-3 text-zinc-600" />
                  <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-tighter">Site Photo</span>
                </div>
              </label>
            )}
          </div>
          <div>
            <p className="text-[8px] font-mono text-zinc-500 mb-2 uppercase tracking-[0.2em]">Client Logo</p>
            {clientLogo ? (
              <div className="relative group aspect-square overflow-hidden border border-zinc-800 bg-white/5 p-2">
                <img src={clientLogo} className="w-full h-full object-contain" alt="Logo" />
                <button onClick={() => setClientLogo(null)} className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-mono text-[8px] uppercase text-white">Remove</button>
              </div>
            ) : (
              <label className="block border border-dashed aspect-square cursor-pointer hover:border-red-600 transition-colors relative border-zinc-800 bg-black/20">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  <Plus className="w-3 h-3 text-zinc-600" />
                  <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-tighter">Add Logo</span>
                </div>
              </label>
            )}
          </div>
        </div>

        <p className="text-[9px] font-mono text-zinc-500 mb-3 uppercase tracking-[0.2em] leading-relaxed">
          Vision Parameters
        </p>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your facade or signage requirements..."
          className={`w-full h-32 p-4 font-mono text-xs border-2 focus:border-red-600 outline-none mb-6 resize-none transition-all ${
            isDarkMode ? 'bg-black border-zinc-900 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
          }`}
        />

        <div className="space-y-6 mb-10">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500">
            <span>Neural Precision</span>
            <span className="text-red-600">Locked</span>
          </div>
          <div className="h-0.5 bg-zinc-800 relative">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-red-600" 
              initial={{ width: "0%" }}
              animate={{ width: "92%" }}
              transition={{ duration: 2 }}
            />
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {isPlacingSign && (
            <div className="bg-blue-600/10 border border-blue-600/30 p-4 mb-4">
              <p className="text-[8px] font-mono text-blue-400 mb-3 uppercase tracking-widest font-black">Envelope Dimensions (FT)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[7px] font-mono text-blue-300 block mb-1">Width</label>
                  <input 
                    type="range" min="5" max="90" value={signBox.w} 
                    onChange={(e) => setSignBox(prev => ({ ...prev, w: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-blue-900 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[7px] font-mono text-blue-300 block mb-1">Height</label>
                  <input 
                    type="range" min="5" max="60" value={signBox.h} 
                    onChange={(e) => setSignBox(prev => ({ ...prev, h: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-blue-900 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
          <div>
            <p className="text-[8px] font-mono text-zinc-500 mb-2 uppercase tracking-[0.2em]">Customer Email</p>
            <input 
              type="email" 
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="client@example.com"
              className={`w-full p-3 font-mono text-[10px] border focus:border-red-600 outline-none transition-all ${
                isDarkMode ? 'bg-black border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            />
          </div>
          <div>
            <p className="text-[8px] font-mono text-zinc-500 mb-2 uppercase tracking-[0.2em]">Customer Phone</p>
            <input 
              type="tel" 
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+1 (000) 000-0000"
              className={`w-full p-3 font-mono text-[10px] border focus:border-red-600 outline-none transition-all ${
                isDarkMode ? 'bg-black border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-900'
              }`}
            />
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-6 bg-red-600 text-white font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex justify-center items-center gap-4 disabled:opacity-50"
        >
          {isGenerating ? <RefreshCw className="animate-spin w-5 h-5" /> : <Camera className="w-5 h-5" />}
          {isGenerating ? 'Synthesizing...' : 'Generate Simulation'}
        </button>
      </div>

      <div className="flex-1 bg-black flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle, #444 1px, transparent 1px)', backgroundSize: '32px 32px'}}></div>
        <div className="absolute top-12 left-12 font-mono text-[8px] text-zinc-700 tracking-[0.5em] uppercase pointer-events-none">Interactive Viewport // System Active</div>
        
        {/* Zoom & View Controls Overlay */}
        {(mockImage || sitePhoto) && (
          <div className="absolute top-12 right-12 z-20 flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-xl border border-white/10 p-1.5 shadow-2xl">
              {sitePhoto && (
                <button 
                  onClick={() => {
                    setIsPlacingSign(!isPlacingSign);
                    if (!isPlacingSign) setShowSiteInViewport(true); // Auto-switch to site view
                  }}
                  className={`px-3 py-2 text-[9px] font-mono uppercase tracking-widest transition-colors flex items-center gap-2 ${
                    isPlacingSign ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Box className="w-3 h-3" /> {isPlacingSign ? 'Lock Box' : 'Set Sign Area'}
                </button>
              )}

              {sitePhoto && mockImage && (
                <>
                  <div className="w-[1px] h-4 bg-zinc-800 mx-1"></div>
                  <button 
                    onClick={() => { setIsDualView(!isDualView); setShowSiteInViewport(false); }}
                    className={`px-3 py-2 text-[9px] font-mono uppercase tracking-widest transition-colors ${
                      isDualView ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Dual View
                  </button>
                  <div className="w-[1px] h-4 bg-zinc-800 mx-1"></div>
                </>
              )}
              
              {!isDualView && sitePhoto && mockImage && (
                <>
                  <button 
                    onClick={() => setShowSiteInViewport(!showSiteInViewport)}
                    className={`px-3 py-2 text-[9px] font-mono uppercase tracking-widest transition-colors ${
                      showSiteInViewport ? 'bg-zinc-200 text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {showSiteInViewport ? 'View Concept' : 'View Site'}
                  </button>
                  <div className="w-[1px] h-4 bg-zinc-800 mx-1"></div>
                </>
              )}
              <button 
                onClick={zoomOut}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                title="Zoom Out"
              ><Minus className="w-3.5 h-3.5" /></button>
              <span className="text-[9px] font-mono text-zinc-500 w-8 text-center">{Math.round(scale * 100)}%</span>
              <button 
                onClick={zoomIn}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                title="Zoom In"
              ><Plus className="w-3.5 h-3.5" /></button>
              <div className="w-[1px] h-4 bg-zinc-800 mx-1"></div>
              <button 
                onClick={resetZoom}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                title="Reset View"
              ><Maximize className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}

        {/* Pan/Zoom Viewport */}
        <div 
          ref={viewportRef}
          className="flex-1 overflow-hidden flex items-center justify-center p-12 cursor-grab active:cursor-grabbing"
        >
          <AnimatePresence mode="wait">
            {isDualView && sitePhoto && mockImage ? (
              <motion.div 
                key="dual-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-6xl grid grid-cols-2 gap-4 h-full items-center"
              >
                <div className="relative bg-black border border-white/10 p-2 group">
                  <img src={sitePhoto} className="w-full h-auto grayscale opacity-50" alt="Site" />
                  <div className="absolute bottom-4 left-4 font-mono text-[8px] uppercase tracking-widest text-zinc-500">Original Site</div>
                </div>
                <div className="relative bg-black border border-red-600/30 p-2 group shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                  <img src={mockImage} className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-1000" alt="Concept" />
                  <div className="absolute bottom-4 left-4 font-mono text-[8px] uppercase tracking-widest text-red-600">Proposed Concept</div>
                </div>
              </motion.div>
            ) : (showSiteInViewport ? sitePhoto : mockImage) ? (
              <motion.div 
                key={showSiteInViewport ? 'site' : 'mock'}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: scale }}
                exit={{ opacity: 0, scale: 1.02 }}
                drag={scale > 1}
                dragConstraints={viewportRef}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative max-w-4xl w-full group"
              >
                <div className="relative bg-black border border-white/5 shadow-2xl p-4 transition-all" style={{ scale: 1 }}>
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-red-600"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-red-600"></div>
                  
                  <img 
                    src={(showSiteInViewport ? sitePhoto : mockImage) || ''} 
                    alt={showSiteInViewport ? 'Original Site' : 'AI Generated'} 
                    className="w-full h-auto grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 shadow-2xl pointer-events-none select-none" 
                  />
                  
                  {/* Interactive Sign Placement Box - Only visible on site photo when active */}
                  {showSiteInViewport && isPlacingSign && (
                    <motion.div
                      drag
                      dragMomentum={false}
                      className="absolute border-2 border-blue-500 bg-blue-500/20 cursor-move group/box z-30"
                      style={{
                        left: `${signBox.x}%`,
                        top: `${signBox.y}%`,
                        width: `${signBox.w}%`,
                        height: `${signBox.h}%`,
                      }}
                      onDragEnd={(_, info) => {
                        const parent = viewportRef.current?.querySelector('img')?.getBoundingClientRect();
                        if (!parent) return;
                        
                        // Calculate new percentage positions correctly relative to image
                        const localX = info.point.x - parent.left;
                        const localY = info.point.y - parent.top;
                        
                        const newX = (localX / parent.width) * 100 - (signBox.w / 2);
                        const newY = (localY / parent.height) * 100 - (signBox.h / 2);
                        
                        setSignBox(prev => ({ 
                          ...prev, 
                          x: Math.max(0, Math.min(newX, 100 - prev.w)),
                          y: Math.max(0, Math.min(newY, 100 - prev.h))
                        })); 
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white opacity-40 group-hover/box:opacity-100 uppercase font-black pointer-events-none">
                        {Math.round(signBox.w/2)}' x {Math.round(signBox.h/2)}'
                      </div>

                      {/* Manual Resize Handles using Sliders in UI but visual cues here */}
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-500" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500" />
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-500" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-500" />
                    </motion.div>
                  )}
                  
                  {/* Tool Overlays */}
                  <div className={`absolute top-8 right-8 flex gap-3 transition-opacity duration-300 ${scale > 1.5 || showSiteInViewport ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <button 
                      onClick={() => setIsProofModalOpen(true)}
                      className="p-4 bg-white text-black hover:bg-red-600 hover:text-white transition-all shadow-xl flex items-center gap-2 group/btn"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover/btn:inline">Release Proof</span>
                    </button>
                    <button className="p-4 bg-white text-black hover:bg-red-600 hover:text-white transition-all shadow-xl"><Download className="w-4 h-4"/></button>
                  </div>

                  <div className={`absolute bottom-8 left-8 p-6 bg-black/60 backdrop-blur-xl border border-white/10 max-w-sm transition-opacity duration-300 ${scale > 2 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-red-600 mb-2">Material Specification</p>
                    <p className="text-[11px] text-zinc-300 uppercase leading-relaxed font-black tracking-tight">
                      {result?.materialRecommendation || "Analyzing ACM panel layout and wind-load stresses..."}
                    </p>
                  </div>

                  {scale > 1.2 && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 font-mono text-[8px] uppercase tracking-widest flex items-center gap-2 animate-pulse">
                      <Move className="w-3 h-3" /> Panning Enabled
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.8em] text-center"
              >
                Waiting for neural <br /> architectural data
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {result && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-zinc-950/90 border-t border-white/10 p-8 backdrop-blur-xl shrink-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-4">
                  <Info className="w-3 h-3" /> Technical Specs
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-bold">
                  {result.technicalAnalysis}
                </p>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-4">
                  <Box className="w-3 h-3" /> Materials
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-bold">
                  {result.materialRecommendation}
                </p>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-4">
                  <Sliders className="w-3 h-3" /> Production
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-bold">
                  Lead Time: {result.estimatedLeadTime}
                </p>
                <div className="mt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-mono uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3" /> Engineering Validated
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
