import { isFeatureEnabled } from '../featureFlags';

export type SoundType =
  | 'click'
  | 'tab_switch'
  | 'stat_up'
  | 'stat_down'
  | 'coin'
  | 'danger'
  | 'promotion'
  | 'quarter_advance'
  | 'modal_open'
  | 'modal_close'
  | 'game_over'
  | 'achievement';

const LS_ENABLED = 'audio_enabled';
const LS_VOLUME = 'audio_volume';

function readBool(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    return v === 'true';
  } catch {
    return fallback;
  }
}

function readVolume(key: string, fallback: number): number {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    const n = Number.parseFloat(v);
    if (!Number.isFinite(n)) return fallback;
    return Math.min(1, Math.max(0, n));
  } catch {
    return fallback;
  }
}

type BusListener = (sound: SoundType) => void;
const gameAudioListeners = new Set<BusListener>();

export const gameAudioBus = {
  emit(sound: SoundType): void {
    for (const fn of gameAudioListeners) fn(sound);
  },
  subscribe(fn: BusListener): () => void {
    gameAudioListeners.add(fn);
    return () => gameAudioListeners.delete(fn);
  },
};

function getAudioCtor(): typeof AudioContext {
  return window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
}

class AudioManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean;
  private volume: number;

  constructor() {
    this.enabled = readBool(LS_ENABLED, true);
    this.volume = readVolume(LS_VOLUME, 1);
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (getAudioCtor())();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private masterGain(ctx: AudioContext): GainNode {
    const g = ctx.createGain();
    g.gain.value = this.volume;
    g.connect(ctx.destination);
    return g;
  }

  play(sound: SoundType): void {
    if (!isFeatureEnabled('enableAudio') || !this.enabled) return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime;
    const master = this.masterGain(ctx);

    switch (sound) {
      case 'click':
        this.playClick(ctx, master, now);
        break;
      case 'tab_switch':
        this.playTabSwitch(ctx, master, now);
        break;
      case 'stat_up':
        this.playStatUp(ctx, master, now);
        break;
      case 'stat_down':
        this.playStatDown(ctx, master, now);
        break;
      case 'coin':
        this.playCoin(ctx, master, now);
        break;
      case 'danger':
        this.playDanger(ctx, master, now);
        break;
      case 'promotion':
        this.playPromotion(ctx, master, now);
        break;
      case 'quarter_advance':
        this.playQuarterAdvance(ctx, master, now);
        break;
      case 'modal_open':
        this.playModalOpen(ctx, master, now);
        break;
      case 'modal_close':
        this.playModalClose(ctx, master, now);
        break;
      case 'game_over':
        this.playGameOver(ctx, master, now);
        break;
      case 'achievement':
        this.playAchievement(ctx, master, now);
        break;
      default:
        break;
    }
  }

  private playClick(ctx: AudioContext, master: GainNode, t0: number): void {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(2000, t0);
    g.gain.setValueAtTime(0.12, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.05);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.052);
  }

  private playTabSwitch(ctx: AudioContext, master: GainNode, t0: number): void {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t0);
    osc.frequency.linearRampToValueAtTime(1200, t0 + 0.1);
    g.gain.setValueAtTime(0.06, t0);
    g.gain.linearRampToValueAtTime(0.0001, t0 + 0.1);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.102);
  }

  private playStatUp(ctx: AudioContext, master: GainNode, t0: number): void {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t0);
    osc.frequency.exponentialRampToValueAtTime(880, t0 + 0.15);
    g.gain.setValueAtTime(0.07, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.15);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.152);
  }

  private playStatDown(ctx: AudioContext, master: GainNode, t0: number): void {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t0);
    osc.frequency.exponentialRampToValueAtTime(220, t0 + 0.15);
    g.gain.setValueAtTime(0.08, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.15);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.152);
  }

  private playCoin(ctx: AudioContext, master: GainNode, t0: number): void {
    const dur = 0.2;
    const freqs = [1200, 1500];
    for (const f of freqs) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t0);
      g.gain.setValueAtTime(0.05, t0);
      g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
      osc.connect(g);
      g.connect(master);
      osc.start(t0);
      osc.stop(t0 + dur + 0.01);
    }
  }

  private playDanger(ctx: AudioContext, master: GainNode, t0: number): void {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, t0);
    g.gain.setValueAtTime(0.14, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.3);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.302);
  }

  private playPromotion(ctx: AudioContext, master: GainNode, t0: number): void {
    const notes = [523, 659, 784];
    let t = t0;
    for (const f of notes) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0008, t + 0.15);
      osc.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 0.152);
      t += 0.15;
    }
  }

  private playQuarterAdvance(ctx: AudioContext, master: GainNode, t0: number): void {
    const dur = 0.2;
    const samples = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, samples, ctx.sampleRate);
    const ch = buffer.getChannelData(0);
    for (let i = 0; i < samples; i++) ch[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2800, t0);
    filter.Q.setValueAtTime(0.7, t0);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.09, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(master);
    src.start(t0);
    src.stop(t0 + dur + 0.01);
  }

  private playModalOpen(ctx: AudioContext, master: GainNode, t0: number): void {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t0);
    osc.frequency.exponentialRampToValueAtTime(600, t0 + 0.15);
    g.gain.setValueAtTime(0.07, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.15);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.152);
  }

  private playModalClose(ctx: AudioContext, master: GainNode, t0: number): void {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, t0);
    osc.frequency.exponentialRampToValueAtTime(300, t0 + 0.1);
    g.gain.setValueAtTime(0.06, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.1);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.102);
  }

  private playGameOver(ctx: AudioContext, master: GainNode, t0: number): void {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t0);
    osc.frequency.exponentialRampToValueAtTime(110, t0 + 0.8);
    g.gain.setValueAtTime(0.1, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.8);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.802);
  }

  private playAchievement(ctx: AudioContext, master: GainNode, t0: number): void {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t0);
    osc.frequency.exponentialRampToValueAtTime(1760, t0 + 0.3);
    g.gain.setValueAtTime(0.08, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.3);
    osc.connect(g);
    g.connect(master);
    osc.start(t0);
    osc.stop(t0 + 0.302);
  }

  setEnabled(v: boolean): void {
    this.enabled = v;
    try {
      localStorage.setItem(LS_ENABLED, v ? 'true' : 'false');
    } catch {
      /* ignore */
    }
  }

  setVolume(v: number): void {
    this.volume = Math.min(1, Math.max(0, v));
    try {
      localStorage.setItem(LS_VOLUME, String(this.volume));
    } catch {
      /* ignore */
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }
}

export const audioManager = new AudioManager();

gameAudioBus.subscribe((sound) => {
  audioManager.play(sound);
});
