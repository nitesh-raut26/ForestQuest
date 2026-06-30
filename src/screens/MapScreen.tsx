import React, { useEffect, useRef, useState } from 'react';
// MapScreen component
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Pressable,
  Animated, Easing, useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polyline } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CurrencyPills from '../components/CurrencyPills';
import BottomNav from '../components/BottomNav';
import CharacterArt from '../components/CharacterArt';
import GameIcon from '../components/GameIcon';
import { FONT } from '../theme/fonts';

interface MapNode {
  id: string; num: number; name: string; x: number; y: number;
  color: string; glow: string; locked: boolean; nodeOpacity: number;
  onTap: () => void;
}

interface Challenge {
  type: string; name: string; color: string; colorDark: string;
  tierLabel: string; tierColor: string; tierBg: string;
  locked: boolean; op: string; onPlay: () => void;
}

interface RegionInfo {
  name: string; primary: string; glow: string; desc: string; biome: string;
  guideName: string; difficulty: string; puzzleName: string; boss: string;
  collectibles: string; challengeHeader: string; challenges: Challenge[];
  locked: boolean; unlock: string;
  onEnter: () => void; btnLabel: string; btnA: string; btnB: string; btnShadow: string;
}

interface Props {
  vals: Record<string, any>;
}

function RegionIsland({ node, mapWidth, mapHeight }: { node: MapNode; mapWidth: number; mapHeight: number }) {
  return (
    <TouchableOpacity
      style={[styles.node, {
        left: node.x / 100 * mapWidth - 47,
        top: node.y / 100 * mapHeight - 35,
        opacity: node.nodeOpacity,
      }]}
      onPress={node.onTap}
      activeOpacity={0.82}
      accessibilityRole="button"
      accessibilityLabel={`${node.name}${node.locked ? ', locked' : ', open'}`}
    >
      <View style={styles.island}>
        <View style={styles.islandShadow} />
        <View style={styles.islandRock} />
        <View style={styles.islandSoil} />
        <LinearGradient
          colors={node.locked ? ['#9b9b91', '#6f746d'] : [node.glow, node.color]}
          start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }}
          style={styles.islandTop}
        >
          <GameIcon kind={node.id} size={30} color="#FFFFFF" secondary={node.locked ? '#d4d4cd' : '#FFE98A'} />
        </LinearGradient>
        <View style={[styles.nodeNumber, { backgroundColor: node.locked ? '#565a58' : node.color }]}>
          <Text style={styles.nodeNum}>{node.num}</Text>
        </View>
        {node.locked && (
          <View style={styles.lockBadge}>
            <View style={styles.lockShackle} />
            <View style={styles.lockBody} />
          </View>
        )}
      </View>
      <View style={styles.nodeLabel}>
        <Text style={styles.nodeName} numberOfLines={2}>{node.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

function MapExplorer({
  nodes,
  currentId,
  shouldJump,
  unlockedName,
  mapWidth,
  mapHeight,
}: {
  nodes: MapNode[];
  currentId?: string;
  shouldJump: boolean;
  unlockedName?: string;
  mapWidth: number;
  mapHeight: number;
}) {
  const current = nodes.find((n) => n.id === currentId) || nodes.find((n) => !n.locked) || nodes[0];
  const next = current && nodes.find((n) => n.num === current.num + 1 && !n.locked);
  const destination = shouldJump && next ? next : current;
  const startX = current ? current.x / 100 * mapWidth : 0;
  const startY = current ? current.y / 100 * mapHeight : 0;
  const position = useRef(new Animated.ValueXY({ x: startX, y: startY })).current;
  const hop = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [showArrival, setShowArrival] = useState(false);

  useEffect(() => {
    if (!current || !destination) return;
    position.setValue({ x: startX, y: startY });
    hop.setValue(0);
    scale.setValue(1);
    setShowArrival(false);

    if (!shouldJump || !next) return;

    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: next.x / 100 * mapWidth, y: next.y / 100 * mapHeight },
        duration: 1250,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(hop, { toValue: -72, duration: 560, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(hop, { toValue: 0, duration: 690, easing: Easing.bounce, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.12, duration: 560, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 690, useNativeDriver: true }),
      ]),
    ]).start(({ finished }) => {
      if (finished) setShowArrival(true);
    });
  }, [current?.id, destination?.id, shouldJump, mapWidth, mapHeight]);

  if (!current) return null;

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[styles.mapExplorer, {
          transform: [
            ...position.getTranslateTransform(),
            { translateY: hop },
            { scale },
          ],
        }]}
      >
        <View style={styles.explorerGroundShadow} />
        <CharacterArt id="ari" size={70} />
      </Animated.View>
      {showArrival && (
        <View style={styles.arrivalBubble} pointerEvents="none">
          <View style={styles.arrivalPortrait}>
            <CharacterArt id="ari" size={54} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.arrivalName}>Ari · Trail Guide</Text>
            <Text style={styles.arrivalText}>New path! {unlockedName || next?.name} is open. Let’s leap in!</Text>
          </View>
        </View>
      )}
    </>
  );
}

