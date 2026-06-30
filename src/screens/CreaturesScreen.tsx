import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BottomNav from '../components/BottomNav';
import CurrencyPills from '../components/CurrencyPills';
import RadialOrb from '../components/RadialOrb';
import { FONT } from '../theme/fonts';

interface Props { vals: Record<string, any> }

export default function CreaturesScreen({ vals }: Props) {
  const cards = vals.creatureCards || [];
  return (
    <LinearGradient colors={['#eef3e8', '#e3ebdc', '#efe2d0']} locations={[0, 0.6, 1]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Your Friends</Text>
            <Text style={styles.sub}>Six guides who grow and evolve alongside you.</Text>
          </View>
          <CurrencyPills acorns={vals.acorns} glowDust={vals.glowDust} onOpenDaily={vals.openDaily} />
        </View>

        <View style={{ gap: 12 }}>
          {cards.map((c: any) => (
            <TouchableOpacity key={c.id} style={styles.card} onPress={c.onTap} activeOpacity={0.88}>
              <View>
                <RadialOrb size={62} glow={c.glow} body={c.body} style={styles.avatar} />
                <View style={[styles.stageBadge, { backgroundColor: c.accent }]}>
                  <Text style={styles.stageBadgeText}>S{c.stage}</Text>
                </View>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.cardName}>{c.name}</Text>
                  <Text style={styles.cardSpecies}>{c.species}</Text>
                </View>
                <Text style={styles.cardArch}>{c.archetype}</Text>
                <View style={styles.bondTrack}>
                  <LinearGradient colors={[c.body, c.accent]} style={[styles.bondFill, { width: `${c.bond}%` }]} />
                </View>
                <Text style={styles.bondLabel}>Bond {c.bond}/100</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomNav navItems={vals.navItems || []} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 56, paddingBottom: 100, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 16 },
  title: { fontFamily: FONT.baloo.bold, fontSize: 26, color: '#3a2a1c' },
  sub: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#7a6a58', marginTop: 2 },
  card: {
    backgroundColor: '#fff8ef', borderRadius: 22, padding: 14, flexDirection: 'row', gap: 14, alignItems: 'center',
    shadowColor: 'rgba(80,60,40,0.5)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 20, elevation: 6,
  },
  avatar: { shadowColor: '#28201a', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 6 },
  stageBadge: { position: 'absolute', bottom: -3, right: -3, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  stageBadgeText: { fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  cardName: { fontFamily: FONT.baloo.bold, fontSize: 18, color: '#3a2a1c' },
  cardSpecies: { fontFamily: FONT.nunito.bold, fontSize: 11, color: '#9a8a76' },
  cardArch: { fontFamily: FONT.nunito.semibold, fontSize: 11.5, color: '#7a6a58', marginTop: 2, marginBottom: 7 },
  bondTrack: { height: 7, borderRadius: 5, backgroundColor: '#e7ddcb', overflow: 'hidden' },
  bondFill: { height: '100%', borderRadius: 5 },
  bondLabel: { fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#9a8a76', marginTop: 4 },
});
