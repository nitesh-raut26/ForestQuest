import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RadialOrb from '../components/RadialOrb';
import { FONT } from '../theme/fonts';

const { width: W } = Dimensions.get('window');

function useBob(duration: number, delay = 0) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: duration / 2, delay, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0, duration: duration / 2, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return v.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });
}

interface Props { vals: Record<string, any> }

export default function RegionScreen({ vals }: Props) {
  const cr = vals.cr || {};
  const gc = vals.gc || {};
  const ep: number = vals.exploreProgress || 0;
  const farX = vals.farX || 0;
  const midX = vals.midX || 0;
  const nearX = vals.nearX || 0;

  const sky = cr.sky || '#cfe7d6';
  const primary = cr.primary || '#5EA862';
  const secondary = cr.secondary || '#F5A623';
  const accent = cr.accent || '#FFE9A8';
  const ground = cr.ground || '#5a9c5f';
  const groundDark = cr.groundDark || '#3f6f47';

  const avatarBob = useBob(1100);
  const guideBob = useBob(1300, 200);
  const collectibleBob = useBob(1600);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[sky, primary, ground]} locations={[0, 0.64, 1]} style={StyleSheet.absoluteFill} />

      {/* Parallax far hills */}
      <View style={[styles.farLayer, { transform: [{ translateX: -farX }] }]}>
        <View style={[styles.farHill, { backgroundColor: primary, left: '6%', width: 160, height: 120 }]} />
        <View style={[styles.farHill, { backgroundColor: primary, left: '46%', width: 200, height: 150 }]} />
        <View style={[styles.farHill, { backgroundColor: primary, left: '84%', width: 170, height: 130 }]} />
      </View>
      {/* Parallax mid trees */}
      <View style={[styles.midLayer, { transform: [{ translateX: -midX }] }]}>
        <View style={[styles.midTree, { backgroundColor: ground, left: '14%', width: 64, height: 140 }]} />
        <View style={[styles.midTree, { backgroundColor: ground, left: '40%', width: 80, height: 170 }]} />
        <View style={[styles.midTree, { backgroundColor: ground, left: '70%', width: 70, height: 150 }]} />
        <View style={[styles.midTree, { backgroundColor: ground, left: '96%', width: 80, height: 165 }]} />
      </View>

      {/* Ground band */}
      <LinearGradient colors={[ground, groundDark]} style={styles.groundBand} />
      <View style={[styles.groundLine, { transform: [{ translateX: -nearX }] }]} />

      {/* Collectible */}
      {vals.showCollectible && (
        <Animated.View style={[styles.collectible, { left: `${vals.collectibleLeft}%`, transform: [{ translateY: collectibleBob }] }]}>
          <RadialOrb size={30} glow="#FFF3C4" body={accent} />
        </Animated.View>
      )}

      {/* Puzzle marker */}
      <View style={[styles.marker, { left: `${vals.markerLeft}%`, transform: [{ translateX: '-50%' as unknown as number }] }]}>
        <Text style={styles.markerLabel} numberOfLines={1}>{vals.markerPuzzleName}</Text>
        <RadialOrb size={56} glow="#fff" body={secondary} style={styles.markerOrb}>
          <View style={styles.markerDiamond} />
        </RadialOrb>
      </View>

      {/* Avatar + guide */}
      <View style={styles.figures}>
        <Animated.View style={[styles.avatarBody, { transform: [{ translateY: avatarBob }] }]}>
          <View style={[styles.eye, { left: 9 }]} />
          <View style={[styles.eye, { left: 20 }]} />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateY: guideBob }] }}>
          <RadialOrb size={40} glow={gc.glow || '#FFC58C'} body={gc.body || '#E8822F'} style={styles.guideShadow} />
        </Animated.View>
      </View>

      {/* Speech bubble */}
      <View style={styles.bubble}>
        <Text style={[styles.bubbleName, { color: gc.body || '#E8822F' }]}>{gc.name}</Text>
        <Text style={styles.bubbleText}>{vals.avatarLine}</Text>
      </View>

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backCircle} onPress={vals.goMap} activeOpacity={0.85}>
          <Text style={styles.backCircleText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.namePill}>
          <Text style={styles.regionName}>{cr.name}</Text>
          <Text style={styles.regionMeta}>Guide: {gc.name} · {cr.difficulty}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <LinearGradient colors={[secondary, '#fff']} style={[styles.progressFill, { width: `${ep}%` }]} />
      </View>

      {/* Move button */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={vals.move} activeOpacity={0.88}>
          <LinearGradient colors={['#F5A623', '#dd8512']} style={styles.exploreBtn}>
            <Text style={styles.exploreBtnText}>{vals.moveLabel || 'Explore'} →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  farLayer: { position: 'absolute', left: 0, right: 0, bottom: '30%', height: '36%', opacity: 0.5 },
  farHill: { position: 'absolute', bottom: 0, borderTopLeftRadius: 999, borderTopRightRadius: 999 },
  midLayer: { position: 'absolute', left: 0, right: 0, bottom: '24%', height: '30%', opacity: 0.72 },
  midTree: { position: 'absolute', bottom: 0, borderTopLeftRadius: 999, borderTopRightRadius: 999 },
  groundBand: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '26%' },
  groundLine: { position: 'absolute', left: 0, right: 0, bottom: '24%', height: 5, backgroundColor: 'rgba(255,255,255,0.25)' },
  collectible: { position: 'absolute', bottom: '30%' },
  marker: { position: 'absolute', bottom: '27%', alignItems: 'center', gap: 6 },
  markerLabel: {
    fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#fff',
    backgroundColor: 'rgba(40,30,20,0.4)', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10,
  },
  markerOrb: { shadowColor: 'rgba(245,166,35,0.6)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 16, elevation: 8 },
  markerDiamond: { width: 22, height: 22, borderRadius: 6, backgroundColor: '#fff', transform: [{ rotate: '45deg' }] },
  figures: { position: 'absolute', left: '14%', bottom: '27%', flexDirection: 'row', alignItems: 'flex-end', gap: 22 },
  avatarBody: {
    width: 34, height: 42, borderRadius: 18, borderBottomLeftRadius: 14, borderBottomRightRadius: 14,
    backgroundColor: '#fff8ef',
    shadowColor: '#28201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 6,
  },
  eye: { position: 'absolute', top: 13, width: 5, height: 6, borderRadius: 3, backgroundColor: '#3a2a1c' },
  guideShadow: { shadowColor: '#28201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 6 },
  bubble: {
    position: 'absolute', left: '16%', bottom: '46%', maxWidth: 230,
    backgroundColor: '#fff8ef', borderRadius: 18, borderBottomLeftRadius: 4, padding: 12,
    shadowColor: '#28201a', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  bubbleName: { fontFamily: FONT.nunito.extrabold, fontSize: 11 },
  bubbleText: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#3a2a1c', lineHeight: 17, marginTop: 1 },
  topBar: { position: 'absolute', top: 50, left: 18, right: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backCircle: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,248,239,0.85)', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#28201a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  backCircleText: { fontFamily: FONT.baloo.extrabold, fontSize: 18, color: '#3a2a1c' },
  namePill: {
    backgroundColor: 'rgba(255,248,239,0.85)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 7, alignItems: 'center',
    shadowColor: '#28201a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  regionName: { fontFamily: FONT.baloo.bold, fontSize: 15, color: '#3a2a1c' },
  regionMeta: { fontFamily: FONT.nunito.bold, fontSize: 10, color: '#9a8a76' },
  progressTrack: {
    position: 'absolute', top: 104, left: 18, right: 18, height: 8, borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.4)', overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 5 },
  actions: { position: 'absolute', bottom: 34, left: 0, right: 0, alignItems: 'center' },
  exploreBtn: {
    paddingVertical: 16, paddingHorizontal: 44, borderRadius: 36,
    shadowColor: '#b56a0c', shadowOffset: { width: 0, height: 9 }, shadowOpacity: 1, shadowRadius: 0, elevation: 8,
  },
  exploreBtnText: { fontFamily: FONT.baloo.bold, fontSize: 18, color: '#fff' },
});
