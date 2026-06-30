import React from 'react';
import { Modal, View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FONT } from '../theme/fonts';

interface Day { day: number; icon: string; label: string; claimed: boolean; bg: string; ring: string; dayColor: string; labelColor: string }
interface Props { vals: Record<string, any> }

export default function DailyChest({ vals }: Props) {
  const days: Day[] = vals.dailyDays || [];
  return (
    <Modal visible={!!vals.dailyOpen} transparent animationType="fade" onRequestClose={vals.closeDaily}>
      <Pressable style={styles.overlay} onPress={vals.closeDaily} />
      <View style={styles.cardWrap} pointerEvents="box-none">
        <View style={styles.card}>
          <LinearGradient colors={['#FFE7A8', '#F5A623']} style={styles.giftIcon}>
            <Text style={{ fontSize: 34 }}>🎁</Text>
          </LinearGradient>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.body}>Pip kept the campfire warm. No streaks to keep — your gifts are always saved.</Text>

          <View style={styles.grid}>
            {days.map((d) => (
              <View key={d.day} style={[styles.dayCell, { backgroundColor: d.bg, borderColor: d.ring.includes('#') ? '#F5A623' : 'transparent', borderWidth: d.ring === 'none' ? 0 : 2.5 }]}>
                <Text style={[styles.dayLabel, { color: d.dayColor }]}>Day {d.day}</Text>
                <Text style={styles.dayIcon}>{d.icon}</Text>
                <Text style={[styles.dayCaption, { color: d.labelColor }]}>{d.label}</Text>
                {d.claimed && (
                  <View style={styles.claimedOverlay}>
                    <Text style={styles.claimedCheck}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          {vals.dailyCanClaim ? (
            <TouchableOpacity onPress={vals.claimDaily} activeOpacity={0.88}>
              <LinearGradient colors={['#5EA862', '#3f7d47']} style={styles.actionBtn}>
                <Text style={styles.actionText}>Claim Day 1 Gift</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={vals.closeDaily} activeOpacity={0.88}>
              <LinearGradient colors={['#F5A623', '#dd8512']} style={styles.actionBtn}>
                <Text style={styles.actionText}>Into the Forest →</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(20,15,10,0.55)' },
  cardWrap: { position: 'absolute', left: 18, right: 18, top: '50%', transform: [{ translateY: '-50%' as unknown as number }] },
  card: {
    backgroundColor: '#FFF8EF', borderRadius: 28, paddingTop: 24, paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 30 }, shadowOpacity: 0.4, shadowRadius: 50, elevation: 20,
  },
  giftIcon: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  title: { fontFamily: FONT.baloo.extrabold, fontSize: 22, color: '#3a2a1c' },
  body: { fontFamily: FONT.nunito.semibold, fontSize: 12.5, color: '#7a6a58', textAlign: 'center', lineHeight: 17, marginTop: 4, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16, justifyContent: 'center' },
  dayCell: { width: '22%', borderRadius: 14, paddingVertical: 9, paddingHorizontal: 2, alignItems: 'center', position: 'relative' },
  dayLabel: { fontFamily: FONT.nunito.extrabold, fontSize: 9, textTransform: 'uppercase' },
  dayIcon: { fontSize: 22, lineHeight: 26 },
  dayCaption: { fontFamily: FONT.nunito.bold, fontSize: 8.5, textAlign: 'center' },
  claimedOverlay: { position: 'absolute', inset: 0, borderRadius: 14, backgroundColor: 'rgba(63,125,71,0.82)', alignItems: 'center', justifyContent: 'center' },
  claimedCheck: { color: '#fff', fontSize: 16, fontWeight: '900' },
  actionBtn: { width: '100%', borderRadius: 26, paddingVertical: 15, alignItems: 'center' },
  actionText: { fontFamily: FONT.baloo.bold, fontSize: 17, color: '#fff' },
});
