
import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../utils/sounds';

interface DogStageProps {
  isStraining: boolean;
  showResult: boolean;
  giverName?: string;
  receiverName?: string | null;
}

const DogStage: React.FC<DogStageProps> = ({ isStraining, showResult, giverName, receiverName }) => {
  const [internalDrop, setInternalDrop] = useState(false);
  const timers = useRef<number[]>([]);

  const clearAllTimers = () => {
    timers.current.forEach(t => clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    if (isStraining) {
      // 酝酿 2.5s 后开始掉落
      const dropTimer = window.setTimeout(() => {
        setInternalDrop(true);
        
        // 落地动画在 index.html 定义为 1s
        // 我们在动画即将结束时播放落地音效 (约 900ms-1000ms 处)
        const splatTimer = window.setTimeout(() => {
          sounds.playSplat();
        }, 950);
        
        timers.current.push(splatTimer);
      }, 2500);
      
      timers.current.push(dropTimer);
    } else {
      clearAllTimers();
      setInternalDrop(false);
    }
    
    return clearAllTimers;
  }, [isStraining]);

  return (
    <div className="w-full h-full relative">
      {/* Top Left HUD */}
      {giverName && (
        <div className="absolute top-1 left-2 z-50 animate-fade-in">
          <div className="bg-[#5a3a2a] border-2 border-white px-3 py-1 shadow-[2px_2px_0_0_rgba(0,0,0,0.2)] flex flex-col gap-0.5">
             <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-[#f2cc50] animate-pulse"></div>
               <p className="text-white text-[10px] font-black uppercase tracking-tighter opacity-70">Current Player</p>
             </div>
             <p className="text-white text-lg font-black tracking-widest whitespace-nowrap leading-tight">
                <span className="text-[#f2cc50]">{giverName}</span>
             </p>
          </div>
        </div>
      )}

      {/* Pixel Clouds */}
      <div className="absolute top-16 left-24 opacity-60 animate-[bounce_4s_infinite]">
        <PixelCloud />
      </div>
      <div className="absolute top-20 right-16 opacity-40 animate-[bounce_5s_infinite_reverse]">
        <PixelCloud />
      </div>
      
      {/* High Wooden Tower */}
      <div className="absolute top-[120px] left-1/2 -translate-x-1/2 z-10">
        <div className="w-32 h-6 bg-[#a66c3c] border-4 border-[#5a3a2a] relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-white/20"></div>
        </div>
        <div className="flex justify-around px-4">
          <div className="w-4 h-[340px] bg-[#8a5d34] border-x-4 border-[#5a3a2a]"></div>
          <div className="w-4 h-[340px] bg-[#8a5d34] border-x-4 border-[#5a3a2a]"></div>
        </div>
      </div>

      {/* The Dog Wrapper */}
      <div 
        className="absolute top-[52px] left-1/2 -translate-x-[32px] z-20"
        style={{ transformOrigin: 'center bottom' }}
      >
        <div className={isStraining ? 'animate-pixel-shake' : ''}>
          <PixelDog isStraining={isStraining} />
        </div>
      </div>

      {/* The Poop */}
      {internalDrop && !showResult && (
        <div className="absolute top-[125px] left-1/2 -translate-x-[64px] z-30 animate-pixel-fall">
          <PixelPoop />
        </div>
      )}

      {/* Rich Gifts Pile at Bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-80 h-40 flex items-end justify-center z-40">
        <div className="absolute bottom-8 left-4 rotate-[-15deg]">
          <PixelGift color="#5faad9" ribbon="#ffffff" size="small" />
        </div>
        <div className="absolute bottom-10 left-20 rotate-[10deg]">
          <PixelGift color="#9cdb43" ribbon="#ffffff" size="small" />
        </div>
        <div className="absolute bottom-8 right-16 rotate-[-5deg]">
          <PixelGift color="#e082c3" ribbon="#ffffff" size="small" />
        </div>
        <div className="absolute bottom-6 right-2 rotate-[20deg]">
          <PixelGift color="#f28d35" ribbon="#ffffff" size="small" />
        </div>
        <div className="absolute bottom-2 left-8 rotate-[-8deg] z-10">
          <PixelGift color="#e65c5c" ribbon="#ffffff" />
        </div>
        <div className="absolute bottom-4 left-24 rotate-[5deg] z-10">
          <PixelGift color="#6495ed" ribbon="#ffffff" />
        </div>
        <div className="absolute bottom-2 right-12 rotate-[-12deg] z-10">
          <PixelGift color="#9c64ed" ribbon="#ffffff" />
        </div>
        <div className="absolute bottom-3 right-0 rotate-[15deg] z-10">
          <PixelGift color="#71aa34" ribbon="#ffffff" />
        </div>
        <div className="absolute bottom-0 left-16 rotate-[-3deg] z-20">
          <PixelGift color="#d95f5f" ribbon="#ffffff" />
        </div>
        <div className="absolute bottom-0 right-16 rotate-[4deg] z-20">
          <PixelGift color="#5f86d9" ribbon="#ffffff" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rotate-[-1deg] z-20">
          <PixelGift color="#a66c3c" ribbon="#ffffff" />
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-[64px] z-[100]">
          <PixelGift 
            color="#f2cc50" 
            ribbon="#e65c5c" 
            isTarget={showResult} 
            shouldFall={showResult} 
          />
        </div>
      </div>

      {/* Result Indicator Splash */}
      {showResult && (
        <div className="absolute inset-0 flex items-center justify-center z-[150] bg-black/20 animate-fade-in backdrop-blur-[1px]">
          <div className="bg-white border-8 border-[#71aa34] p-6 shadow-[0_0_0_8px_#5a3a2a] animate-bounce flex flex-col items-center">
             <p className="text-[#8a6b4a] text-lg font-black mb-2 uppercase tracking-widest">抽中礼物啦！</p>
             <div className="flex items-center gap-4">
               <div className="w-12 h-12">
                 <PixelGift color="#f2cc50" ribbon="#e65c5c" />
               </div>
               <p className="text-5xl font-black text-[#5a3a2a]">{receiverName}</p>
             </div>
             <p className="mt-4 text-[#71aa34] font-black text-xl text-center">
               恭喜 {giverName} 找到了要守护的人
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

const PixelDog: React.FC<{ isStraining: boolean }> = ({ isStraining }) => (
  <div className="relative w-24 h-20">
    <svg width="96" height="80" viewBox="0 0 24 20" className="w-full h-full" shapeRendering="crispEdges">
      <rect x="4" y="8" width="10" height="8" fill="#ffffff" />
      <rect x="2" y="9" width="2" height="2" fill="#ffffff" />
      <rect x="5" y="16" width="2" height="2" fill="#eeeeee" />
      <rect x="11" y="16" width="2" height="2" fill="#eeeeee" />
      <rect x="11" y="3" width="10" height="10" fill="#ffffff" />
      <rect x="10" y="3" width="3" height="6" fill="#fccb00" />
      <rect x="19" y="3" width="3" height="6" fill="#fccb00" />
      <rect x="10" y="8" width="2" height="2" fill="#fccb00" />
      <rect x="20" y="8" width="2" height="2" fill="#fccb00" />
      <rect x="13" y="10" width="1" height="1" fill="#ffb7c5" opacity="0.8" />
      <rect x="18" y="10" width="1" height="1" fill="#ffb7c5" opacity="0.8" />
      {isStraining ? (
        <>
          <rect x="14" y="7" width="1" height="1" fill="#000" />
          <rect x="17" y="7" width="1" height="1" fill="#000" />
          <rect x="15" y="10" width="2" height="1" fill="#000" />
        </>
      ) : (
        <>
          <rect x="14" y="7" width="1" height="2" fill="#000" />
          <rect x="17" y="7" width="1" height="2" fill="#000" />
          <rect x="15" y="11" width="2" height="1" fill="#ff9999" />
        </>
      )}
      <rect x="15.5" y="9" width="1" height="1" fill="#000" />
    </svg>
    {isStraining && (
       <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 text-center font-black text-orange-400 animate-bounce text-2xl tracking-tighter drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
          快拉出来了！
       </div>
    )}
  </div>
);

const PixelPoop = () => (
  <svg width="24" height="24" viewBox="0 0 8 8" shapeRendering="crispEdges">
    <rect x="3" y="1" width="2" height="1" fill="#6d4c41" />
    <rect x="2" y="2" width="4" height="1" fill="#6d4c41" />
    <rect x="1" y="3" width="6" height="1" fill="#6d4c41" />
    <rect x="1" y="4" width="6" height="1" fill="#6d4c41" />
    <rect x="0" y="5" width="8" height="2" fill="#6d4c41" />
    <rect x="1" y="2" width="1" height="1" fill="rgba(255,255,255,0.1)" />
  </svg>
);

const PixelGift: React.FC<{ color: string; ribbon: string; isTarget?: boolean; shouldFall?: boolean; size?: 'normal' | 'small' }> = ({ color, ribbon, isTarget, shouldFall, size = 'normal' }) => {
  const baseSizeClass = size === 'small' ? 'w-10 h-10' : 'w-14 h-14';
  let animationClass = shouldFall ? 'animate-gift-drop' : '';
  const targetClass = isTarget ? 'z-[100]' : '';
  
  return (
    <div className={`${baseSizeClass} relative transition-all duration-300 shadow-md ${targetClass} ${animationClass}`}>
      <svg width="100%" height="100%" viewBox="0 0 14 14" className="w-full h-full" shapeRendering="crispEdges">
        <rect x="1" y="4" width="12" height="9" fill={color} />
        <rect x="1" y="4" width="12" height="2" fill="rgba(255,255,255,0.2)" />
        <rect x="6" y="4" width="2" height="9" fill={ribbon} />
        <rect x="0" y="3" width="14" height="3" fill={color} />
        <rect x="6" y="3" width="2" height="3" fill={ribbon} />
        <rect x="4" y="1" width="6" height="2" fill={ribbon} />
        <rect x="6" y="2" width="2" height="1" fill="rgba(0,0,0,0.1)" />
      </svg>
    </div>
  );
};

const PixelCloud = () => (
  <svg width="60" height="40" viewBox="0 0 15 10" shapeRendering="crispEdges">
    <rect x="3" y="2" width="9" height="5" fill="white" />
    <rect x="2" y="4" width="11" height="3" fill="white" />
    <rect x="5" y="1" width="5" height="1" fill="white" />
    <rect x="4" y="7" width="7" height="1" fill="white" />
  </svg>
);

export default DogStage;
