
import React, { useState, useEffect } from 'react';
import { Participant, DrawingResult, GameStage } from './types';
import DogStage from './components/DogStage';
import { Plus, Trash2, Volume2, VolumeX } from 'lucide-react';
import { sounds } from './utils/sounds';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newName, setNewName] = useState('');
  const [gameStage, setGameStage] = useState<GameStage>(GameStage.SETUP);
  const [results, setResults] = useState<DrawingResult[]>([]);
  const [currentGiverIndex, setCurrentGiverIndex] = useState(0);
  const [lastDrawnReceiver, setLastDrawnReceiver] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    sounds.setEnabled(!isMuted);
  }, [isMuted]);

  const generateAssignments = (list: Participant[]): DrawingResult[] => {
    const names = list.map(p => p.name);
    let shuffled = [...names];
    let isValid = false;
    let attempts = 0;

    while (!isValid && attempts < 1000) {
      shuffled.sort(() => Math.random() - 0.5);
      isValid = shuffled.every((name, i) => name !== names[i]);
      attempts++;
    }

    if (!isValid) return [];

    return names.map((giver, i) => ({
      giver,
      receiver: shuffled[i]
    }));
  };

  const addParticipant = () => {
    if (newName.trim()) {
      setParticipants([...participants, { id: Date.now().toString(), name: newName.trim() }]);
      setNewName('');
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const startGame = () => {
    if (participants.length < 2) {
      alert('至少需要2个人才能玩守护天使哦！');
      return;
    }
    const assignments = generateAssignments(participants);
    setResults(assignments);
    setGameStage(GameStage.READY_TO_DRAW);
    setCurrentGiverIndex(0);
  };

  const nextTurn = () => {
    setGameStage(GameStage.DRAWING_ANIMATION);
    
    // 动画期间周期性播放“发力”声
    const strainInterval = setInterval(() => {
      sounds.playStrain();
    }, 600);

    setTimeout(() => {
      clearInterval(strainInterval);
      setGameStage(GameStage.REVEAL);
      setLastDrawnReceiver(results[currentGiverIndex].receiver);
      sounds.playReveal(); // 揭晓结果声
    }, 4500); 
  };

  const confirmDraw = () => {
    if (currentGiverIndex < participants.length - 1) {
      setCurrentGiverIndex(currentGiverIndex + 1);
      setGameStage(GameStage.READY_TO_DRAW);
      setLastDrawnReceiver(null);
    } else {
      setGameStage(GameStage.FINISHED);
    }
  };

  const resetGame = () => {
    setParticipants([]);
    setResults([]);
    setGameStage(GameStage.SETUP);
    setCurrentGiverIndex(0);
    setLastDrawnReceiver(null);
  };

  const currentGiver = results[currentGiverIndex]?.giver || "";

  return (
    <div className="min-h-screen flex flex-col items-center py-4 px-4 overflow-hidden relative">
      {/* Sound Toggle Overlay */}
      <button 
        onClick={() => setIsMuted(!isMuted)}
        className="fixed top-4 right-4 z-[200] p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors border-2 border-white/40"
      >
        {isMuted ? <VolumeX size={24} className="text-white" /> : <Volume2 size={24} className="text-white" />}
      </button>

      {/* Header */}
      <header className="text-center mb-4">
        <div className="relative inline-block">
          <h1 className="text-5xl font-black text-white drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)] flex items-center justify-center gap-4 tracking-tight">
            圣诞狗屎运
          </h1>
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-white opacity-40"></div>
        </div>
        <p className="text-white mt-3 text-xl font-bold drop-shadow-md">
           命运的直肠开始蠕动，敬请期待。
        </p>
      </header>

      <main className="w-full max-w-5xl bg-[#e6b98a] border-8 border-[#5a3a2a] rounded-xl shadow-[0_12px_0_0_#3a2115] overflow-hidden flex flex-col lg:flex-row h-[78vh] min-h-[500px]">
        
        {/* Left Control Panel */}
        <div className="flex-1 p-6 bg-[#fdf5e6] border-r-8 border-[#5a3a2a] flex flex-col">
          {gameStage === GameStage.SETUP && (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex items-center gap-2 border-b-4 border-[#5a3a2a] pb-2">
                <h2 className="text-3xl font-black text-[#5a3a2a] tracking-wider">参加活动的朋友</h2>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                  placeholder="输入名字..."
                  className="flex-1 px-4 py-2 bg-white border-4 border-[#5a3a2a] outline-none text-2xl focus:bg-yellow-50"
                />
                <button
                  onClick={addParticipant}
                  className="pixel-btn bg-[#71aa34] hover:bg-[#5e8d2b]"
                >
                  <Plus size={32} />
                </button>
              </div>

              <div className="bg-[#f2d8b1] p-4 border-4 border-[#5a3a2a] flex-1 overflow-y-auto">
                {participants.length === 0 ? (
                  <p className="text-center text-[#8a6b4a] py-8 text-2xl">等待添加名单...</p>
                ) : (
                  <ul className="grid grid-cols-1 gap-2">
                    {participants.map((p) => (
                      <li key={p.id} className="flex items-center justify-between bg-white/60 p-3 border-2 border-[#5a3a2a] group hover:bg-white transition-colors">
                        <span className="text-3xl font-bold tracking-wide">{p.name}</span>
                        <button
                          onClick={() => removeParticipant(p.id)}
                          className="text-[#5a3a2a] opacity-40 group-hover:opacity-100 hover:text-red-700 transition-opacity"
                        >
                          <Trash2 size={24} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {participants.length >= 2 && (
                <button
                  onClick={startGame}
                  className="w-full pixel-btn bg-[#e65c5c] hover:bg-[#c44b4b] text-3xl py-4 flex items-center justify-center gap-4 shadow-[0_6px_0_0_#803434] mt-auto"
                >
                  准备抽签
                </button>
              )}
            </div>
          )}

          {(gameStage === GameStage.READY_TO_DRAW || gameStage === GameStage.DRAWING_ANIMATION || gameStage === GameStage.REVEAL) && (
            <div className="text-center space-y-6 py-2 flex flex-col flex-1 justify-center">
              <div className="bg-[#f2d8b1] p-6 border-8 border-[#5a3a2a] shadow-inner relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#5a3a2a] rotate-45"></div>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#5a3a2a] rotate-45"></div>
                <p className="text-[#8a6b4a] text-xl font-black mb-2">现在轮到</p>
                <p className="text-7xl font-black text-[#5a3a2a] tracking-widest leading-none">
                  {currentGiver}
                </p>
                <p className="text-[#8a6b4a] text-xl font-black mt-4">抽签了！</p>
              </div>

              {gameStage === GameStage.READY_TO_DRAW && (
                <div className="space-y-4">
                  <button
                    onClick={nextTurn}
                    className="w-full pixel-btn bg-[#6495ed] hover:bg-[#4a76c0] text-3xl py-8 shadow-[0_6px_0_0_#2b4a7a]"
                  >
                    开始拉屎...
                  </button>
                </div>
              )}

              {gameStage === GameStage.DRAWING_ANIMATION && (
                <div className="animate-pulse flex flex-col items-center gap-4 py-6">
                  <div className="flex gap-2">
                    <div className="w-5 h-5 bg-[#a66c3c] border-4 border-[#5a3a2a] animate-bounce delay-75"></div>
                    <div className="w-5 h-5 bg-[#a66c3c] border-4 border-[#5a3a2a] animate-bounce delay-150"></div>
                    <div className="w-5 h-5 bg-[#a66c3c] border-4 border-[#5a3a2a] animate-bounce delay-225"></div>
                  </div>
                  <p className="text-3xl font-black text-[#a66c3c]">小狗正在为你寻找中...</p>
                </div>
              )}

              {gameStage === GameStage.REVEAL && (
                <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                  <div className="p-6 bg-white border-8 border-[#71aa34] shadow-[0_0_20px_rgba(113,170,52,0.4)]">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl font-black text-[#8a6b4a]">{currentGiver} 的</span>
                      <span className="text-3xl font-black text-[#71aa34]">守护对象是</span>
                      <span className="text-8xl font-black text-[#5a3a2a] tracking-tight leading-none py-4">
                        {lastDrawnReceiver}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={confirmDraw}
                    className="w-full pixel-btn bg-[#5a3a2a] text-white py-6 text-2xl flex items-center justify-center gap-4"
                  >
                    记住了 下一位
                  </button>
                </div>
              )}
            </div>
          )}

          {gameStage === GameStage.FINISHED && (
            <div className="text-center py-6 space-y-6 flex flex-col flex-1 justify-center">
              <div className="bg-white p-10 border-8 border-[#71aa34] border-dashed shadow-xl">
                <h2 className="text-5xl font-black text-[#71aa34] mb-6 leading-none">抽签全部完成</h2>
                <p className="text-2xl text-[#5a3a2a] font-bold">
                  所有人都已经找到了要守护的对象
                </p>
              </div>
              <button
                onClick={resetGame}
                className="pixel-btn bg-[#8a6b4a] text-white py-6 px-12 text-2xl flex items-center justify-center gap-4 mx-auto"
              >
                重新开始活动
              </button>
            </div>
          )}
        </div>

        {/* Right Animated Scene */}
        <div className="flex-[1.2] relative bg-[#9cdb43] overflow-hidden">
          <div className="absolute inset-0 bg-[#add8e6] h-[300px]"></div>
          <div className="absolute top-[280px] inset-0 bg-[#71aa34]"></div>
          <div className="absolute top-[300px] left-0 right-0 h-10 bg-[#e6b98a] border-y-4 border-[#5a3a2a] opacity-30"></div>
          
          <DogStage 
            isStraining={gameStage === GameStage.DRAWING_ANIMATION} 
            showResult={gameStage === GameStage.REVEAL}
            giverName={currentGiver}
            receiverName={lastDrawnReceiver}
          />
        </div>
      </main>

    </div>
  );
};

export default App;