export default function MapScreen({ vals }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const mapNodes: MapNode[] = vals.mapNodes || [];
  const ri: RegionInfo | null = vals.ri;
  const navItems = vals.navItems || [];
  const arrivalJump = useRef(!!vals.mapArrivalFromUnlock).current;
  const wideLayout = width >= 700 || width > height;
  const mapWidth = Math.min(Math.max(320, width - 32), 720);
  const mapHeight = wideLayout ? Math.min(430, Math.round(mapWidth * 0.65)) : Math.round(mapWidth * 520 / 370);

  // Scale node coordinates to the current orientation.
  const polylinePoints = mapNodes.map(n =>
    `${n.x / 100 * mapWidth},${n.y / 100 * mapHeight}`
  ).join(' ');

  return (
    <LinearGradient colors={['#cfe7d6', '#bfe0d8', '#d8c9e6', '#efe2d0']} locations={[0, 0.3, 0.7, 1]} style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 18, paddingBottom: 90 + insets.bottom }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>The Forest</Text>
            <Text style={styles.sub}>Eleven regions await — tap a glowing node to begin.</Text>
          </View>
          <CurrencyPills acorns={vals.acorns} glowDust={vals.glowDust} onOpenDaily={vals.openDaily} />
        </View>

        {/* Map container */}
          <View style={[styles.mapBox, { width: mapWidth, height: mapHeight }]}>
          <LinearGradient
            colors={['#8bd1da', '#7ebda2', '#7898bd', '#715d8e']}
            locations={[0, 0.36, 0.7, 1]}
            start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.cloud, { width: 112, left: -24, top: 42 }]} />
          <View style={[styles.cloud, { width: 86, right: -10, top: 176, opacity: 0.35 }]} />
          <View style={[styles.mapRidge, { width: 190, height: 92, left: -48, bottom: 34, backgroundColor: '#557f6a' }]} />
          <View style={[styles.mapRidge, { width: 220, height: 118, right: -62, bottom: 168, backgroundColor: '#526c79' }]} />
          <View style={[styles.mapRidge, { width: 165, height: 82, left: 92, top: -28, backgroundColor: '#5c6482' }]} />
          <Svg width={mapWidth} height={mapHeight} style={StyleSheet.absoluteFill}>
            <Polyline points={polylinePoints} fill="none" stroke="rgba(28,61,72,0.35)" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
            <Polyline points={polylinePoints} fill="none" stroke="rgba(231,250,255,0.82)" strokeWidth="3" strokeDasharray="7 8" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>

          {mapNodes.map((n) => <RegionIsland key={n.id} node={n} mapWidth={mapWidth} mapHeight={mapHeight} />)}
          <MapExplorer
            nodes={mapNodes}
            currentId={vals.cr?.id}
            shouldJump={arrivalJump}
            unlockedName={vals.unlockTargetName}
            mapWidth={mapWidth}
            mapHeight={mapHeight}
          />
        </View>

        {/* Season banner + regions-open card */}
        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={vals.openEvent} activeOpacity={0.88} style={{ flex: 1 }}>
            <LinearGradient colors={['#1565C0', '#37474F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.eventCard}>
              <Text style={styles.eventLabel}>Current Season ›</Text>
              <Text style={styles.eventTitle}>Monsoon Magic</Text>
              <Text style={styles.eventSub}>Tap to play · 14-day event</Text>
            </LinearGradient>
          </TouchableOpacity>
          <View style={[styles.regionsCard, { flex: 1 }]}>
            <Text style={styles.regionsLabel}>Regions Open</Text>
            <Text style={styles.regionsValue}>{vals.regionsOpen} of 11</Text>
            <Text style={styles.regionsSub}>Solve a puzzle to open the next</Text>
          </View>
        </View>
      </ScrollView>

      {/* Region Info Sheet */}
      <Modal visible={!!vals.riOpen} transparent animationType="slide" onRequestClose={vals.closeRi}>
        <Pressable style={styles.overlay} onPress={vals.closeRi} />
        {ri && (
          <View style={[styles.sheet, { maxHeight: height * 0.86 }]}>
            <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <View style={[styles.sheetIcon, { backgroundColor: ri.glow }]}>
                  <CharacterArt name={ri.guideName} size={72} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>{ri.name}</Text>
                  <Text style={styles.sheetSub}>Guide: {ri.guideName} · {ri.difficulty}</Text>
                  {ri.locked && <Text style={styles.sheetLock}>🔒 Unlock: {ri.unlock}</Text>}
                </View>
              </View>
              <Text style={styles.sheetDesc}>{ri.desc}</Text>

              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>BIOME</Text>
                <Text style={styles.infoValue}>{ri.biome}</Text>
              </View>
              <View style={styles.infoRow}>
                <View style={[styles.infoCard, { flex: 1, backgroundColor: '#eef3ec' }]}>
                  <Text style={[styles.infoLabel, { color: '#3f7d47' }]}>PUZZLE</Text>
                  <Text style={styles.infoValue}>{ri.puzzleName}</Text>
                </View>
                <View style={[styles.infoCard, { flex: 1, backgroundColor: '#f3eef6' }]}>
                  <Text style={[styles.infoLabel, { color: '#9B59B6' }]}>BOSS</Text>
                  <Text style={styles.infoValue}>{ri.boss}</Text>
                </View>
              </View>
              <View style={styles.infoCard}>
                <Text style={styles.infoLabel}>COLLECTIBLES</Text>
                <Text style={styles.infoValue}>{ri.collectibles}</Text>
              </View>

              <Text style={styles.challengeHeader}>{ri.challengeHeader}</Text>
              <View style={styles.challengeGrid}>
                {(ri.challenges || []).map((ch, i) => (
                  <TouchableOpacity
                    key={i} onPress={ch.onPlay} disabled={ch.locked} activeOpacity={0.8}
                    style={[styles.challengeBtn, { backgroundColor: ch.tierBg, borderLeftColor: ch.tierColor, opacity: parseFloat(ch.op) }]}
                  >
                    <LinearGradient colors={[ch.color, ch.colorDark]} style={styles.challengeIcon}>
                      <GameIcon kind={ch.type} size={23} color="#fff" secondary="#FFE98A" />
                    </LinearGradient>
                    <Text style={styles.challengeName} numberOfLines={2}>{ch.name}</Text>
                    {ch.locked && <Text style={{ fontSize: 11 }}>🔒</Text>}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={ri.onEnter} activeOpacity={0.88}>
                <LinearGradient colors={[ri.btnA, ri.btnB]} style={[styles.enterBtn, { shadowColor: ri.btnShadow }]}>
                  <Text style={styles.enterBtnText}>{ri.btnLabel}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>

      <BottomNav navItems={navItems} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  title: { fontFamily: FONT.baloo.bold, fontSize: 26, color: '#3a2a1c' },
  sub: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#7a6a58', marginTop: 2 },
  mapBox: {
    alignSelf: 'center', borderRadius: 26, overflow: 'hidden',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#3c3228', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 8,
  },
  cloud: {
    position: 'absolute', height: 34, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.42)',
    shadowColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 18,
  },
  mapRidge: {
    position: 'absolute', borderRadius: 999, opacity: 0.42,
    transform: [{ rotate: '-11deg' }],
  },
  node: { position: 'absolute', alignItems: 'center', width: 94, zIndex: 3 },
  island: { width: 78, height: 57, alignItems: 'center' },
  islandShadow: {
    position: 'absolute', bottom: 2, width: 72, height: 24, borderRadius: 36,
    backgroundColor: 'rgba(30,36,40,0.34)', transform: [{ scaleX: 1.15 }],
  },
  islandRock: {
    position: 'absolute', bottom: 8, width: 65, height: 31, borderRadius: 33,
    backgroundColor: '#665647',
  },
  islandSoil: {
    position: 'absolute', bottom: 13, width: 72, height: 34, borderRadius: 36,
    backgroundColor: '#977455',
  },
  islandTop: {
    position: 'absolute', top: 1, width: 74, height: 42, borderRadius: 37,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.55)',
    shadowColor: '#1f2d2a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.34, shadowRadius: 9, elevation: 5,
  },
  nodeNumber: {
    position: 'absolute', top: -3, right: 1, width: 21, height: 21, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff',
  },
  nodeNum: { fontFamily: FONT.baloo.extrabold, fontSize: 10, color: '#fff' },
  lockBadge: {
    position: 'absolute', left: 2, top: 3, width: 20, height: 20,
    borderRadius: 10, backgroundColor: '#434947', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.8)',
  },
  lockShackle: {
    position: 'absolute', top: 3, width: 9, height: 8, borderWidth: 2, borderColor: '#fff', borderBottomWidth: 0,
    borderTopLeftRadius: 5, borderTopRightRadius: 5,
  },
  lockBody: { position: 'absolute', bottom: 3, width: 11, height: 8, borderRadius: 2, backgroundColor: '#fff' },
  nodeLabel: {
    marginTop: -2, minHeight: 24, maxWidth: 92, borderRadius: 10,
    backgroundColor: 'rgba(28,35,38,0.68)', paddingHorizontal: 7, paddingVertical: 3,
  },
  nodeName: {
    fontFamily: FONT.nunito.extrabold, fontSize: 8.5, lineHeight: 10, color: '#fff', textAlign: 'center',
  },
  mapExplorer: {
    position: 'absolute', left: -35, top: -68, zIndex: 8, width: 70, height: 70,
    alignItems: 'center', justifyContent: 'flex-end',
  },
  explorerGroundShadow: {
    position: 'absolute', bottom: 0, width: 38, height: 10, borderRadius: 19,
    backgroundColor: 'rgba(20,25,24,0.38)',
  },
  arrivalBubble: {
    position: 'absolute', left: 12, right: 12, top: 11, zIndex: 12,
    flexDirection: 'row', alignItems: 'center', gap: 9,
    backgroundColor: 'rgba(255,248,239,0.96)', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 10,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#23332e', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8,
  },
  arrivalPortrait: {
    width: 48, height: 48, borderRadius: 24, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F7D87C',
  },
  arrivalName: { fontFamily: FONT.nunito.extrabold, fontSize: 9.5, color: '#B46B13', textTransform: 'uppercase', letterSpacing: 0.6 },
  arrivalText: { fontFamily: FONT.baloo.bold, fontSize: 13, lineHeight: 15, color: '#3a2a1c' },
  bottomRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  eventCard: { borderRadius: 16, padding: 14 },
  eventLabel: { fontFamily: FONT.nunito.bold, fontSize: 11, color: '#9FC8FF', textTransform: 'uppercase', letterSpacing: 0.5 },
  eventTitle: { fontFamily: FONT.baloo.bold, fontSize: 16, color: '#fff', marginTop: 2 },
  eventSub: { fontFamily: FONT.nunito.semibold, fontSize: 11, color: '#cdd9e8' },
  regionsCard: { backgroundColor: '#fff8ef', borderRadius: 16, padding: 14 },
  regionsLabel: { fontFamily: FONT.nunito.bold, fontSize: 11, color: '#9a8a76', textTransform: 'uppercase', letterSpacing: 0.5 },
  regionsValue: { fontFamily: FONT.baloo.bold, fontSize: 16, color: '#3f7d47', marginTop: 2 },
  regionsSub: { fontFamily: FONT.nunito.semibold, fontSize: 11, color: '#7a6a58' },
  overlay: { flex: 1, backgroundColor: 'rgba(20,15,10,0.5)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#FFF8EF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  sheetContent: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 28 },
  sheetHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#ddd0bd', alignSelf: 'center', marginVertical: 6, marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  sheetIcon: {
    width: 64, height: 64, borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
    shadowColor: 'rgba(40,30,20,0.4)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 14, elevation: 5,
  },
  sheetTitle: { fontFamily: FONT.baloo.bold, fontSize: 22, color: '#3a2a1c' },
  sheetSub: { fontFamily: FONT.nunito.bold, fontSize: 12, color: '#9a8a76', marginTop: 3 },
  sheetLock: { fontFamily: FONT.nunito.extrabold, fontSize: 10.5, color: '#b5660c', backgroundColor: '#fbeccf', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, marginTop: 6, overflow: 'hidden' },
  sheetDesc: { fontFamily: FONT.nunito.semibold, fontSize: 13.5, color: '#5a4a3a', lineHeight: 19, marginVertical: 14 },
  infoCard: { backgroundColor: '#f3ead9', borderRadius: 14, padding: 10, marginBottom: 8 },
  infoRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  infoLabel: { fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#9a8a76', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontFamily: FONT.nunito.bold, fontSize: 12.5, color: '#4a3a2a', marginTop: 2 },
  challengeHeader: { fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#9a8a76', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4, marginBottom: 8 },
  challengeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  challengeBtn: {
    width: '47.5%', flexDirection: 'row', alignItems: 'center', gap: 9,
    borderRadius: 13, borderLeftWidth: 4, paddingVertical: 9, paddingRight: 8, paddingLeft: 8,
  },
  challengeIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  challengeName: { flex: 1, fontFamily: FONT.nunito.extrabold, fontSize: 12, color: '#3a2a1c', lineHeight: 14 },
  enterBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 0, elevation: 6 },
  enterBtnText: { fontFamily: FONT.baloo.bold, color: '#fff', fontSize: 18 },
});
