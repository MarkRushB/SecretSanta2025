
class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * 酝酿拉屎的声音 (更有节奏的像素挣扎声)
   */
  playStrain() {
    if (!this.enabled) return;
    this.initCtx();
    const ctx = this.ctx!;
    
    const duration = 0.5;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'square';
    
    const startTime = ctx.currentTime;
    const steps = 8;
    for (let i = 0; i < steps; i++) {
      const freq = i % 2 === 0 ? 55 : 35;
      osc.frequency.setValueAtTime(freq, startTime + (i * (duration / steps)));
    }
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  /**
   * 模拟粑粑落地的声音 (改进版：低频冲击 + 瞬间噪声)
   */
  playSplat() {
    if (!this.enabled) return;
    this.initCtx();
    const ctx = this.ctx!;
    const startTime = ctx.currentTime;

    // 1. 低频冲击音
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.2);
    
    gain.gain.setValueAtTime(0.4, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(startTime + 0.2);

    // 2. 瞬间爆裂噪声 (模拟“噗通”一声)
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.1, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
    
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start();
  }

  // 成功/揭晓的 8-bit 琶音
  playReveal() {
    if (!this.enabled) return;
    this.initCtx();
    const ctx = this.ctx!;
    
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const startTime = ctx.currentTime;
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.1);
      
      gain.gain.setValueAtTime(0.1, startTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime + i * 0.1);
      osc.stop(startTime + i * 0.1 + 0.3);
    });
  }
}

export const sounds = new SoundManager();
