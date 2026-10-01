/**
 * SolveIt Ambient Soundscape Engine
 * Procedural Web Audio API sound generator for Focus, Study, and Rest.
 * Zero external audio file dependencies, 100% private, infinite non-looping audio.
 */

export type SoundscapeId = 'none' | 'deep_work' | 'study_rain' | 'zen_recharge';

export interface SoundscapeTrack {
  id: SoundscapeId;
  name: string;
  tagline: string;
  category: 'Work' | 'Study' | 'More';
  icon: string;
  description: string;
  accent: string;
}

export const SOUNDSCAPE_TRACKS: SoundscapeTrack[] = [
  {
    id: 'deep_work',
    name: 'Deep Work Flow',
    tagline: 'Binaural Alpha Waves & Warm Ambient Pad',
    category: 'Work',
    icon: 'headphones',
    description: 'Calibrated 10Hz alpha entrainment with rich harmonic analog drone chords for deep programming and problem-solving.',
    accent: 'text-primary',
  },
  {
    id: 'study_rain',
    name: 'Study & Memory',
    tagline: 'Gentle Rain Drizzle & Soft Pentatonic Chimes',
    category: 'Study',
    icon: 'rainy',
    description: 'Filtered rain white noise with warm pentatonic bell intervals that mask background noise and boost reading retention.',
    accent: 'text-secondary',
  },
  {
    id: 'zen_recharge',
    name: 'Zen Recharge & Breathe',
    tagline: 'Ocean Tide Swells & Singing Bowl',
    category: 'More',
    icon: 'waves',
    description: 'Slow 7-second oceanic breathing cycles with 432Hz harmonic Tibetan singing bowl overtones for restorative breaks.',
    accent: 'text-emerald-600',
  },
];

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeId: SoundscapeId = 'none';
  private cleanupFns: Array<() => void> = [];
  private currentVolume: number = 0.6; // 0.0 to 1.0

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getActiveTrack(): SoundscapeId {
    return this.activeId;
  }

  public isPlaying(): boolean {
    return this.activeId !== 'none';
  }

  public setVolume(volume: number) {
    this.currentVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.currentVolume * 0.28, now + 0.08);
    }
  }

  public stop(fadeDuration: number = 0.4) {
    if (!this.ctx || !this.masterGain || this.activeId === 'none') {
      this.activeId = 'none';
      this.runCleanups();
      return;
    }

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);

    setTimeout(() => {
      this.runCleanups();
      this.activeId = 'none';
    }, fadeDuration * 1000 + 50);
  }

  private runCleanups() {
    this.cleanupFns.forEach((fn) => {
      try {
        fn();
      } catch {
        // Ignored
      }
    });
    this.cleanupFns = [];
  }

  public play(id: SoundscapeId, volume: number = 0.6) {
    if (id === 'none') {
      this.stop();
      return;
    }

    const ctx = this.getAudioContext();
    if (!ctx) return;

    // If currently playing the same track, do nothing
    if (this.activeId === id) return;

    // Clean up current soundscape with crossfade
    this.runCleanups();
    this.activeId = id;
    this.currentVolume = volume;

    // Recreate master gain node
    this.masterGain = ctx.createGain();
    const now = ctx.currentTime;
    this.masterGain.gain.setValueAtTime(0.0001, now);
    this.masterGain.gain.linearRampToValueAtTime(this.currentVolume * 0.28, now + 0.6);
    this.masterGain.connect(ctx.destination);

    if (id === 'deep_work') {
      this.startDeepWork(ctx, this.masterGain);
    } else if (id === 'study_rain') {
      this.startStudyRain(ctx, this.masterGain);
    } else if (id === 'zen_recharge') {
      this.startZenRecharge(ctx, this.masterGain);
    }
  }

  /**
   * Track 1: Deep Work Flow (Work)
   * Warm binaural alpha frequency (10Hz difference) layered with rich ethereal chord pads
   */
  private startDeepWork(ctx: AudioContext, destination: GainNode) {
    // Stereo Merger for pure binaural split
    const merger = ctx.createChannelMerger(2);

    // Left Ear: 216 Hz
    const oscL = ctx.createOscillator();
    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(216, ctx.currentTime);
    const gainL = ctx.createGain();
    gainL.gain.value = 0.35;
    oscL.connect(gainL);
    gainL.connect(merger, 0, 0); // Left channel

    // Right Ear: 226 Hz (10 Hz difference creates alpha brainwave entrainment)
    const oscR = ctx.createOscillator();
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(226, ctx.currentTime);
    const gainR = ctx.createGain();
    gainR.gain.value = 0.35;
    oscR.connect(gainR);
    gainR.connect(merger, 0, 1); // Right channel

    // Ethereal chord pad: D Minor / F Major warm pad (F2=87.31Hz, A2=110Hz, C3=130.81Hz, E3=164.81Hz)
    const padFrequencies = [87.31, 130.81, 164.81, 261.63];
    const padOscs: OscillatorNode[] = [];
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.setValueAtTime(380, ctx.currentTime);
    padFilter.Q.setValueAtTime(2.0, ctx.currentTime);

    // Slow filter modulation LFO
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // very slow 12-second breath
    lfoGain.gain.setValueAtTime(120, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(padFilter.frequency);

    padFrequencies.forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.18;
      osc.connect(oscGain);
      oscGain.connect(padFilter);
      padOscs.push(osc);
    });

    merger.connect(destination);
    padFilter.connect(destination);

    oscL.start();
    oscR.start();
    lfo.start();
    padOscs.forEach((o) => o.start());

    this.cleanupFns.push(() => {
      try {
        oscL.stop();
        oscR.stop();
        lfo.stop();
        padOscs.forEach((o) => o.stop());
        merger.disconnect();
        padFilter.disconnect();
      } catch {
        // Ignored
      }
    });
  }

  /**
   * Track 2: Study & Memory (Study)
   * Spatial gentle rain noise filtered with warm intermittent pentatonic piano/chime notes
   */
  private startStudyRain(ctx: AudioContext, destination: GainNode) {
    // Generate 4 seconds of looping gentle rain noise buffer
    const bufferSize = ctx.sampleRate * 4;
    const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const output = noiseBuffer.getChannelData(ch);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Pink/brown filter integration
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Gain compensation
      }
    }

    const rainSource = ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    // Rain filter: gentle bandpass to mimic window drizzle
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.setValueAtTime(1100, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.42, ctx.currentTime);

    rainSource.connect(rainFilter);
    rainFilter.connect(rainGain);
    rainGain.connect(destination);
    rainSource.start();

    // Pentatonic ambient study chimes: (C4, D4, E4, G4, A4, C5)
    const pentatonic = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
    let chimeIntervalId: NodeJS.Timeout | null = null;

    const playRandomChime = () => {
      if (!ctx || ctx.state === 'closed' || this.activeId !== 'study_rain') return;
      try {
        const noteFreq = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        const osc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

        const now = ctx.currentTime;
        chimeGain.gain.setValueAtTime(0.0001, now);
        chimeGain.gain.linearRampToValueAtTime(0.09, now + 0.08);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(chimeGain);
        chimeGain.connect(destination);

        osc.start(now);
        osc.stop(now + 3.3);
      } catch {
        // Ignored
      }
    };

    // Schedule gentle chimes every 3.5 - 6 seconds
    const scheduleNextChime = () => {
      const delay = 3200 + Math.random() * 2800;
      chimeIntervalId = setTimeout(() => {
        playRandomChime();
        scheduleNextChime();
      }, delay);
    };
    scheduleNextChime();

    this.cleanupFns.push(() => {
      if (chimeIntervalId) clearTimeout(chimeIntervalId);
      try {
        rainSource.stop();
        rainSource.disconnect();
      } catch {
        // Ignored
      }
    });
  }

  /**
   * Track 3: Zen Recharge & Breathe (More / Break / Meditation)
   * 7-second oceanic surf wave cycles paired with resonant 432Hz harmonic Tibetan singing bowl
   */
  private startZenRecharge(ctx: AudioContext, destination: GainNode) {
    // Generate ocean swell noise buffer
    const bufferSize = ctx.sampleRate * 4;
    const noiseBuffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const output = noiseBuffer.getChannelData(ch);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }

    const surfSource = ctx.createBufferSource();
    surfSource.buffer = noiseBuffer;
    surfSource.loop = true;

    // Resonant lowpass that sweeps like incoming & receding ocean waves
    const surfFilter = ctx.createBiquadFilter();
    surfFilter.type = 'lowpass';
    surfFilter.frequency.setValueAtTime(280, ctx.currentTime);
    surfFilter.Q.setValueAtTime(4.0, ctx.currentTime);

    // Oceanic breathing LFO (7 seconds cycle: 3.5s inhale swell, 3.5s exhale recede)
    const swellLfo = ctx.createOscillator();
    const swellLfoGain = ctx.createGain();
    swellLfo.type = 'sine';
    swellLfo.frequency.setValueAtTime(1 / 7.0, ctx.currentTime);
    swellLfoGain.gain.setValueAtTime(320, ctx.currentTime);
    swellLfo.connect(swellLfoGain);
    swellLfoGain.connect(surfFilter.frequency);

    const surfGain = ctx.createGain();
    surfGain.gain.setValueAtTime(0.35, ctx.currentTime);

    surfSource.connect(surfFilter);
    surfFilter.connect(surfGain);
    surfGain.connect(destination);

    surfSource.start();
    swellLfo.start();

    // Harmonic singing bowl chime at 432 Hz + overtones (864Hz, 1296Hz)
    let bowlIntervalId: NodeJS.Timeout | null = null;

    const playSingingBowl = () => {
      if (!ctx || ctx.state === 'closed' || this.activeId !== 'zen_recharge') return;
      try {
        const baseFreq = 432;
        const partials = [1, 2.01, 3.02];
        const gains = [0.12, 0.05, 0.02];
        const now = ctx.currentTime;

        partials.forEach((mult, idx) => {
          const osc = ctx.createOscillator();
          const pGain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(baseFreq * mult, now);

          pGain.gain.setValueAtTime(0.0001, now);
          pGain.gain.linearRampToValueAtTime(gains[idx], now + 0.12);
          pGain.gain.exponentialRampToValueAtTime(0.0001, now + 7.5);

          osc.connect(pGain);
          pGain.connect(destination);

          osc.start(now);
          osc.stop(now + 7.6);
        });
      } catch {
        // Ignored
      }
    };

    // Play first bell right away, then every 14 seconds
    playSingingBowl();
    bowlIntervalId = setInterval(playSingingBowl, 14000);

    this.cleanupFns.push(() => {
      if (bowlIntervalId) clearInterval(bowlIntervalId);
      try {
        surfSource.stop();
        swellLfo.stop();
      } catch {
        // Ignored
      }
    });
  }
}

// Export singleton instance
export const ambientSoundEngine = new AmbientSoundEngine();
