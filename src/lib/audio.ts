export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgGain: GainNode | null = null;
  private isBgPlaying = false;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.2;
      this.masterGain.connect(this.ctx.destination);

      this.bgGain = this.ctx.createGain();
      this.bgGain.gain.value = 0.05;
      this.bgGain.connect(this.masterGain);
      
      this.startBgMusic();
    }
  }

  private startBgMusic() {
    if (this.isBgPlaying || !this.ctx || !this.bgGain) return;
    this.isBgPlaying = true;
    
    // Play a low frequency drone for background
    const playDrone = () => {
      if (!this.ctx || !this.bgGain) return;
      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = 100 + Math.random() * 50; // Between 100hz and 150hz
      
      env.gain.setValueAtTime(0, this.ctx.currentTime);
      env.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 2);
      env.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 8);
      
      osc.connect(env);
      env.connect(this.bgGain);
      
      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 8);
      
      setTimeout(playDrone, 6000); // Loop with overlap
    };
    
    playDrone();
  }

  playCorrect() {
    this.playTone(600, 'sine', 0.1, 0);
    this.playTone(800, 'sine', 0.15, 0.1);
  }

  playWrong() {
    this.playTone(300, 'square', 0.2, 0);
    this.playTone(250, 'sawtooth', 0.3, 0.1);
  }

  playNextLevel() {
    this.playTone(400, 'sine', 0.1, 0);
    this.playTone(500, 'sine', 0.1, 0.1);
    this.playTone(600, 'sine', 0.1, 0.2);
    this.playTone(800, 'sine', 0.3, 0.3);
  }
  
  playStart() {
    this.playTone(300, 'sine', 0.2, 0);
    this.playTone(600, 'sine', 0.4, 0.2);
  }

  private playTone(freq: number, type: OscillatorType, duration: number, delay: number) {
    if (!this.ctx || !this.masterGain) return;
    
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = freq;
    
    env.gain.setValueAtTime(0, this.ctx.currentTime + delay);
    env.gain.linearRampToValueAtTime(1, this.ctx.currentTime + delay + 0.05);
    env.gain.linearRampToValueAtTime(0, this.ctx.currentTime + delay + duration);
    
    osc.connect(env);
    env.connect(this.masterGain);
    
    osc.start(this.ctx.currentTime + delay);
    osc.stop(this.ctx.currentTime + delay + duration);
  }
}

export const audio = new AudioEngine();
