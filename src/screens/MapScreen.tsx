import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Modal, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polyline } from 'react-native-svg';
import CurrencyPills from '../components/CurrencyPills';
import RadialOrb from '../components/RadialOrb';
import BottomNav from '../components/BottomNav';
import { FONT } from '../theme/fonts';

const { width: W, height: H } = Dimensions.get('window');
const MAP_SIZE = W - 32;

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

export default function MapScreen({ vals }: Props) {
  const mapNodes: MapNode[] = vals.mapNodes || [];
  const ri: RegionInfo | null = vals.ri;
  const navItems = vals.navItems || [];

  const polylinePoints = mapNodes.map(n =>
    `${n.x / 100 * MAP_SIZE},${n.y / 100 * MAP_SIZE}`
  ).join(' ');

  return (
    <LinearGradient colors={['#cfe7d6', '#bfe0d8', '#d8c9e6', '#efe2d0']} locations={[0, 0.3, 0.7, 1]} style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>The Forest</Text>
            <Text style={styles.sub}>Eleven regions await — tap a glowing node to begin.</Text>
          </View>
          <CurrencyPills acorns={vals.acorns} glowDust={vals.glowDust} onOpenDaily={vals.openDaily} />
        </View>

        {/* Map container */}
        <View style={styles.mapBox}>
          <LinearGradient
            colors={['#9fd0a6', '#6fb6c4', '#7d6fb0', '#caa26e']}
            locations={[0, 0.36, 0.66, 1]}
            start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Svg width={MAP_SIZE} height={MAP_SIZE} style={StyleSheet.absoluteFill}>
            <Polyline points={polylinePoints} fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.4" strokeDasharray="6 7" strokeLinecap="round" />
          </Svg>

          {mapNodes.map((n) => (
            <TouchableOpacity
              key={n.id}
              style={[styles.node, {
                left: n.x / 100 * MAP_SIZE - 23,
                top: n.y / 100 * MAP_SIZE - 46,
                opacity: n.nodeOpacity,
              }]}
              onPress={n.onTap}
              activeOpacity={0.8}
            >
              <RadialOrb size={46} glow={n.glow} body={n.color} style={styles.nodeOrb}>
                <Text style={styles.nodeNum}>{n.num}</Text>
                {n.locked && (
                  <View style={styles.lockBadge}>
                    <Text style={{ fontSize: 8 }}>🔒</Text>
                  </View>
                )}
              </RadialOrb>
              <Text style={styles.nodeName}>{n.name}</Text>
            </TouchableOpacity>
          ))}
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
          <View style={styles.sheet}>
            <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetHeader}>
                <RadialOrb size={58} glow={ri.glow} body={ri.primary} style={styles.sheetIcon} />
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
                    <LinearGradient colors={[ch.color, ch.colorDark]} style={styles.challengeIcon} />
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
  scrollContent: { paddingTop: 56, paddingBottom: 100, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  title: { fontFamily: FONT.baloo.bold, fontSize: 26, color: '#3a2a1c' },
  sub: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#7a6a58', marginTop: 2 },
  mapBox: {
    width: MAP_SIZE, height: MAP_SIZE, borderRadius: 26, overflow: 'hidden',
    shadowColor: '#3c3228', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.3, shadowRadius: 24, elevation: 8,
  },
  node: { position: 'absolute', alignItems: 'center', width: 88 },
  nodeOrb: {
    shadowColor: '#28201a', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  nodeNum: { fontFamily: FONT.baloo.extrabold, fontSize: 16, color: '#fff', textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 },
  lockBadge: {
    position: 'absolute', right: -3, bottom: -3, width: 20, height: 20,
    borderRadius: 10, backgroundColor: '#5b4636', alignItems: 'center', justifyContent: 'center',
  },
  nodeName: {
    fontFamily: FONT.baloo.extrabold, fontSize: 10.5, color: '#fff', textAlign: 'center', marginTop: 5,
    textShadowColor: 'rgba(40,30,20,0.55)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3,
  },
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
    position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: H * 0.8,
    backgroundColor: '#FFF8EF', borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  sheetContent: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 28 },
  sheetHandle: { width: 42, height: 5, borderRadius: 3, backgroundColor: '#ddd0bd', alignSelf: 'center', marginVertical: 6, marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  sheetIcon: { borderRadius: 18, shadowColor: 'rgba(40,30,20,0.4)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 14, elevation: 5 },
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
  challengeIcon: { width: 24, height: 24, borderRadius: 7 },
  challengeName: { flex: 1, fontFamily: FONT.nunito.extrabold, fontSize: 12, color: '#3a2a1c', lineHeight: 14 },
  enterBtn: { borderRadius: 30, paddingVertical: 16, alignItems: 'center', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 0, elevation: 6 },
  enterBtnText: { fontFamily: FONT.baloo.bold, color: '#fff', fontSize: 18 },
});
