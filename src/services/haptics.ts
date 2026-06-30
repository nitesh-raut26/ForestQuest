// Haptic feedback using expo-haptics (React Native replacement for Capacitor/vibrate)
import * as Haptics from 'expo-haptics';

let enabled = true;

export function setHapticsEnabled(on: boolean): void {
  enabled = on;
}

export function hImpact(style: 'light' | 'medium' | 'heavy' = 'light'): void {
  if (!enabled) return;
  const map = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  };
  Haptics.impactAsync(map[style]).catch(() => {});
}

export function hSelection(): void {
  if (!enabled) return;
  Haptics.selectionAsync().catch(() => {});
}

export function hSuccess(): void {
  if (!enabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function hUnlock(): void {
  if (!enabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
