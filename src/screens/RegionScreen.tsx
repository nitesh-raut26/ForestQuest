import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CharacterArt from '../components/CharacterArt';
import GameIcon from '../components/GameIcon';
import { FONT } from '../theme/fonts';

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
  const { width, height } = useWindowDimensions();
  const compact = height < 560 || width > height;
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
  const travel = useRef(new Animated.Value(ep)).current;
  const travelHop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(travel, {
        toValue: ep,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(travelHop, { toValue: -24, duration: 240, useNativeDriver: true }),
        Animated.timing(travelHop, { toValue: 0, duration: 280, easing: Easing.bounce, useNativeDriver: true }),
      ]),
    ]).start();
  }, [ep]);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[sky, primary, ground]} locations={[0, 0.64, 1]} style={StyleSheet.absoluteFill} />

      {/* Parallax far hills */}
      <View style={[styles.farLayer, { transform: [{ translateX: -farX }] }]}>
        <View style={[styles.farHill, { backgroundColor: primary, left: '6%', width: 160, height: 120 }]} />
        <View style={[styles.farHill, { backgroundColor: primary, left: '46%', width: 200, height: 150 }]} />
        <View style={[styles.farHill, { backgroundColor: primary, left: '84%', width: 170, height: 130 }]} />
      </View>
      <View style={styles.horizonMist} />
      {/* Parallax mid trees */}
      <View style={[styles.midLayer, { transform: [{ translateX: -midX }] }]}>
        <View style={[styles.treeTrunk, { left: '19%', height: 104 }]} />
        <View style={[styles.midTree, { backgroundColor: ground, left: '7%', width: 76, height: 112 }]} />
        <View style={[styles.treeTrunk, { left: '52%', height: 124 }]} />
        <View style={[styles.midTree, { backgroundColor: ground, left: '39%', width: 94, height: 142 }]} />
        <View style={[styles.treeTrunk, { left: '87%', height: 110 }]} />
        <View style={[styles.midTree, { backgroundColor: ground, left: '74%', width: 86, height: 130 }]} />
      </View>

      {/* Ground band */}
      <LinearGradient colors={[ground, groundDark]} style={styles.groundBand} />
      <View style={styles.trailOuter}>
        <LinearGradient colors={['rgba(255,232,181,0.8)', 'rgba(124,91,61,0.72)']} style={styles.trailInner} />
      </View>
      <View style={[styles.groundLine, { transform: [{ translateX: -nearX }] }]} />
      <View style={[styles.foregroundRock, { left: -24, bottom: '10%', backgroundColor: groundDark }]} />
      <View style={[styles.foregroundRock, { right: -42, bottom: '4%', backgroundColor: groundDark, width: 155, height: 78 }]} />

      {/* Collectible */}
      {vals.showCollectible && (
        <Animated.View style={[styles.collectible, { left: `${vals.collectibleLeft}%`, transform: [{ translateY: collectibleBob }] }]}>
          <View style={[styles.collectibleGem, { backgroundColor: accent }]}>
            <GameIcon kind="stardust" size={25} color="#fff" secondary="#FFF6C4" />
          </View>
        </Animated.View>
      )}

      {/* Puzzle marker */}
      <View style={[styles.marker, { left: `${vals.markerLeft}%`, transform: [{ translateX: '-50%' as unknown as number }] }]}>
        <Text style={styles.markerLabel} numberOfLines={1}>{vals.markerPuzzleName}</Text>
        <View style={[styles.markerBase, { backgroundColor: groundDark }]} />
        <LinearGradient colors={[accent, secondary]} style={styles.markerOrb}>
          <GameIcon kind={cr.puzzleType || 'shape'} size={35} color="#fff" secondary={groundDark} />
        </LinearGradient>
      </View>

      {/* Avatar + guide */}
      <Animated.View style={[styles.figures, {
        transform: [
          { translateX: travel.interpolate({ inputRange: [0, 100], outputRange: [0, width * 0.38] }) },
          { translateY: travelHop },
        ],
      }]}>
        <Animated.View style={{ transform: [{ translateY: avatarBob }] }}>
          <View style={styles.characterShadow} />
          <CharacterArt id="ari" size={92} />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateY: guideBob }] }}>
          <View style={[styles.characterGlow, { backgroundColor: gc.glow || '#FFC58C' }]} />
          <CharacterArt name={gc.name} size={72} style={styles.guideArt} />
        </Animated.View>
      </Animated.View>

      {/* Speech bubble */}
      <View style={[styles.bubble, compact && styles.bubbleCompact]}>
        <Text style={[styles.bubbleName, { color: gc.body || '#E8822F' }]}>{gc.name}</Text>
        <Text style={styles.bubbleText}>{vals.avatarLine}</Text>
      </View>

      {/* Top bar */}
      <View style={[styles.topBar, compact && styles.topBarCompact]}>
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
      <View style={[styles.progressTrack, compact && styles.progressTrackCompact]}>
        <LinearGradient colors={[secondary, '#fff']} style={[styles.progressFill, { width: `${ep}%` }]} />
      </View>

      {/* Move button */}
      <View style={[styles.actions, compact && styles.actionsCompact]}>
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
  horizonMist: { position: 'absolute', left: 0, right: 0, bottom: '38%', height: 76, backgroundColor: 'rgba(255,255,255,0.13)', borderRadius: 999 },
  midLayer: { position: 'absolute', left: 0, right: 0, bottom: '24%', height: '30%', opacity: 0.72 },
  treeTrunk: { position: 'absolute', bottom: 0, width: 18, borderRadius: 9, backgroundColor: '#6a4c36' },
  midTree: { position: 'absolute', bottom: 56, borderRadius: 999, opacity: 0.95 },
  groundBand: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '26%' },
  trailOuter: {
    position: 'absolute', left: '10%', right: '-18%', bottom: '-2%', height: '30%',
    borderTopLeftRadius: 999, borderTopRightRadius: 999, overflow: 'hidden',
    transform: [{ perspective: 700 }, { rotateX: '55deg' }, { rotateZ: '-4deg' }],
  },
  trailInner: { flex: 1, opacity: 0.72 },
  groundLine: { position: 'absolute', left: 0, right: 0, bottom: '24%', height: 5, backgroundColor: 'rgba(255,255,255,0.25)' },
  foregroundRock: { position: 'absolute', width: 120, height: 62, borderRadius: 999, opacity: 0.84 },
  collectible: { position: 'absolute', bottom: '30%' },
  collectibleGem: {
    width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '8deg' }], borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#FFF3C4', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 14, elevation: 8,
  },
  marker: { position: 'absolute', bottom: '27%', alignItems: 'center', gap: 6 },
  markerLabel: {
    fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#fff',
    backgroundColor: 'rgba(40,30,20,0.4)', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10,
  },
  markerBase: {
    position: 'absolute', bottom: -8, width: 64, height: 27, borderRadius: 32, opacity: 0.9,
  },
  markerOrb: {
    width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: 'rgba(245,166,35,0.6)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 16, elevation: 8,
  },
  figures: { position: 'absolute', left: '5%', bottom: '23%', flexDirection: 'row', alignItems: 'flex-end', gap: 0, zIndex: 3 },
  characterShadow: {
    position: 'absolute', left: 24, bottom: 3, width: 44, height: 13, borderRadius: 22,
    backgroundColor: 'rgba(30,25,20,0.34)',
  },
  characterGlow: {
    position: 'absolute', left: 14, top: 18, width: 44, height: 44, borderRadius: 22, opacity: 0.8,
    shadowColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 4,
  },
  guideArt: { marginLeft: -6, marginBottom: 2 },
  bubble: {
    position: 'absolute', left: '16%', bottom: '46%', maxWidth: 230,
    backgroundColor: '#fff8ef', borderRadius: 18, borderBottomLeftRadius: 4, padding: 12,
    shadowColor: '#28201a', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  bubbleCompact: { left: '35%', bottom: '33%', maxWidth: 310 },
  bubbleName: { fontFamily: FONT.nunito.extrabold, fontSize: 11 },
  bubbleText: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#3a2a1c', lineHeight: 17, marginTop: 1 },
  topBar: { position: 'absolute', top: 50, left: 18, right: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  topBarCompact: { top: 10 },
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
  progressTrackCompact: { top: 64 },
  progressFill: { height: '100%', borderRadius: 5 },
  actions: { position: 'absolute', bottom: 34, left: 0, right: 0, alignItems: 'center' },
  actionsCompact: { bottom: 14, alignItems: 'flex-end', paddingRight: 24 },
  exploreBtn: {
    paddingVertical: 16, paddingHorizontal: 44, borderRadius: 36,
    shadowColor: '#b56a0c', shadowOffset: { width: 0, height: 9 }, shadowOpacity: 1, shadowRadius: 0, elevation: 8,
  },
  exploreBtnText: { fontFamily: FONT.baloo.bold, fontSize: 18, color: '#fff' },
});
