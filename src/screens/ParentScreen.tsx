import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CharacterArt from '../components/CharacterArt';
import { FONT } from '../theme/fonts';

interface Props { vals: Record<string, any> }

export default function ParentScreen({ vals }: Props) {
  const stats = vals.parentStats || [];
  const skills = vals.parentSkills || [];
  const badges = vals.safetyBadges || [];

  return (
    <LinearGradient colors={['#eef2f6', '#e6ecf2', '#dfe6ee']} locations={[0, 0.6, 1]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.back} onPress={vals.goMap} activeOpacity={0.85}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Parent Dashboard</Text>
        <Text style={styles.sub}>A quiet window into your child's week — no scores to chase.</Text>

        <View style={styles.badges}>
          {badges.map((b: string, i: number) => (
            <View key={i} style={styles.badge}>
              <View style={styles.badgeCheck}><Text style={styles.badgeCheckMark}>✓</Text></View>
              <Text style={styles.badgeText}>{b}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsGrid}>
          {stats.map((s: any, i: number) => (
            <View key={i} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Skills practiced this week</Text>
        <View style={styles.skillsCard}>
          {skills.map((k: any) => (
            <View key={k.name}>
              <View style={styles.skillTopRow}>
                <Text style={styles.skillName}>{k.name}</Text>
                <Text style={styles.skillCount}>{k.count} puzzles</Text>
              </View>
              <View style={styles.skillTrack}>
                <View style={[styles.skillFill, { width: `${k.pct}%`, backgroundColor: k.color }]} />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.favCard}>
          <View style={[styles.favAvatar, { backgroundColor: vals.favGlow || '#FFC58C' }]}>
            <CharacterArt name={vals.favName} size={68} />
          </View>
          <View>
            <Text style={styles.favLabel}>Closest Companion</Text>
            <Text style={styles.favName}>{vals.favName} · Bond {vals.favBond}</Text>
          </View>
        </View>

        <View style={styles.promiseCard}>
          <Text style={styles.promiseTitle}>Our promise to families</Text>
          <Text style={styles.promiseBody}>
            No timers, no streaks to lose, no surprise charges. Forest Quest is designed so children can stop any time and always feel welcomed back.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 50, paddingHorizontal: 16, paddingBottom: 40, gap: 14 },
  back: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  backText: { fontFamily: FONT.baloo.extrabold, fontSize: 18, color: '#37474F' },
  title: { fontFamily: FONT.baloo.extrabold, fontSize: 26, color: '#2b3a4a' },
  sub: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#6a7888', marginTop: -8 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e7f3ec', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 7 },
  badgeCheck: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#3f7d47', alignItems: 'center', justifyContent: 'center' },
  badgeCheckMark: { color: '#fff', fontSize: 8, fontWeight: '900' },
  badgeText: { fontFamily: FONT.nunito.extrabold, fontSize: 11.5, color: '#2f6e3a' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '47%', backgroundColor: '#fff', borderRadius: 18, padding: 14, shadowColor: 'rgba(60,70,90,0.4)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 16, elevation: 4 },
  statValue: { fontFamily: FONT.baloo.extrabold, fontSize: 24 },
  statLabel: { fontFamily: FONT.nunito.bold, fontSize: 11, color: '#6a7888', lineHeight: 14 },
  sectionTitle: { fontFamily: FONT.baloo.bold, fontSize: 15, color: '#2b3a4a' },
  skillsCard: { backgroundColor: '#fff', borderRadius: 18, padding: 16, gap: 11, shadowColor: 'rgba(60,70,90,0.4)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 16, elevation: 4 },
  skillTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  skillName: { fontFamily: FONT.nunito.extrabold, fontSize: 12.5, color: '#3a4a5a' },
  skillCount: { fontFamily: FONT.nunito.bold, fontSize: 11, color: '#9aa6b4' },
  skillTrack: { height: 9, borderRadius: 6, backgroundColor: '#eef1f5', overflow: 'hidden' },
  skillFill: { height: '100%', borderRadius: 6 },
  favCard: { flexDirection: 'row', gap: 13, alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, padding: 16, shadowColor: 'rgba(60,70,90,0.4)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 16, elevation: 4 },
  favAvatar: { width: 56, height: 56, borderRadius: 18, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  favLabel: { fontFamily: FONT.nunito.bold, fontSize: 11, color: '#9aa6b4', textTransform: 'uppercase', letterSpacing: 0.5 },
  favName: { fontFamily: FONT.baloo.bold, fontSize: 17, color: '#2b3a4a' },
  promiseCard: { backgroundColor: '#eaf2ec', borderRadius: 18, padding: 16 },
  promiseTitle: { fontFamily: FONT.baloo.bold, fontSize: 14, color: '#2f4a35', marginBottom: 4 },
  promiseBody: { fontFamily: FONT.nunito.semibold, fontSize: 12.5, lineHeight: 18, color: '#3f5e45' },
});
