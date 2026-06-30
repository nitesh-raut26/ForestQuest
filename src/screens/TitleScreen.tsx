import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HillShape from '../components/HillShape';
import RadialOrb from '../components/RadialOrb';
import { FONT } from '../theme/fonts';

const { width: W, height: H } = Dimensions.get('window');

const FALLBACK_FIREFLIES = [
  { x: 22, y: 60, dur: 5, delay: 0 }, { x: 70, y: 48, dur: 6.4, delay: 0.6 },
  { x: 42, y: 70, dur: 5.6, delay: 1.2 }, { x: 84, y: 64, dur: 6, delay: 0.3 },
  { x: 14, y: 74, dur: 5.2, delay: 1.6 }, { x: 60, y: 80, dur: 6.8, delay: 0.9 },
  { x: 34, y: 54, dur: 5.9, delay: 2 },
];

function Firefly({ x, y, dur, delay }: { x: number; y: number; dur: number; delay: number }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: (dur * 1000) / 2, delay: delay * 1000, useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: (dur * 1000) / 2, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View
      style={[
        styles.firefly,
        {
          left: `${x}%` as unknown as number,
          top: `${y}%` as unknown as number,
          opacity: t.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] }),
          transform: [
            { translateY: t.interpolate({ inputRange: [0, 1], outputRange: [0, -22] }) },
            { translateX: t.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }) },
          ],
        },
      ]}
    />
  );
}

interface Props { vals?: Record<string, any>; onBegin: () => void }

export default function TitleScreen({ vals, onBegin }: Props) {
  const insets = useSafeAreaInsets();
  const ring = useRef(new Animated.Value(0)).current;
  const fireflies = vals?.fireflies || FALLBACK_FIREFLIES;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(ring, { toValue: 1, duration: 1300, useNativeDriver: true }),
        Animated.timing(ring, { toValue: 0, duration: 1300, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <LinearGradient
      colors={['#FCE3A0', '#F7C16B', '#E89B5A', '#C9794A']}
      locations={[0, 0.38, 0.7, 1]}
      style={styles.container}
    >
      {/* Hills — match web template's radial-gradient domes */}
      <HillShape
        width={W + 200} height={H * 0.46} domeRatio={0.22} cx={0.5}
        colors={['#7BC67E', '#5a9c5f', '#3f6f47']}
        style={[styles.hillBack, { left: -100 }]}
      />
      <HillShape
        width={W * 1.2} height={H * 0.3} domeRatio={0.3} cx={0.4}
        colors={['#6fb673', '#4d8a53']} opacity={0.9}
        style={[styles.hillFront, { left: -W * 0.1 }]}
      />

      {/* Sun */}
      <RadialOrb size={74} glow="#FFF6DA" body="#FFE09A" cx={0.5} cy={0.5} style={styles.sun} />

      {/* Fireflies */}
      {fireflies.map((f: any, i: number) => <Firefly key={i} {...f} />)}

      {/* Title content — vertically centered in the full screen, matching web's justify-content:center */}
      <View style={styles.content} pointerEvents="none">
        <Text style={styles.tagline}>A Magical Living World</Text>
        <View>
          {/* Solid-color text-shadow layer (CSS: 0 4px 0 #C9794A) */}
          <Text style={[styles.title, styles.titleShadow]}>Forest{'\n'}Quest</Text>
          <Text style={styles.title}>Forest{'\n'}Quest</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.subtitle}>
          Explore eleven living biomes and solve 110 puzzles with six creature friends who grow alongside you.
        </Text>
      </View>

      {/* CTA — pinned to bottom:74px, matching web template */}
      <View style={[styles.cta, { bottom: Math.max(insets.bottom, 0) + 74 }]}>
        <View>
          <Animated.View
            pointerEvents="none"
            style={[styles.pulseRing, {
              opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
              transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) }],
            }]}
          />
          <TouchableOpacity onPress={onBegin} activeOpacity={0.88}>
            <LinearGradient colors={['#5EA862', '#3f7d47']} style={styles.beginBtn}>
              <Text style={styles.beginText}>Begin Adventure</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <Text style={styles.version}>v1.0  ·  Ages 4–12  ·  Story prototype</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hillBack: { position: 'absolute', bottom: 0 },
  hillFront: { position: 'absolute', bottom: 0 },
  sun: {
    position: 'absolute', top: '14%' as unknown as number, left: '18%' as unknown as number,
    shadowColor: '#FFE09A', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 30, elevation: 10,
  },
  firefly: {
    position: 'absolute', width: 7, height: 7, borderRadius: 4,
    backgroundColor: '#FFF3C4',
    shadowColor: '#FFF3C4', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 6, elevation: 4,
  },
  // Matches web: position:absolute; inset:0; display:flex; align-items:center; justify-content:center
  content: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36,
  },
  tagline: {
    fontFamily: FONT.baloo.medium, fontSize: 14, letterSpacing: 6, color: '#7a4a23',
    textTransform: 'uppercase', opacity: 0.85, marginBottom: 6,
  },
  title: {
    fontFamily: FONT.baloo.extrabold, fontSize: 64, lineHeight: 59, color: '#fff',
    textAlign: 'center', marginBottom: 4,
    textShadowColor: 'rgba(90,40,15,0.4)', textShadowOffset: { width: 0, height: 14 }, textShadowRadius: 24,
  },
  // Solid #C9794A offset shadow — CSS: text-shadow: 0 4px 0 #C9794A
  titleShadow: {
    position: 'absolute', color: '#C9794A',
    transform: [{ translateY: 4 }],
    textShadowColor: 'transparent', textShadowRadius: 0,
  },
  divider: { marginTop: 14, width: 54, height: 4, borderRadius: 3, backgroundColor: '#fff', opacity: 0.7 },
  subtitle: {
    marginTop: 22, fontFamily: FONT.nunito.semibold, fontSize: 15, color: '#fff', opacity: 0.95,
    maxWidth: 280, textAlign: 'center', lineHeight: 21,
    textShadowColor: 'rgba(90,40,15,0.35)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6,
  },
  // Matches web: position:absolute; bottom:74px; left:0; right:0; align-items:center
  cta: { position: 'absolute', left: 0, right: 0, alignItems: 'center', gap: 14, paddingHorizontal: 40 },
  pulseRing: {
    position: 'absolute', inset: 0 as unknown as undefined, borderRadius: 40,
    borderWidth: 6, borderColor: 'rgba(245,166,35,0.5)',
  },
  beginBtn: {
    width: W - 80, maxWidth: 280,
    borderRadius: 40, paddingVertical: 18, alignItems: 'center',
    shadowColor: '#2f5e36', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 1, shadowRadius: 0, elevation: 8,
  },
  beginText: { fontFamily: FONT.baloo.bold, color: '#fff', fontSize: 19 },
  version: { fontFamily: FONT.nunito.bold, fontSize: 12, color: '#7a4a23', opacity: 0.7 },
});
