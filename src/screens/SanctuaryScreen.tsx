import React, { useEffect, useRef } from 'react';
// SanctuaryScreen component
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import CurrencyPills from '../components/CurrencyPills';
import CharacterArt from '../components/CharacterArt';
import GameIcon from '../components/GameIcon';
import AnimatedCampfire from '../components/AnimatedCampfire';
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
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 700;
  const zones = vals.sanctuaryZones || [];
  const decor = vals.decorItems || [];
  const placedDecor = vals.placedDecorItems || [];
  const friendIds = ['pip', 'mimi', 'tomo', 'luma', 'nori', 'sol'];
  return (
    <LinearGradient colors={['#bfe0c4', '#9bc9a4', '#7aa97f']} locations={[0, 0.44, 1]} style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 18, paddingBottom: 90 + insets.bottom }]}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Your Sanctuary</Text>
            <Text style={styles.sub}>Home base — collect gifts and make it your own.</Text>
          </View>
          <CurrencyPills acorns={vals.acorns} glowDust={vals.glowDust} onOpenDaily={vals.openDaily} />
        </View>

        <View style={[styles.campfireBox, isWide && styles.campfireBoxWide]}>
          <Text style={styles.campfireLabel}>The Clearing · Campfire</Text>
          <Text style={styles.campfireHint}>Tap the flame to stoke it</Text>
          <AnimatedCampfire onPress={vals.stokeCampfire} />
          <View style={styles.placedDecorRow} pointerEvents="none">
            {placedDecor.map((d: any) => (
              <View key={d.id} style={[styles.placedDecor, { backgroundColor: d.tint }]}>
                <GameIcon kind={d.icon} size={26} color="#fff" secondary="#FFE98A" />
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>Creature Homes</Text>
        <View style={styles.zoneGrid}>
          {zones.map((z: any, i: number) => (
            <View key={i} style={[styles.zoneCard, isWide && styles.zoneCardWide, { opacity: parseFloat(z.op) }]}>
              <View style={styles.zoneRow}>
                <View style={[styles.zoneAvatar, { backgroundColor: z.glow }]}>
                  <CharacterArt id={friendIds[i]} size={58} />
                </View>
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
        <Text style={styles.sectionHelp}>Tap an item to buy it, then tap again to place or store it.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {decor.map((d: any, i: number) => (
            <TouchableOpacity
              key={d.id || i}
              style={[styles.decorCard, d.placed && styles.decorCardPlaced]}
              onPress={d.onTap}
              activeOpacity={0.82}
              accessibilityRole="button"
              accessibilityLabel={`${d.name}. ${d.status}`}
            >
              <LinearGradient colors={parseGradientColors(d.color) as any} style={styles.decorSwatch}>
                <GameIcon kind={d.icon} size={31} color="#fff" secondary="#FFE98A" />
              </LinearGradient>
              <Text style={styles.decorName} numberOfLines={1}>{d.name}</Text>
              <Text style={[styles.decorCost, d.placed && styles.decorPlacedText]}>{d.status}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
      <BottomNav navItems={vals.navItems || []} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  title: { fontFamily: FONT.baloo.bold, fontSize: 26, color: '#2f4a32' },
  sub: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#3f5e42', marginTop: 2 },
  campfireBox: {
    height: 200, borderRadius: 24, backgroundColor: '#8cbf91', marginBottom: 16, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#28201a', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 28, elevation: 6,
  },
  campfireBoxWide: { height: 230 },
  campfireLabel: {
    position: 'absolute', top: 12, left: 14, fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#2f4a32',
    backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  campfireHint: {
    position: 'absolute', top: 14, right: 14, fontFamily: FONT.nunito.bold, fontSize: 10, color: '#3f5e42',
  },
  placedDecorRow: {
    position: 'absolute', left: 13, right: 13, bottom: 10, flexDirection: 'row', justifyContent: 'space-between',
  },
  placedDecor: {
    width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.65)',
  },
  sectionTitle: { fontFamily: FONT.baloo.bold, fontSize: 15, color: '#2f4a32', marginBottom: 8 },
  sectionHelp: { fontFamily: FONT.nunito.semibold, fontSize: 11.5, color: '#3f5e42', marginTop: -5, marginBottom: 9 },
  zoneGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  zoneCard: { width: '47.5%', backgroundColor: '#fff8ef', borderRadius: 18, padding: 12, shadowColor: '#28201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 4 },
  zoneCardWide: { width: '31.8%' },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  zoneAvatar: { width: 46, height: 46, borderRadius: 15, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  zoneName: { fontFamily: FONT.nunito.extrabold, fontSize: 13, color: '#3a2a1c' },
  zoneStatus: { fontFamily: FONT.nunito.bold, fontSize: 10.5, color: '#9a8a76' },
  giftBtn: { marginTop: 10, borderRadius: 14, paddingVertical: 8, alignItems: 'center' },
  giftBtnText: { fontFamily: FONT.nunito.extrabold, fontSize: 11.5, color: '#fff' },
  decorCard: { width: 92, backgroundColor: '#fff8ef', borderRadius: 16, padding: 10, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  decorCardPlaced: { borderColor: '#3f7d47', backgroundColor: '#edf6ed' },
  decorSwatch: { width: 46, height: 46, borderRadius: 14, marginBottom: 6, alignItems: 'center', justifyContent: 'center' },
  decorName: { fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#3a2a1c' },
  decorCost: { fontFamily: FONT.nunito.bold, fontSize: 9.5, color: '#9a8a76' },
  decorPlacedText: { color: '#3f7d47' },
});
