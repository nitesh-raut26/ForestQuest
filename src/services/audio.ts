// Audio service using expo-audio v2 (SDK 53+).
// Generates synthesized WAV tones programmatically via base64 data URIs.
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

let muted = false;
let _audioConfigured = false;

export function setMuted(on: boolean): void { muted = on; }

async function ensureAudio(): Promise<void> {
  if (_audioConfigured) return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });
    _audioConfigured = true;
  } catch { /* ignore */ }
}

// ── Tone generator ────────────────────────────────────────────────────────────
// Builds a tiny WAV file in memory and returns it as a base64 data URI so we
// can play it without any asset files.
function buildWav(freq: number, durationMs: number, gain = 0.12): string {
  const sampleRate = 22050;
  const n = Math.floor(sampleRate * durationMs / 1000);
  const buf = new ArrayBuffer(44 + n * 2);
  const dv = new DataView(buf);

  const str = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) dv.setUint8(off + i, s.charCodeAt(i));
  };
  str(0, 'RIFF'); dv.setUint32(4, 36 + n * 2, true);
  str(8, 'WAVE'); str(12, 'fmt ');
  dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
  dv.setUint32(24, sampleRate, true); dv.setUint32(28, sampleRate * 2, true);
  dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
  str(36, 'data'); dv.setUint32(40, n * 2, true);

  for (let i = 0; i < n; i++) {
    const t = i / sampleRate;
    const fadeIn = Math.min(1, t / 0.01);
    const fadeOut = Math.min(1, (durationMs / 1000 - t) / 0.03);
    const env = fadeIn * fadeOut;
    const sample = Math.sin(2 * Math.PI * freq * t) * gain * env * 32767;
    dv.setInt16(44 + i * 2, Math.max(-32768, Math.min(32767, sample | 0)), true);
  }

  let b = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) b += String.fromCharCode(bytes[i]);
  return 'data:audio/wav;base64,' + btoa(b);
}

async function playTone(freq: number, durationMs: number, gain = 0.12): Promise<void> {
  if (muted) return;
  try {
    await ensureAudio();
    const uri = buildWav(freq, durationMs, gain);
    const player = createAudioPlayer({ uri });
    player.play();
    // Release player shortly after tone ends
    setTimeout(() => {
      try { player.remove(); } catch { /* ignore */ }
    }, durationMs + 400);
  } catch { /* silently ignore audio errors */ }
}

// ── Public SFX API ─────────────────────────────────────────────────────────────
const RECALL_FREQS = [392, 494, 587, 698, 330, 440];

export function sfxTap():     void { playTone(420, 80, 0.05); }
export function sfxSelect():  void { playTone(560, 70, 0.05); }
export function sfxSolve():   void {
  [523.25, 659.25, 783.99].forEach((f, i) => setTimeout(() => playTone(f, 160, 0.09), i * 90));
}
export function sfxReward():  void {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => playTone(f, 220, 0.1), i * 80));
}
export function sfxUnlock():  void {
  [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => playTone(f, 600, 0.08), i * 70));
  playTone(196, 500, 0.06);
}
export function sfxRecallTone(i: number): void {
  playTone(RECALL_FREQS[i % RECALL_FREQS.length], 340, 0.18);
}
export function primeAudio(): void {
  ensureAudio().catch(() => {});
}
