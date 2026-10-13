import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { analyzeImageAndSearch, searchWithAiPrompt } from '../../services/aiSearchService';
import { 
  Camera, 
  Sparkles, 
  Upload, 
  X, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowRight, 
  Zap, 
  Eye, 
  Image as ImageIcon,
  ScanLine,
  SlidersHorizontal,
  Store
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AiPhotoSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
  initialTab?: 'photo' | 'ai';
}

const PRESET_SAMPLE_PHOTOS = [
  {
    title: 'boAt Headphones',
    category: 'Electronics',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Surat Silk Saree',
    category: 'Fashion',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Calling Smartwatch',
    category: 'Wearables',
    url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Tata Tea Gold',
    category: 'Grocery',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Brass Puja Diya',
    category: 'Spiritual',
    url: 'https://images.unsplash.com/photo-1567653418876-5bb0e566e1c2?auto=format&fit=crop&w=400&q=80'
  },
  {
    title: 'Prestige Mixer',
    category: 'Appliances',
    url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80'
  }
];

const AI_PROMPT_SUGGESTIONS = [
  'Best wireless headphones under ₹1500 with good bass',
  'Festive pure silk saree from Gujarat weavers',
  'Daily grocery essentials from 10-min local kirana shop',
  'Smart calling watch with heart rate and sleep sensor',
  'Pure brass puja items and diya set for Diwali',
  'Fortune refined oil and Daawat basmati rice'
];

