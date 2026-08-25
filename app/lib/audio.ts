// A tiny brass-ish synthesizer built on the Web Audio API.
//
// One shared AudioContext (created lazily on the first user gesture — browsers
// block audio until then). While "blowing", two detuned sawtooth oscillators
// run through a lowpass filter with a gentle vibrato LFO, shaped by an ADSR
// envelope. Changing the fingering while sustained simply glides the pitch, so
// the note retriggers cleanly without clicks.

let ctx: AudioContext | null = null;

// Persistent nodes for the currently-sustained tone (null when silent).
let osc1: OscillatorNode | null = null;
let osc2: OscillatorNode | null = null;
let filter: BiquadFilterNode | null = null;
let vibrato: OscillatorNode | null = null;
let vibratoGain: GainNode | null = null;
let voiceGain: GainNode | null = null;
let master: GainNode | null = null;

const ATTACK = 0.04;
const RELEASE = 0.12;
const PEAK = 0.22;

function ensureContext(): AudioContext {
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    // Voices feed `master` → compressor → speakers.
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
  }
  return ctx;
}

/** Must be called from a user gesture to unlock audio on all browsers. */
export function initAudio(): void {
  const c = ensureContext();
  if (c.state === "suspended") void c.resume();
}

/** Start (or update) the sustained brass tone at `freq` Hz. */
export function startNote(freq: number): void {
  const c = ensureContext();
  if (c.state === "suspended") void c.resume();
  const now = c.currentTime;

  if (osc1 && osc2 && voiceGain && filter) {
    // Already sounding — glide to the new pitch.
    osc1.frequency.setTargetAtTime(freq, now, 0.02);
    osc2.frequency.setTargetAtTime(freq, now, 0.02);
    filter.frequency.setTargetAtTime(freq * 6, now, 0.05);
    return;
  }

  voiceGain = c.createGain();
  voiceGain.gain.setValueAtTime(0.0001, now);
  voiceGain.gain.exponentialRampToValueAtTime(PEAK, now + ATTACK);

  filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = freq * 6;
  filter.Q.value = 6;

  osc1 = c.createOscillator();
  osc1.type = "sawtooth";
  osc1.frequency.value = freq;

  osc2 = c.createOscillator();
  osc2.type = "sawtooth";
  osc2.frequency.value = freq;
  osc2.detune.value = 6; // slight chorus/beating for warmth

  // Vibrato LFO modulating both oscillators' detune.
  vibrato = c.createOscillator();
  vibrato.frequency.value = 5.2;
  vibratoGain = c.createGain();
  vibratoGain.gain.value = 4;
  vibrato.connect(vibratoGain);
  vibratoGain.connect(osc1.detune);
  vibratoGain.connect(osc2.detune);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(voiceGain);
  voiceGain.connect(master ?? c.destination);

  osc1.start();
  osc2.start();
  vibrato.start();
}

/** Release the sustained tone with a short fade, then tear down its nodes. */
export function stopNote(): void {
  if (!ctx || !voiceGain) return;
  const now = ctx.currentTime;
  const g = voiceGain;
  const o1 = osc1;
  const o2 = osc2;
  const vib = vibrato;

  g.gain.cancelScheduledValues(now);
  g.gain.setValueAtTime(Math.max(g.gain.value, 0.0001), now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + RELEASE);

  const stopAt = now + RELEASE + 0.02;
  o1?.stop(stopAt);
  o2?.stop(stopAt);
  vib?.stop(stopAt);

  osc1 = osc2 = vibrato = null;
  vibratoGain = filter = voiceGain = null;
}
