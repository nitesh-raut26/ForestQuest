// Progress persistence using AsyncStorage (React Native replacement for localStorage).
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GameLogic, GameState, SaveData } from '../engine/types';

const KEY = 'forestquest.save.v1';
const SAVE_VERSION = 1;

const PERSIST_KEYS: (keyof SaveData)[] = [
  'acorns', 'glowDust', 'xp', 'rank', 'bonds', 'unlocked', 'puzzlesSolved',
  'minutesPlayed', 'dailyClaimed', 'dailyShown', 'skills', 'quests', 'gifts',
  'eventDone', 'eventOwned', 'rainPearls', 'finaleSeen',
];

function snapshot(state: GameState): SaveData {
  const out: Record<string, unknown> = { v: SAVE_VERSION, savedAt: Date.now() };
  const src = state as Record<string, unknown>;
  for (const k of PERSIST_KEYS) {
    if (k in state) out[k] = src[k];
  }
  return out as unknown as SaveData;
}

let writeTimer: ReturnType<typeof setTimeout> | null = null;
let lastJson = '';

export async function loadSave(): Promise<SaveData | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as SaveData;
    if (!data || data.v !== SAVE_VERSION) return null;
    return data;
  } catch {
    return null;
  }
}

export function saveState(state: GameState): void {
  const json = JSON.stringify(snapshot(state));
  if (json === lastJson) return;
  lastJson = json;
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(async () => {
    try { await AsyncStorage.setItem(KEY, json); } catch { /* quota */ }
  }, 400);
}

export function applySave(logic: GameLogic, data: SaveData): void {
  const s = logic.state;
  for (const k of PERSIST_KEYS) {
    if (k in data && data[k as keyof SaveData] !== undefined) {
      (s as Record<string, unknown>)[k] = data[k as keyof SaveData];
    }
  }
  if (data.unlocked && Array.isArray(logic.regions)) {
    for (const r of logic.regions) r.unlocked = !!data.unlocked[r.id];
  }
  s.screen = 'map';
  s.dailyShown = true;
}

export async function clearSave(): Promise<void> {
  lastJson = '';
  try { await AsyncStorage.removeItem(KEY); } catch { /* ignore */ }
}
