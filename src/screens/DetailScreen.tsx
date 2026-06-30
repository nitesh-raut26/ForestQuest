import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CharacterArt from '../components/CharacterArt';
import { FONT } from '../theme/fonts';

interface Props { vals: Record<string, any> }

export default function DetailScreen({ vals }: Props) {
  const dc = vals.dc || {};
  const stages = vals.dcStages || [];
  const lines = vals.dcLines || [];
  const milestones = vals.dcMilestones || [];
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={[dc.glow || '#FFC58C', dc.body || '#E8822F']} style={styles.hero}>
          <View style={styles.heroHalo} />
          <TouchableOpacity style={styles.back} onPress={() => vals.goCreatures?.()} activeOpacity={0.85}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Animated.View style={{ transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -7] }) }] }}>
            <View style={styles.heroShadow} />
            <CharacterArt name={dc.name} size={205} style={styles.avatar} />
          </Animated.View>
        </LinearGradient>

        <View style={styles.cardWrap}>
          <View style={styles.card}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{dc.name}</Text>
              <Text style={[styles.species, { color: dc.accent }]}>{dc.species}</Text>
            </View>
            <Text style={styles.archetype}>{dc.archetype} · {dc.biome}</Text>
            <Text style={styles.personality}>{dc.personality}</Text>
            <View style={styles.bondRow}>
              <View style={styles.bondTrack}>
                <LinearGradient colors={[dc.body || '#E8822F', dc.accent || '#5E9A57']} style={[styles.bondFill, { width: `${dc.bond}%` }]} />
              </View>
              <Text style={styles.bondNum}>{dc.bond}/100</Text>
            </View>
            <TouchableOpacity onPress={vals.addBond} activeOpacity={0.88}>
              <LinearGradient colors={[dc.body || '#E8822F', dc.accent || '#5E9A57']} style={styles.bondBtn}>
                <Text style={styles.bondBtnText}>Spend time together  +5 Bond</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Evolution</Text>
          <View style={styles.stageRow}>
            {stages.map((st: any, i: number) => (
              <View key={i} style={[styles.stageCard, st.ring !== 'none' && { borderWidth: 2, borderColor: dc.accent }, { opacity: parseFloat(st.op) }]}>
                <View style={[styles.stageAvatar, { backgroundColor: dc.glow || '#fff' }]}>
                  <CharacterArt name={dc.name} size={58} />
                </View>
                <Text style={styles.stageName}>{st.name}</Text>
                <Text style={styles.stageDesc}>{st.desc}</Text>
              </View>
            ))}
          </View>

          <View style={styles.abilityRow}>
            <View style={[styles.abilityCard, { backgroundColor: '#eef3ec' }]}>
              <Text style={[styles.abilityTag, { color: '#3f7d47' }]}>PASSIVE</Text>
              <Text style={styles.abilityName}>{dc.passiveName}</Text>
              <Text style={styles.abilityDesc}>{dc.passiveDesc}</Text>
            </View>
            <View style={[styles.abilityCard, { backgroundColor: '#f3eef6' }]}>
              <Text style={[styles.abilityTag, { color: '#9B59B6' }]}>ACTIVE · BOND {dc.activeBond}</Text>
              <Text style={styles.abilityName}>{dc.activeName}</Text>
              <Text style={styles.abilityDesc}>{dc.activeDesc}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Voice — "{dc.voice}"</Text>
          <View style={{ gap: 8 }}>
            {lines.map((l: any, i: number) => (
              <View key={i} style={styles.line}>
                <Text style={[styles.lineTag, { color: dc.accent }]}>{l.tag}</Text>
                <Text style={styles.lineText}>"{l.text}"</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Bond Milestones</Text>
          <View style={{ gap: 6 }}>
            {milestones.map((m: any, i: number) => (
              <View key={i} style={[styles.milestone, { opacity: parseFloat(m.op) }]}>
                <View style={[styles.milestoneAt, { backgroundColor: m.bg }]}>
                  <Text style={[styles.milestoneAtText, { color: m.fg }]}>{m.at}</Text>
                </View>
                <Text style={styles.milestoneText}>{m.t}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EF' },
  scrollContent: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingBottom: 40 },
  hero: { height: 230, alignItems: 'center', justifyContent: 'center' },
  heroHalo: {
    position: 'absolute', width: 190, height: 190, borderRadius: 95, backgroundColor: 'rgba(255,255,255,0.22)',
    top: 36,
  },
  heroShadow: {
    position: 'absolute', bottom: 16, left: 53, width: 100, height: 20, borderRadius: 50,
    backgroundColor: 'rgba(48,31,20,0.26)',
  },
  back: {
    position: 'absolute', top: 50, left: 18, width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center', zIndex: 2,
  },
  backText: { fontFamily: FONT.baloo.extrabold, fontSize: 18, color: '#3a2a1c' },
  avatar: { marginTop: 18 },
  cardWrap: { paddingHorizontal: 20, marginTop: -26 },
  card: {
    backgroundColor: '#fff', borderRadius: 24, padding: 18,
    shadowColor: 'rgba(80,60,40,0.5)', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 1, shadowRadius: 28, elevation: 8,
  },
  nameRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  name: { fontFamily: FONT.baloo.extrabold, fontSize: 26, color: '#3a2a1c' },
  species: { fontFamily: FONT.nunito.bold, fontSize: 12 },
  archetype: { fontFamily: FONT.nunito.bold, fontSize: 12, color: '#9a8a76', marginBottom: 8 },
  personality: { fontFamily: FONT.nunito.semibold, fontSize: 13.5, color: '#5a4a3a', lineHeight: 19 },
  bondRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  bondTrack: { flex: 1, height: 10, borderRadius: 6, backgroundColor: '#efe6d6', overflow: 'hidden' },
  bondFill: { height: '100%', borderRadius: 6 },
  bondNum: { fontFamily: FONT.nunito.extrabold, fontSize: 12, color: '#7a6a58' },
  bondBtn: { marginTop: 12, borderRadius: 22, paddingVertical: 12, alignItems: 'center' },
  bondBtnText: { fontFamily: FONT.nunito.extrabold, fontSize: 14, color: '#fff' },
  sectionTitle: { fontFamily: FONT.baloo.bold, fontSize: 15, color: '#3a2a1c', marginTop: 16, marginBottom: 8 },
  stageRow: { flexDirection: 'row', gap: 8 },
  stageCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 10, alignItems: 'center', shadowColor: 'rgba(80,60,40,0.5)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 16, elevation: 4 },
  stageAvatar: { width: 48, height: 48, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  stageName: { fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#3a2a1c' },
  stageDesc: { fontFamily: FONT.nunito.semibold, fontSize: 10, color: '#9a8a76', textAlign: 'center', lineHeight: 13, marginTop: 3 },
  abilityRow: { flexDirection: 'row', gap: 10 },
  abilityCard: { flex: 1, borderRadius: 16, padding: 13 },
  abilityTag: { fontFamily: FONT.nunito.extrabold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  abilityName: { fontFamily: FONT.baloo.bold, fontSize: 14, color: '#3a2a1c', marginVertical: 2 },
  abilityDesc: { fontFamily: FONT.nunito.semibold, fontSize: 11, color: '#6a5a48', lineHeight: 15 },
  line: { backgroundColor: '#fff', borderRadius: 14, borderTopLeftRadius: 4, padding: 11, shadowColor: 'rgba(80,60,40,0.5)', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 14, elevation: 3 },
  lineTag: { fontFamily: FONT.nunito.extrabold, fontSize: 9.5, textTransform: 'uppercase', letterSpacing: 0.5 },
  lineText: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#4a3a2a', fontStyle: 'italic', lineHeight: 18, marginTop: 2 },
  milestone: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 10, shadowColor: 'rgba(80,60,40,0.5)', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 14, elevation: 3 },
  milestoneAt: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  milestoneAtText: { fontFamily: FONT.baloo.extrabold, fontSize: 13 },
  milestoneText: { flex: 1, fontFamily: FONT.nunito.semibold, fontSize: 12.5, color: '#4a3a2a', lineHeight: 17 },
});
