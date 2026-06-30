import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameIcon from '../components/GameIcon';
import { FONT } from '../theme/fonts';
import { parseGradientColors } from '../utils/parseGradient';

interface Props { vals: Record<string, any> }

function RainDrop({ x, dur, delay }: { x: number; dur: number; delay: number }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(t, { toValue: 1, duration: dur * 1000, delay: delay * 1000, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View style={[styles.rainDrop, {
      left: `${x}%`,
      opacity: t.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0, 0.75, 0] }),
      transform: [{ translateY: t.interpolate({ inputRange: [0, 1], outputRange: [-30, 380] }) }],
    }]} />
  );
}

export default function EventScreen({ vals }: Props) {
  const trials = vals.eventTrials || [];
  const shop = vals.eventShop || [];
  const rainDrops = vals.rainDrops || [];

  return (
    <LinearGradient colors={['#6E8AAE', '#3f5e84', '#1f3350']} locations={[0, 0.4, 1]} style={styles.container}>
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {rainDrops.map((r: any, i: number) => <RainDrop key={i} x={r.x} dur={parseFloat(r.dur)} delay={parseFloat(r.delay)} />)}
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backBtn} onPress={vals.goMap} activeOpacity={0.85}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eventTag}>SEASONAL EVENT · {vals.eventDays} DAYS LEFT</Text>
            <Text style={styles.title}>Monsoon Magic</Text>
          </View>
          <View style={styles.pearlPill}>
            <Text style={{ fontSize: 18 }}>💧</Text>
            <Text style={styles.pearlValue}>{vals.rainPearls}</Text>
          </View>
        </View>
        <Text style={styles.intro}>
          Waterfalls everywhere, rainbow bridges, and dangerous skies. Clear all five Storm Trials to earn the Monsoon Champion card.
        </Text>

        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Storm Trials</Text>
            <Text style={styles.progressCount}>{vals.eventCleared} / {trials.length} cleared</Text>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient colors={['#FFD54F', '#7AFCD0']} style={[styles.progressFill, { width: `${vals.eventPct}%` }]} />
          </View>
        </View>

        {vals.eventAllDone && (
          <LinearGradient colors={['#FFD54F', '#E8954E']} style={styles.completeBanner}>
            <Text style={styles.completeTag}>🏆 EVENT COMPLETE</Text>
            <Text style={styles.completeTitle}>Monsoon Champion</Text>
            <Text style={styles.completeSub}>A new Memory Card joins your Scrapbook.</Text>
          </LinearGradient>
        )}

        <View style={{ gap: 9 }}>
          {trials.map((t: any) => (
            <View key={t.id} style={styles.trial}>
              <LinearGradient colors={[t.glow, t.body]} style={styles.trialIcon}>
                <GameIcon kind={t.id} size={34} color="#fff" secondary="#FFD86B" />
              </LinearGradient>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.trialName}>{t.name}</Text>
                <Text style={styles.trialSub} numberOfLines={1}>{t.sub} · 💧{t.pearls}</Text>
              </View>
              {t.done && (
                <View style={styles.doneCircle}><Text style={styles.doneCheck}>✓</Text></View>
              )}
              {t.playable && (
                <TouchableOpacity onPress={t.onPlay} activeOpacity={0.85}>
                  <LinearGradient colors={['#1565C0', '#0d4a94']} style={styles.playBtn}>
                    <Text style={styles.playBtnText}>Play</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.shopTitle}>Event Shop</Text>
        <View style={{ gap: 9 }}>
          {shop.map((item: any) => (
            <View key={item.id} style={styles.shopRow}>
              <LinearGradient colors={parseGradientColors(item.color) as any} style={styles.shopSwatch}>
                <GameIcon kind={item.id} size={38} color="#fff" secondary="#FFD86B" />
              </LinearGradient>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.shopName}>{item.name}</Text>
                <Text style={styles.shopSub} numberOfLines={1}>{item.sub}</Text>
              </View>
              {item.owned && <Text style={styles.ownedText}>Owned</Text>}
              {item.buyable && (
                <TouchableOpacity onPress={item.onBuy} activeOpacity={0.85}>
                  <LinearGradient colors={['#FFE7A8', '#FFD54F']} style={styles.buyBtn}>
                    <Text style={styles.buyBtnText}>💧 {item.cost}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  rainDrop: { position: 'absolute', top: 0, width: 2, height: 18, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.7)' },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingTop: 50, paddingHorizontal: 18, paddingBottom: 40, gap: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center' },
  backText: { fontFamily: FONT.baloo.extrabold, fontSize: 18, color: '#1f3350' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eventTag: { fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#FFD54F', textTransform: 'uppercase', letterSpacing: 1.5 },
  title: { fontFamily: FONT.baloo.extrabold, fontSize: 30, color: '#fff', lineHeight: 32 },
  pearlPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 8 },
  pearlValue: { fontFamily: FONT.baloo.extrabold, fontSize: 18, color: '#fff' },
  intro: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#dce8f5', lineHeight: 18 },
  progressCard: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 18, padding: 14 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  progressLabel: { fontFamily: FONT.baloo.bold, fontSize: 15, color: '#fff' },
  progressCount: { fontFamily: FONT.nunito.extrabold, fontSize: 12, color: '#FFD54F' },
  progressTrack: { height: 10, borderRadius: 6, backgroundColor: 'rgba(0,0,0,0.25)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6 },
  completeBanner: { borderRadius: 18, padding: 14 },
  completeTag: { fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#3a2a1c', textTransform: 'uppercase', letterSpacing: 1 },
  completeTitle: { fontFamily: FONT.baloo.extrabold, fontSize: 19, color: '#3a2a1c' },
  completeSub: { fontFamily: FONT.nunito.semibold, fontSize: 12, color: '#3a2a1c' },
  trial: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff8ef', borderRadius: 16, padding: 11 },
  trialIcon: {
    width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.7)',
    shadowColor: '#20334a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5,
  },
  trialName: { fontFamily: FONT.nunito.extrabold, fontSize: 13.5, color: '#3a2a1c' },
  trialSub: { fontFamily: FONT.nunito.semibold, fontSize: 11, color: '#7a6a58', marginTop: 2 },
  doneCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#3f7d47', alignItems: 'center', justifyContent: 'center' },
  doneCheck: { color: '#fff', fontWeight: '900' },
  playBtn: { borderRadius: 18, paddingHorizontal: 16, paddingVertical: 9 },
  playBtnText: { fontFamily: FONT.baloo.bold, fontSize: 13, color: '#fff' },
  shopTitle: { fontFamily: FONT.baloo.bold, fontSize: 15, color: '#fff', marginTop: -4 },
  shopRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, padding: 11 },
  shopSwatch: {
    width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.28)',
    shadowColor: '#102238', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5,
  },
  shopName: { fontFamily: FONT.nunito.extrabold, fontSize: 13.5, color: '#fff' },
  shopSub: { fontFamily: FONT.nunito.semibold, fontSize: 11, color: '#cdd9e8', marginTop: 2 },
  ownedText: { fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#7AFCD0', backgroundColor: 'rgba(122,252,208,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14 },
  buyBtn: { borderRadius: 14, paddingHorizontal: 13, paddingVertical: 8 },
  buyBtnText: { fontFamily: FONT.nunito.extrabold, fontSize: 12, color: '#1f3350' },
});
