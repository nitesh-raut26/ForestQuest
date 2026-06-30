// Shared types for the TypeScript layer around the verbatim (JS) game logic.

/** A region as defined in the game logic's `regions` array. */
export interface Region {
  id: string;
  num: number;
  name: string;
  guide: string;
  difficulty: string;
  unlock: string;
  unlocked: boolean;
  /** 2D map coordinates (0–100), reused to seed 3D island placement. */
  x: number;
  y: number;
  pct: number;
  sky: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  ground: string;
  groundDark: string;
  dark: boolean;
  desc: string;
  biome: string;
  puzzleType: string;
  puzzleName: string;
  boss: string;
  [key: string]: unknown;
}

/** The mutable game state (only the fields our TS layer reads/persists). */
export interface GameState {
  screen: string;
  acorns: number;
  glowDust: number;
  xp: number;
  rank: number;
  bonds: Record<string, number>;
  unlocked: Record<string, boolean>;
  currentRegion: string;
  riOpen: boolean;
  riRegion: string | null;
  puzzlesSolved: number;
  minutesPlayed: number;
  dailyClaimed: number | null;
  dailyShown: boolean;
  skills: Record<string, number>;
  quests: unknown[];
  gifts: Record<string, boolean>;
  eventDone: Record<string, boolean>;
  eventOwned: Record<string, boolean>;
  decorOwned?: Record<string, boolean>;
  decorPlaced?: Record<string, boolean>;
  rainPearls: number;
  finaleSeen?: boolean;
  toast: string | null;
  [key: string]: unknown;
}

/** The surface of the verbatim `Component` logic class our app interacts with. */
export interface GameLogic {
  props: Record<string, unknown>;
  state: GameState;
  regions: Region[];
  creatures: Record<string, Record<string, unknown>>;
  setState(patch: Partial<GameState> | ((s: GameState) => Partial<GameState>), cb?: () => void): void;
  forceUpdate(): void;
  renderVals(): Record<string, unknown>;
  componentDidMount(): void;
  componentWillUnmount(): void;
  tapRegion(id: string): void;
  enterRegion(id: string): void;
  go(screen: string): void;
  /** Injected by App to bridge setState -> React re-render. */
  __schedule?: (cb?: () => void) => void;
  [key: string]: unknown;
}

/** The persisted save payload (a whitelist of GameState fields). */
export interface SaveData {
  v: number;
  acorns: number;
  glowDust: number;
  xp: number;
  rank: number;
  bonds: Record<string, number>;
  unlocked: Record<string, boolean>;
  puzzlesSolved: number;
  minutesPlayed: number;
  dailyClaimed: number | null;
  dailyShown: boolean;
  skills: Record<string, number>;
  quests: unknown[];
  gifts: Record<string, boolean>;
  eventDone: Record<string, boolean>;
  eventOwned: Record<string, boolean>;
  decorOwned?: Record<string, boolean>;
  decorPlaced?: Record<string, boolean>;
  rainPearls: number;
  finaleSeen?: boolean;
  savedAt: number;
}
