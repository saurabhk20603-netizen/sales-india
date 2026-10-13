import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wifi, Battery, Signal, Smartphone } from 'lucide-react';

interface MobileFrameWrapperProps {
  children: React.ReactNode;
}

export const MobileFrameWrapper: React.FC<MobileFrameWrapperProps> = ({ children }) => {
  const { isMobileFrame, setIsMobileFrame } = useApp();

  if (!isMobileFrame) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900/95 py-6 px-4 flex flex-col items-center justify-center">
      {/* Top Banner indicating mobile preview mode */}
      <div className="mb-4 flex items-center justify-between w-full max-w-sm text-xs text-slate-300">
        <span className="flex items-center gap-1.5 font-bold text-amber-400">
          <Smartphone className="w-4 h-4" />
          <span>Android App Preview (Samsung Galaxy / Pixel)</span>
        </span>
        <button
          onClick={() => setIsMobileFrame(false)}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1 rounded-full border border-slate-700 transition"
        >
          Exit to Fullscreen ✕
        </button>
      </div>

      {/* Realistic Android Phone Bezel */}
      <div className="w-full max-w-[412px] h-[860px] bg-black rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-700/50 flex flex-col relative overflow-hidden">
        {/* Camera Punchhole & Speaker */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          </div>
        </div>

        {/* Inner Phone Screen */}
        <div className="w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative">
          {/* Android Status Bar */}
          <div className="h-7 bg-slate-900 text-white text-[10px] px-6 flex items-center justify-between z-50 shrink-0 font-medium select-none">
            <span>01:30</span>
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span>94%</span>
                <Battery className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Phone Content viewport */}
          <div className="flex-1 overflow-y-auto relative flex flex-col">
            {children}
          </div>

          {/* Android Gesture Bar */}
          <div className="h-4 bg-white/90 backdrop-blur-xs flex items-center justify-center shrink-0 z-50">
            <div className="w-32 h-1 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
