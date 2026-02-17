
import React, { useState, useRef } from 'react';
import { editRamadanImage } from '../services/geminiService';
import { Sparkles } from './Decorations';

interface FaithMemory {
  id: string;
  original: string;
  edited: string | null;
  mimeType: string;
}

const ImageEditor: React.FC = () => {
  const [memories, setMemories] = useState<FaithMemory[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeMemory = activeIndex >= 0 ? memories[activeIndex] : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          const newMemory: FaithMemory = {
            id: Math.random().toString(36).substr(2, 9),
            original: readerEvent.target?.result as string,
            edited: null,
            mimeType: file.type,
          };
          setMemories(prev => {
            const updated = [...prev, newMemory];
            if (updated.length === 1) setActiveIndex(0);
            return updated;
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleEdit = async () => {
    if (!activeMemory || !prompt) return;
    setIsProcessing(true);
    const edited = await editRamadanImage(activeMemory.original, prompt, activeMemory.mimeType);
    if (edited) {
      setMemories(prev => prev.map((m, i) => i === activeIndex ? { ...m, edited } : m));
    }
    setIsProcessing(false);
  };

  const removeMemory = (id: string) => {
    setMemories(prev => {
      const filtered = prev.filter(m => m.id !== id);
      if (activeIndex >= filtered.length) setActiveIndex(filtered.length - 1);
      return filtered;
    });
  };

  return (
    <div className="p-6 md:p-12 pt-20 space-y-12 animate-fade-in relative pb-40 min-h-screen">
        <Sparkles className="inset-0 opacity-20" />
        
        <div className="text-center space-y-4 relative z-10">
            <h2 className="text-7xl font-dancing text-pink-500 drop-shadow-sm">Memory Sanctuary</h2>
            <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">Capture & Luminate Your Spiritual Moments</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-10 relative z-10">
            {/* Gallery Selector / Thumbnails Area */}
            {memories.length > 0 && (
                <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar px-4">
                    {memories.map((m, i) => (
                        <div key={m.id} className="relative group shrink-0">
                            <button 
                                onClick={() => setActiveIndex(i)}
                                className={`w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${activeIndex === i ? 'border-pink-500 scale-105 shadow-xl' : 'border-white/50 opacity-60 hover:opacity-100'}`}
                            >
                                <img src={m.edited || m.original} className="w-full h-full object-cover" alt="Memory" />
                            </button>
                            <button 
                                onClick={() => removeMemory(m.id)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >✕</button>
                        </div>
                    ))}
                    {/* Add More Button Icon as per screenshot request */}
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-2xl border-4 border-dashed border-pink-200 bg-pink-50/30 flex flex-col items-center justify-center gap-1 group hover:border-pink-400 transition-all shrink-0"
                        title="Add more faith moments"
                    >
                        <span className="text-3xl text-pink-400 group-hover:scale-110 transition-transform">+</span>
                        <span className="text-[8px] font-black uppercase text-pink-300">Add More</span>
                    </button>
                </div>
            )}

            {/* Main Viewport */}
            <div className="bg-white/90 backdrop-blur-3xl border-2 border-dashed border-pink-100/50 rounded-[4rem] p-8 flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden shadow-2xl group transition-all hover:border-pink-300">
                {activeMemory ? (
                    <div className="relative w-full flex flex-col items-center gap-8">
                        <div className="relative group/res w-full flex justify-center">
                            <img src={activeMemory.edited || activeMemory.original} alt="Memory" className="max-h-[600px] w-full object-contain rounded-3xl shadow-2xl animate-fade-in" />
                            <div className="absolute inset-0 bg-black/0 group-hover/res:bg-black/5 rounded-3xl transition-all pointer-events-none"></div>
                        </div>
                        
                        {activeMemory.edited && (
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setMemories(prev => prev.map((m, i) => i === activeIndex ? { ...m, edited: null } : m))}
                                    className="px-6 py-3 bg-white text-gray-400 font-black rounded-full text-[10px] uppercase tracking-widest border border-gray-100 hover:text-gray-600 transition-all"
                                >
                                    Reset to Original
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center space-y-8 p-12">
                        <div className="w-24 h-24 bg-pink-50 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-inner group-hover:scale-110 transition-transform">📸</div>
                        <div className="space-y-3">
                            <p className="text-gray-500 font-bold text-xl">Preserve a Moment of Faith</p>
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-widest max-w-[280px]">Upload an Iftar gathering, a decorated prayer corner, or your Eid preparations.</p>
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-pink-500 text-white font-black py-4 px-12 rounded-full shadow-xl hover:bg-pink-600 active:scale-95 transition-all text-xs uppercase tracking-widest"
                        >
                            Select from Gallery
                        </button>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    multiple
                    onChange={handleFileChange} 
                />
            </div>

            {activeMemory && (
                <div className="space-y-8 bg-white/80 backdrop-blur-3xl p-10 rounded-[4rem] shadow-xl border border-white relative overflow-hidden animate-fade-up">
                    <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 pointer-events-none">✨</div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-pink-400 uppercase tracking-[0.4em] pl-2">Divine Enhancements</p>
                        <h3 className="text-2xl font-black text-gray-800 tracking-tight">Luminate this memory...</h3>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                        <input 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. 'Add warm golden lanterns and soft candle glow'..."
                            className="flex-1 p-6 rounded-[2.5rem] bg-gray-50/50 border-none text-gray-700 text-lg font-medium focus:ring-4 focus:ring-pink-100 shadow-inner placeholder-gray-200 transition-all"
                        />
                        <button 
                            onClick={handleEdit}
                            disabled={isProcessing || !prompt}
                            className={`px-12 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-xl min-h-[70px] ${isProcessing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-black active:scale-95'}`}
                        >
                            {isProcessing ? 'Manifesting...' : 'Luminate ✨'}
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                        {[
                          { label: 'Golden Lanterns', prompt: 'Add traditional golden lanterns hanging from the top with a warm glow' },
                          { label: 'Polaroid Aesthetic', prompt: 'Convert into a vintage polaroid style photo with warm tones' },
                          { label: 'Crescent Moon', prompt: 'Add a subtle crescent moon in the background and soft moonlight' },
                          { label: 'Floral Borders', prompt: 'Add elegant spiritual floral borders in gold and white' },
                          { label: 'Cinematic Depth', prompt: 'Make the lighting cinematic, deep colors, and add spiritual particles' }
                        ].map(suggestion => (
                            <button 
                                key={suggestion.label}
                                onClick={() => setPrompt(suggestion.prompt)}
                                className="text-[10px] bg-white border border-pink-100 text-pink-500 font-black px-6 py-2.5 rounded-full hover:bg-pink-50 hover:border-pink-200 transition-all active:scale-90 shadow-sm"
                            >
                                + {suggestion.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {activeMemory?.edited && (
                <div className="flex flex-col sm:flex-row justify-center gap-6 animate-fade-in">
                    <button 
                        onClick={() => setMemories(prev => prev.map((m, i) => i === activeIndex ? { ...m, original: m.edited!, edited: null } : m))}
                        className="px-10 py-5 bg-white border border-pink-100 text-pink-500 font-black rounded-full text-[10px] uppercase tracking-widest hover:bg-pink-50 transition-all shadow-md active:scale-95"
                    >
                        Save This Revision
                    </button>
                    <a 
                        href={activeMemory.edited} 
                        download="nur_memory.png"
                        className="px-10 py-5 bg-pink-500 text-white font-black rounded-full text-[10px] uppercase tracking-widest hover:bg-pink-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3"
                    >
                        <span>Download Memory</span>
                        <span className="text-lg">📥</span>
                    </a>
                </div>
            )}
        </div>

        <style>{`
            .animate-fade-in { animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1); }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .no-scrollbar::-webkit-scrollbar { display: none; }
            .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
    </div>
  );
};

export default ImageEditor;
