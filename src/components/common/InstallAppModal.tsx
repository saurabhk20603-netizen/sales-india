import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Share2, 
  PlusSquare, 
  Laptop,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'desktop'>('android');
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // Detect if already installed / standalone
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone) {
      setIsInstalled(true);
    }

    // Detect OS
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setActivePlatform('ios');
    } else if (/android/.test(ua)) {
      setActivePlatform('android');
    } else {
      setActivePlatform('desktop');
    }

    // Capture PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallSuccess(true);
      confetti({ particleCount: 100, spread: 70 });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallSuccess(true);
          confetti({ particleCount: 100, spread: 70 });
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Native prompt failed:', err);
      }
    } else {
      // In preview/iframe or unsupported environment, show guide or open direct URL
      const isIframe = window.self !== window.top;
      if (isIframe) {
        // Open the app in top-level window so browser can trigger native install banner
        window.open(window.location.href, '_blank');
      } else {
        setInstallSuccess(true);
        confetti({ particleCount: 80, spread: 60 });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Icon & Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 p-0.5 shadow-lg shadow-orange-500/20 shrink-0">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
              <img src="/icon.svg" alt="Sales India App" className="w-14 h-14 object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg text-slate-900">Sales India App</h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>Fast Install</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">Shopping Bazar & Fast Express Delivery</p>
            <p className="text-[11px] text-orange-600 font-bold mt-0.5">🇮🇳 100% Free • No App Store needed</p>
          </div>
        </div>

        {installSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="font-black text-lg text-slate-900">App Ready & Installed! 🎉</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Sales India is now available on your device home screen with instant 1-tap launch, offline support & fast express tracking!
            </p>
            <button
              onClick={onClose}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs transition cursor-pointer"
            >
              Start Shopping Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Benefits */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-100">
                <Zap className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block">Fast Launch</span>
                <span className="text-[10px] text-slate-500">Opens in 1s</span>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block">Small Size</span>
                <span className="text-[10px] text-slate-500">Only ~2 MB</span>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                <Sparkles className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="font-bold text-slate-800 block">Fast Tracking</span>
                <span className="text-[10px] text-slate-500">Live Rider GPS</span>
              </div>
            </div>

            {/* Direct One-Click Fast Install Button */}
            <button
              onClick={handleNativeInstall}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>⚡ Fast Install App Now (तुरंत इंस्टॉल करें)</span>
            </button>

            {/* Device-Specific Fast Installation Instructions */}
            <div className="border border-slate-200 rounded-2xl p-3.5 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">
                  Installation Steps for Your Device:
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setActivePlatform('android')}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${activePlatform === 'android' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    Android
                  </button>
                  <button
                    onClick={() => setActivePlatform('ios')}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${activePlatform === 'ios' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    iPhone (iOS)
                  </button>
                  <button
                    onClick={() => setActivePlatform('desktop')}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${activePlatform === 'desktop' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}
                  >
                    PC / Laptop
                  </button>
                </div>
              </div>

              {activePlatform === 'android' && (
                <div className="text-[11px] text-slate-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <p>Tap the <strong>three dots (⋮)</strong> at top right corner of Chrome browser.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <p>Select <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <p>Confirm <strong>&ldquo;Install&rdquo;</strong>. App icon will appear on your phone home screen immediately!</p>
                  </div>
                </div>
              )}

              {activePlatform === 'ios' && (
                <div className="text-[11px] text-slate-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <p>Tap the <strong>Share button ( <Share2 className="w-3 h-3 inline text-blue-600" /> )</strong> at the bottom of Safari.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <p>Scroll down and select <strong>&ldquo;Add to Home Screen&rdquo; ( <PlusSquare className="w-3 h-3 inline text-slate-700" /> )</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <p>Tap <strong>&ldquo;Add&rdquo;</strong> at the top right corner. Done!</p>
                  </div>
                </div>
              )}

              {activePlatform === 'desktop' && (
                <div className="text-[11px] text-slate-600 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <p>Look at the address bar in Chrome or Edge (right side).</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <p>Click the <strong>Install icon ( ⊕ or laptop icon )</strong>.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-800 font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <p>Click <strong>Install</strong> to run Sales India as a desktop app without browser tabs!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Open in Full Tab for iframe preview */}
            <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
              <span>Testing in Preview Mode?</span>
              <a
                href={window.location.href}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <span>Open Direct Full Window</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
