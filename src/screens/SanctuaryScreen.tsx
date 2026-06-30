import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '../components/BottomNav';
import CurrencyPills from '../components/CurrencyPills';
import RadialOrb from '../components/RadialOrb';
import { FONT } from '../theme/fonts';
import { parseGradientColors } from '../utils/parseGradient';

interface Props { vals: Record<string, any> }

function GiftButton({ onPress }: { onPress?: () => void }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 1100, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <Animated.View style={{ transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.04] }) }] }}>
        <LinearGradient colors={['#F5A623', '#dd8512']} style={styles.giftBtn}>
          <Text style={styles.giftBtnText}>Collect Gift ✦</Text>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function SanctuaryScreen({ vals }: Props) {
  const zones = vals.sanctuaryZones || [];
  const decor = vals.decorItems || [];
  return (
    <LinearGradient colors={['#bfe0c4', '#9bc9a4', '#7aa97f']} locations={[0, 0.44, 1]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Your Sanctuary</Text>
            <Text style={styles.sub}>Home base — collect gifts and make it your own.</Text>
          </View>
          <CurrencyPills acorns={vals.acorns} glowDust={vals.glowDust} onOpenDaily={vals.openDaily} />
        </View>

        <View style={styles.campfireBox}>
          <Text style={styles.campfireLabel}>The Clearing · Campfire</Text>
          <View style={styles.fireWrap}>
            <RadialOrb size={60} glow="#F5A623" body="#b5660c" cx={0.5} cy={0.5} style={styles.fireGlow} />
            <View style={styles.logs}>
              <View style={[styles.log, { transform: [{ rotate: '-18deg' }] }]} />
              <View style={[styles.log, { transform: [{ rotate: '18deg' }] }]} />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Creature Homes</Text>
        <View style={styles.zoneGrid}>
          {zones.map((z: any, i: number) => (
            <View key={i} style={[styles.zoneCard, { opacity: parseFloat(z.op) }]}>
              <View style={styles.zoneRow}>
                <RadialOrb size={42} glow={z.glow} body={z.body} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.zoneName} numberOfLines={1}>{z.home}</Text>
                  <Text style={styles.zoneStatus} numberOfLines={1}>{z.status}</Text>
                </View>
              </View>
              {z.hasGift && <GiftButton onPress={z.onGift} />}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Decoration Inventory</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {decor.map((d: any, i: number) => (
            <View key={i} style={styles.decorCard}>
              <LinearGradient colors={parseGradientColors(d.color) as any} style={styles.decorSwatch} />
              <Text style={styles.decorName} numberOfLines={1}>{d.name}</Text>
              <Text style={styles.decorCost}>{d.cost}</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      <BottomNav navItems={vals.navItems || []} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 56, paddingBottom: 100, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  title: { fontFamily: FONT.baloo.bold, fontSize: 26, color: '#2f4a32' },
  sub: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#3f5e42', marginTop: 2 },
  campfireBox: {
    height: 200, borderRadius: 24, backgroundColor: '#8cbf91', marginBottom: 16, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#28201a', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 28, elevation: 6,
  },
  campfireLabel: {
    position: 'absolute', top: 12, left: 14, fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#2f4a32',
    backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  fireWrap: { alignItems: 'center' },
  fireGlow: { shadowColor: '#F5A623', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 26, elevation: 8 },
  logs: { flexDirection: 'row', gap: 3, marginTop: -6 },
  log: { width: 34, height: 8, borderRadius: 4, backgroundColor: '#6a4a2e' },
  sectionTitle: { fontFamily: FONT.baloo.bold, fontSize: 15, color: '#2f4a32', marginBottom: 8 },
  zoneGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  zoneCard: { width: '47.5%', backgroundColor: '#fff8ef', borderRadius: 18, padding: 12, shadowColor: '#28201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 4 },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  zoneName: { fontFamily: FONT.nunito.extrabold, fontSize: 13, color: '#3a2a1c' },
  zoneStatus: { fontFamily: FONT.nunito.bold, fontSize: 10.5, color: '#9a8a76' },
  giftBtn: { marginTop: 10, borderRadius: 14, paddingVertical: 8, alignItems: 'center' },
  giftBtnText: { fontFamily: FONT.nunito.extrabold, fontSize: 11.5, color: '#fff' },
  decorCard: { width: 78, backgroundColor: '#fff8ef', borderRadius: 16, padding: 10, alignItems: 'center' },
  decorSwatch: { width: 38, height: 38, borderRadius: 12, marginBottom: 6 },
  decorName: { fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#3a2a1c' },
  decorCost: { fontFamily: FONT.nunito.bold, fontSize: 9.5, color: '#9a8a76' },
});
