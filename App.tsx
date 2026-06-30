import React, { useEffect, useReducer, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Baloo2_500Medium, Baloo2_600SemiBold, Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import {
  Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black,
  Nunito_600SemiBold_Italic,
} from '@expo-google-fonts/nunito';
import { Component } from './src/engine/gameLogic';
import type { GameLogic } from './src/engine/types';
import { loadSave, applySave, saveState } from './src/services/storage';
import { primeAudio, sfxTap, sfxReward, sfxRecallTone } from './src/services/audio';
import { hImpact, hSuccess } from './src/services/haptics';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Screens
import TitleScreen from './src/screens/TitleScreen';
import MapScreen from './src/screens/MapScreen';
import RegionScreen from './src/screens/RegionScreen';
import PuzzleScreen from './src/screens/PuzzleScreen';
import RewardScreen from './src/screens/RewardScreen';
import CreaturesScreen from './src/screens/CreaturesScreen';
import DetailScreen from './src/screens/DetailScreen';
import SanctuaryScreen from './src/screens/SanctuaryScreen';
import JourneyScreen from './src/screens/JourneyScreen';
import BossScreen from './src/screens/BossScreen';
import EventScreen from './src/screens/EventScreen';
import FinaleScreen from './src/screens/FinaleScreen';
import ParentScreen from './src/screens/ParentScreen';
import ToastNotification from './src/components/ToastNotification';
import DailyChest from './src/components/DailyChest';

function createLogic(): GameLogic {
  const logic = new Component({}) as unknown as GameLogic;
  return logic;
}

export default function App() {
  const [version, force] = useReducer((x: number) => x + 1, 0);
  const logicRef = useRef<GameLogic | null>(null);
  const loadedRef = useRef(false);
  const [fontsLoaded] = useFonts({
    Baloo2_500Medium, Baloo2_600SemiBold, Baloo2_700Bold, Baloo2_800ExtraBold,
    Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black,
    Nunito_600SemiBold_Italic,
  });

  // Init logic once
  if (!logicRef.current) {
    const logic = createLogic();
    logic.__schedule = (cb?: () => void) => {
      force();
      if (cb) cb();
    };
    // Hook recall tone to audio service
    (logic as any).__onRecallTone = (i: number) => sfxRecallTone(i);
    logicRef.current = logic;
  }

  const logic = logicRef.current;
  const screen = logic.state.screen;
  const prevScreen = useRef(screen);
  const lastRenderedScreen = useRef(screen);
  const rewardState = logic.state.rw as Record<string, any> | null;
  const mapArrivalFromUnlock =
    screen === 'map' &&
    lastRenderedScreen.current === 'reward' &&
    !!rewardState?.hasUnlock;

  // Load saved game async on mount
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    loadSave().then((save) => {
      if (save) {
        applySave(logic, save);
        force();
      }
    });
    logic.componentDidMount?.();
    return () => logic.componentWillUnmount?.();
  }, []);

  // Persist progress on every state change
  useEffect(() => {
    saveState(logic.state);
  }, [version]);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  // Reward/screen change sfx
  useEffect(() => {
    if (screen !== prevScreen.current) {
      if (screen === 'reward') {
        sfxReward();
        hSuccess();
      }
      prevScreen.current = screen;
    }
  }, [screen]);

  useEffect(() => {
    lastRenderedScreen.current = screen;
  }, [screen]);

  // All hooks above must run unconditionally every render — only bail after them.
  if (!fontsLoaded) return null;

  // Get render values from game logic
  const vals = {
    ...(logic.props || {}),
    ...(logic.renderVals() || {}),
    // Helper navigators
    goMap: () => logic.go('map'),
    goCreatures: () => logic.go('creatures'),
    goJourney: () => logic.go('journey'),
    mapArrivalFromUnlock,
    unlockTargetName: rewardState?.unlockedName || '',
    // renderVals() doesn't bind this one (the template calls it directly) — see ShadowPuzzle.
    shadowRotate: () => (logic as any).shadowRotate?.(),
  } as Record<string, any>;

  const handleButtonPress = () => {
    primeAudio();
    hImpact('light');
    sfxTap();
  };

  function renderScreen() {
    switch (screen) {
      case 'title':    return <TitleScreen vals={vals} onBegin={() => { handleButtonPress(); vals.begin?.(); }} />;
      case 'map':      return <MapScreen vals={vals} />;
      case 'region':   return <RegionScreen vals={vals} />;
      case 'puzzle':   return <PuzzleScreen vals={vals} />;
      case 'reward':   return <RewardScreen vals={vals} />;
      case 'creatures':return <CreaturesScreen vals={vals} />;
      case 'detail':   return <DetailScreen vals={vals} />;
      case 'sanctuary':return <SanctuaryScreen vals={vals} />;
      case 'journey':  return <JourneyScreen vals={vals} />;
      case 'boss':     return <BossScreen vals={vals} />;
      case 'event':    return <EventScreen vals={vals} />;
      case 'finale':   return <FinaleScreen vals={vals} />;
      case 'parent':   return <ParentScreen vals={vals} />;
      default:         return <MapScreen vals={vals} />;
    }
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={styles.container}>
        {renderScreen()}
        <ToastNotification visible={!!vals.toastShow} text={vals.toastText || ''} />
        <DailyChest vals={vals} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a0a3a' },
});
