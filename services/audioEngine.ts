
import { noteValueMap, chordOffsetMap } from '../constants.ts';

class AudioEngineClass {
  private ctx: AudioContext | null = null;
  private readonly TUNING_FREQ_A4 = 440;

  private init() {
    if (typeof window !== 'undefined') {
      const AudioContextCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.ctx && AudioContextCtor) {
        this.ctx = new AudioContextCtor();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }
  }

  private playFreq(frequency: number, startTime: number, duration = 0.5) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  public play(note: string, octave = 4) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    const noteBase = note.replace(/[0-9]/g, '');
    const noteIndex = noteValueMap[noteBase];

    if (noteIndex === undefined) return;

    const midiNode = (octave + 1) * 12 + noteIndex;
    const frequency = this.TUNING_FREQ_A4 * Math.pow(2, (midiNode - 69) / 12);

    this.playFreq(frequency, this.ctx.currentTime);
  }

  public playChord(rootNote: string, chordType: string) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    const offsets = chordOffsetMap[chordType] || [0, 4, 7];
    const rootBase = rootNote.replace(/[0-9]/g, '');
    const rootIndex = noteValueMap[rootBase];
    if (rootIndex === undefined) return;

    const baseOctave = 4;
    const rootMidi = (baseOctave + 1) * 12 + rootIndex;
    const now = this.ctx.currentTime;

    offsets.forEach((offset, index) => {
      const noteMidi = rootMidi + offset;
      const frequency = this.TUNING_FREQ_A4 * Math.pow(2, (noteMidi - 69) / 12);
      this.playFreq(frequency, now + (index * 0.1), 0.6);
    });
  }
}

export const AudioEngine = new AudioEngineClass();