export const AiPhotoSearchModal: React.FC<AiPhotoSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  initialTab = 'photo'
}) => {
  const { products, language, setSelectedProduct, addToCart, setIsCartOpen } = useApp();

  const [activeTab, setActiveTab] = useState<'photo' | 'ai'>(initialTab);
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Search Results State
  const [results, setResults] = useState<{
    product: Product;
    matchScore: number;
    matchReason: string;
  }[]>([]);
  const [detectedLabels, setDetectedLabels] = useState<string[]>([]);
  const [analysisText, setAnalysisText] = useState<string>('');

  // AI Prompt text search
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isSearchingPrompt, setIsSearchingPrompt] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
    if (!isOpen) {
      stopCamera();
      setSelectedPhotoUrl('');
      setResults([]);
      setDetectedLabels([]);
      setAnalysisText('');
    }
  }, [isOpen, initialTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Camera access not supported on this browser. Try uploading a photo or pick a sample.');
      }
    } catch (err) {
      console.warn('Camera error:', err);
      setCameraError('Camera permission blocked. You can pick a sample photo or upload an image file.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      setSelectedPhotoUrl(dataUrl);
      runVisualSearch(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const url = event.target.result as string;
          setSelectedPhotoUrl(url);
          stopCamera();
          runVisualSearch(url);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const runVisualSearch = async (imageUrl: string) => {
    setIsScanning(true);
    setResults([]);
    setDetectedLabels([]);
    setAnalysisText('');

    try {
      const result = await analyzeImageAndSearch(imageUrl, products, language);
      setResults(result.matchedProducts);
      setDetectedLabels(result.detectedLabels);
      setAnalysisText(result.aiAnalysisText);
      confetti({ particleCount: 50, spread: 50 });
    } catch (err) {
      console.error('Visual search failed:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handlePromptSearch = async (queryText?: string) => {
    const q = (queryText || aiPromptInput).trim();
    if (!q) return;

    setIsSearchingPrompt(true);
    setResults([]);
    setDetectedLabels([]);
    setAnalysisText('');

    try {
      const result = await searchWithAiPrompt(q, products, language);
      setResults(result.matchedProducts);
      setDetectedLabels(result.detectedLabels);
      setAnalysisText(result.aiAnalysisText);
      confetti({ particleCount: 60, spread: 55 });
    } catch (err) {
      console.error('AI prompt search failed:', err);
    } finally {
      setIsSearchingPrompt(false);
    }
  };

  const handleProductClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      setSelectedProduct(product);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl border border-slate-200 relative my-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-slate-900">
                  {language === 'hi' ? 'एआई और फोटो सर्च' : 'AI & Photo Visual Search'}
                </h3>
                <span className="bg-orange-100 text-orange-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {language === 'hi' 
                  ? 'फोटो खींचें या एआई से पूछें — तुरंत समान उत्पाद व स्थानीय दुकानें खोजें' 
                  : 'Snap a photo or ask AI — instantly find matching products & local neighborhood stores'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-4 text-xs font-bold">
          <button
            onClick={() => {
              setActiveTab('photo');
              stopCamera();
            }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'photo'
                ? 'bg-white text-orange-600 shadow-xs ring-1 ring-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>📷 {language === 'hi' ? 'फोटो / कैमरा सर्च' : 'Photo Visual Search'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ai');
              stopCamera();
            }}
            className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'ai'
                ? 'bg-white text-orange-600 shadow-xs ring-1 ring-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>✨ {language === 'hi' ? 'एआई स्मार्ट सर्च' : 'AI Assistant Search'}</span>
          </button>
        </div>

        {/* TAB 1: PHOTO VISUAL SEARCH */}
        {activeTab === 'photo' && (
          <div className="space-y-4">
            {/* Live Camera Viewfinder or Image Container */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video sm:aspect-21/9 max-h-72 flex items-center justify-center border-2 border-slate-800">
              {isCameraActive ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover" 
                  />
                  {/* Camera HUD Overlays */}
                  <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full" />
                    <span>LIVE SENSOR VIEW</span>
                  </div>

                  <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-3">
                    <button
                      onClick={captureCameraFrame}
                      className="bg-white hover:bg-orange-50 text-slate-950 font-black text-xs px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 transition transform active:scale-95 cursor-pointer ring-4 ring-orange-500/40"
                    >
                      <Camera className="w-4 h-4 text-orange-600" />
                      <span>Snap & Search Product</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-black/60 hover:bg-black/80 text-white text-xs px-3 py-2.5 rounded-full transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : selectedPhotoUrl ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black/90 group">
                  <img
                    src={selectedPhotoUrl}
                    alt="Target Search"
                    className="w-full h-full object-contain"
                  />
                  {/* Laser Scan Animation Line */}
                  {isScanning && (
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 shadow-[0_0_15px_#f97316] animate-pulse transition-all duration-700" 
                      style={{
                        animation: 'scan 1.8s ease-in-out infinite alternate'
                      }}
                    />
                  )}

                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedPhotoUrl('');
                        setResults([]);
                      }}
                      className="bg-black/70 hover:bg-black/90 text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                    </button>
                  </div>

                  {isScanning && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white space-y-2">
                      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      <p className="font-extrabold text-xs tracking-wider animate-pulse">
                        SCANNING PRODUCT ATTRIBUTES WITH AI...
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty state: Trigger Camera or File Upload */
                <div className="text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 text-orange-400 flex items-center justify-center mx-auto border border-white/10">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white">Snap or Upload Any Product Photo</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Point camera at shoes, clothes, snacks, electronics, or upload from gallery.
                    </p>
                  </div>

                  {cameraError && (
                    <p className="text-[11px] text-amber-300 bg-amber-950/60 p-2 rounded-xl border border-amber-800 max-w-md mx-auto">
                      {cameraError}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                    <button
                      onClick={startCamera}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/30 flex items-center gap-2 transition active:scale-95 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Turn On Live Camera</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/20 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo File</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Sample Presets (Smooth 1-Tap Testing) */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Test Presets (एक-टैप में टेस्ट करें):</span>
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_SAMPLE_PHOTOS.map(p => (
                  <button
                    key={p.title}
                    onClick={() => {
                      setSelectedPhotoUrl(p.url);
                      stopCamera();
                      runVisualSearch(p.url);
                    }}
                    className="p-1.5 bg-slate-50 hover:bg-orange-50 rounded-xl border border-slate-200 hover:border-orange-300 text-center transition group cursor-pointer"
                  >
                    <img 
                      src={p.url} 
                      alt={p.title} 
                      className="w-full h-12 object-cover rounded-lg mb-1 group-hover:scale-105 transition" 
                    />
                    <p className="text-[10px] font-bold text-slate-800 truncate">{p.title}</p>
                    <p className="text-[9px] text-slate-400">{p.category}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI NATURAL SEARCH ASSISTANT */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 space-y-3">
              <label className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-600" />
                <span>Ask AI Shopping Assistant (बोलकर या लिखकर बताएं):</span>
              </label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePromptSearch()}
                    placeholder="e.g. Red silk saree for wedding or boAt headphones under 1500..."
                    className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
                  {aiPromptInput && (
                    <button
                      onClick={() => setAiPromptInput('')}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => handlePromptSearch()}
                  disabled={isSearchingPrompt || !aiPromptInput.trim()}
                  className="bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-extrabold text-xs px-5 py-3 rounded-2xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md shadow-orange-600/20"
                >
                  {isSearchingPrompt ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>{isSearchingPrompt ? 'Searching...' : 'Ask AI'}</span>
                </button>
              </div>

              {/* Sample AI Prompts */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-500">
                  Try asking (सुझाए गए प्रश्न):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AI_PROMPT_SUGGESTIONS.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => {
                        setAiPromptInput(prompt);
                        handlePromptSearch(prompt);
                      }}
                      className="text-[11px] bg-white hover:bg-orange-100/70 border border-slate-200 hover:border-orange-300 text-slate-700 px-2.5 py-1 rounded-xl transition cursor-pointer"
                    >
                      ✨ {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESULTS SECTION */}
        {(results.length > 0 || analysisText || detectedLabels.length > 0) && (
          <div className="mt-5 border-t border-slate-200 pt-4 space-y-3">
            {/* AI Analysis Header */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{analysisText || 'Identified Visual Matches'}</span>
                </p>
                {detectedLabels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {detectedLabels.map((lbl, i) => (
                      <span key={i} className="text-[10px] bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-semibold">
                        #{lbl}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-xl self-start sm:self-auto shrink-0">
                {results.length} Matches Found
              </span>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {results.map(({ product, matchScore, matchReason }) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200 p-3 hover:border-orange-400 hover:shadow-md transition group flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    {/* Image & Match Pill */}
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 border p-2 flex items-center justify-center">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition"
                      />
                      <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-white" />
                        <span>{matchScore}% Match</span>
                      </span>

                      {product.isLocalShopProduct && (
                        <span className="absolute bottom-2 left-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          <span>Local Shop</span>
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        {product.brand}
                      </p>
                      <h4 className="font-extrabold text-xs text-slate-900 line-clamp-2 group-hover:text-orange-600">
                        {product.title}
                      </h4>
                      <p className="text-[10px] text-emerald-700 font-medium mt-0.5 italic">
                        {matchReason}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-sm text-slate-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{product.mrp}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {product.discountPercent}% OFF
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleProductClick(product)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-1.5 px-2 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                      <button
                        onClick={() => {
                          addToCart(product, 1);
                          setIsCartOpen(true);
                          onClose();
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-1.5 px-3 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
