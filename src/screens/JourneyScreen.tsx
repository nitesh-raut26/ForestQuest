import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import CurrencyPills from '../components/CurrencyPills';
import { FONT } from '../theme/fonts';
import { firstGradientColor, parseGradientColors } from '../utils/parseGradient';

interface Props { vals: Record<string, any> }

export default function JourneyScreen({ vals }: Props) {
  const insets = useSafeAreaInsets();
  const quests = vals.quests || [];
  const rankLadder = vals.rankLadder || [];
  const codex = vals.puzzleCodexList || [];
  const scrapbook = vals.scrapbook || [];
  const ageCoverage = vals.ageCoverage || [];

  return (
    <LinearGradient colors={['#efe6d6', '#e7dcc8', '#dfd2bb']} locations={[0, 0.6, 1]} style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 90 + insets.bottom }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Journey</Text>
          <CurrencyPills acorns={vals.acorns} glowDust={vals.glowDust} onOpenDaily={vals.openDaily} />
        </View>

        <View style={styles.rankRow}>
          <Text style={styles.rankLine}>Rank {vals.rankNum} · {vals.rankName}</Text>
          <TouchableOpacity style={styles.parentBtn} onPress={vals.openParent} activeOpacity={0.85}>
            <Text style={{ fontSize: 13 }}>👪</Text>
            <Text style={styles.parentBtnText}>For Parents</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.xpCard}>
          <View style={styles.xpHeaderRow}>
            <Text style={styles.xpTotal}>{vals.xpTotal} XP</Text>
            <Text style={styles.xpToNext}>{vals.xpToNext} XP to {vals.nextRankName}</Text>
          </View>
          <View style={styles.xpTrack}>
            <LinearGradient colors={['#5EA862', '#9BD46A']} style={[styles.xpFill, { width: `${vals.xpPct}%` }]} />
          </View>
        </View>

        <LinearGradient colors={['#1565C0', '#37474F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.eventBanner}>
          <Text style={styles.eventTag}>SEASONAL EVENT</Text>
          <Text style={styles.eventTitle}>Monsoon Magic</Text>
          <Text style={styles.eventSub}>Waterfalls everywhere · rainbow bridges · 14 days remaining</Text>
        </LinearGradient>

        {vals.finaleHasReplay2 && (
          <TouchableOpacity onPress={vals.playFinale} activeOpacity={0.88}>
            <LinearGradient colors={['#2f6aa0', '#0c2746']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.replayBanner}>
              <View style={styles.replayIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.replayTag}>STORY · REPLAY</Text>
                <Text style={styles.replayTitle}>The Sky Awakes</Text>
              </View>
              <Text style={styles.replayArrow}>▸</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Daily Quests</Text>
        <View style={{ gap: 8 }}>
          {quests.map((q: any) => (
            <View key={q.id} style={styles.questCard}>
              <View style={styles.questTopRow}>
                <Text style={[styles.questType, { color: q.color }]}>{q.type}</Text>
                <Text style={styles.questReward}>{q.reward}</Text>
              </View>
              <View style={styles.questTopRow}>
                <Text style={styles.questTitleText}>{q.title}</Text>
                <Text style={[styles.questCount, { color: q.color }]}>{q.countLabel}</Text>
              </View>
              <View style={styles.questTrack}>
                <LinearGradient colors={[q.color, '#F5A623']} style={[styles.questFill, { width: `${q.pct}%` }]} />
              </View>
              {q.done && <Text style={styles.questDone}>✓ Complete — reward claimed</Text>}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Explorer Ranks</Text>
        <View style={styles.rankLadderCard}>
          {rankLadder.map((r: any) => (
            <View key={r.num} style={[styles.rankRowItem, { backgroundColor: r.rowBg === '#eaf2ec' ? '#eaf2ec' : 'transparent' }]}>
              <View style={[styles.rankDot, { backgroundColor: firstGradientColor(r.dotBg, r.dotBg) }]}>
                <Text style={[styles.rankDotText, { color: r.dotFg }]}>{r.num}</Text>
              </View>
              <Text style={styles.rankRowName}>{r.name}</Text>
              <Text style={styles.rankRowXp}>{r.xp} XP</Text>
              {r.reached && (
                <View style={styles.rankCheck}><Text style={styles.rankCheckText}>✓</Text></View>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Memory Scrapbook</Text>
        <View style={styles.scrapGrid}>
          {scrapbook.map((sc: any, i: number) => (
            <LinearGradient key={i} colors={parseGradientColors(sc.bg) as any} style={[styles.scrapCard, { opacity: parseFloat(sc.op) }]}>
              {sc.earned && <Text style={styles.scrapLabel} numberOfLines={2}>{sc.label}</Text>}
              {sc.locked && <Text style={styles.scrapLock}>🔒</Text>}
            </LinearGradient>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Puzzle Codex · 22 Types</Text>
        <Text style={styles.codexIntro}>
          110 hand-tuned puzzles across 11 regions — 10 distinct per level (3 easy · 4 medium · 3 hard). Tap Play to try any type:
        </Text>
        <View style={styles.ageRow}>
          {ageCoverage.map((a: any, i: number) => (
            <View key={i} style={styles.ageCard}>
              <Text style={styles.ageCount}>{a.count}</Text>
              <Text style={styles.ageLabel}>{a.label}</Text>
            </View>
          ))}
        </View>
        <View style={{ gap: 8 }}>
          {codex.map((p: any) => (
            <View key={p.type} style={styles.codexCard}>
              <LinearGradient colors={[p.color, p.colorDark]} style={styles.codexIcon} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={styles.codexNameRow}>
                  <Text style={styles.codexName}>{p.name}</Text>
                  <View style={styles.ageBadge}><Text style={styles.ageBadgeText}>{p.ages}</Text></View>
                  {p.hard && <View style={styles.hardBadge}><Text style={styles.ageBadgeText}>HARD</Text></View>}
                </View>
                <Text style={styles.codexSkill} numberOfLines={1}>{p.skill} · {p.guideName}</Text>
              </View>
              <TouchableOpacity onPress={p.onPlay} activeOpacity={0.85}>
                <LinearGradient colors={['#5EA862', '#3f7d47']} style={styles.codexPlayBtn}>
                  <Text style={styles.codexPlayText}>Play</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomNav navItems={vals.navItems || []} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingTop: 56, paddingHorizontal: 16, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontFamily: FONT.baloo.bold, fontSize: 26, color: '#3a2a1c' },
  rankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -8 },
  rankLine: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#7a6a58' },
  parentBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff8ef', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 7 },
  parentBtnText: { fontFamily: FONT.nunito.extrabold, fontSize: 11.5, color: '#37474F' },
  xpCard: { backgroundColor: '#fff8ef', borderRadius: 18, padding: 16 },
  xpHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 },
  xpTotal: { fontFamily: FONT.baloo.bold, fontSize: 15, color: '#3a2a1c' },
  xpToNext: { fontFamily: FONT.nunito.bold, fontSize: 11, color: '#9a8a76' },
  xpTrack: { height: 12, borderRadius: 7, backgroundColor: '#e7ddcb', overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 7 },
  eventBanner: { borderRadius: 20, padding: 16 },
  eventTag: { fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#fff', opacity: 0.85, textTransform: 'uppercase', letterSpacing: 1 },
  eventTitle: { fontFamily: FONT.baloo.bold, fontSize: 20, color: '#fff' },
  eventSub: { fontFamily: FONT.nunito.semibold, fontSize: 12, color: '#fff', opacity: 0.9, marginTop: 2 },
  replayBanner: { borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 12 },
  replayIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FFD86B' },
  replayTag: { fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#FFD86B', textTransform: 'uppercase', letterSpacing: 1 },
  replayTitle: { fontFamily: FONT.baloo.bold, fontSize: 17, color: '#EDF3FF' },
  replayArrow: { fontSize: 20, color: '#FFD86B' },
  sectionTitle: { fontFamily: FONT.baloo.bold, fontSize: 15, color: '#3a2a1c' },
  questCard: { backgroundColor: '#fff8ef', borderRadius: 16, padding: 13 },
  questTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 },
  questType: { fontFamily: FONT.nunito.extrabold, fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  questReward: { fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#9a8a76' },
  questTitleText: { fontFamily: FONT.nunito.bold, fontSize: 13.5, color: '#3a2a1c' },
  questCount: { fontFamily: FONT.nunito.extrabold, fontSize: 11 },
  questTrack: { height: 7, borderRadius: 5, backgroundColor: '#e7ddcb', overflow: 'hidden' },
  questFill: { height: '100%', borderRadius: 5 },
  questDone: { fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#3f7d47', marginTop: 6 },
  rankLadderCard: { backgroundColor: '#fff8ef', borderRadius: 18, padding: 6 },
  rankRowItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12 },
  rankDot: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rankDotText: { fontFamily: FONT.baloo.extrabold, fontSize: 13 },
  rankRowName: { flex: 1, fontFamily: FONT.nunito.extrabold, fontSize: 13, color: '#3a2a1c' },
  rankRowXp: { fontFamily: FONT.nunito.bold, fontSize: 11, color: '#9a8a76' },
  rankCheck: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#3f7d47', alignItems: 'center', justifyContent: 'center' },
  rankCheckText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  scrapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  scrapCard: { width: '22%', aspectRatio: 0.75, borderRadius: 12, padding: 6, justifyContent: 'flex-end', alignItems: 'center' },
  scrapLabel: { fontFamily: FONT.nunito.extrabold, fontSize: 8.5, color: '#fff', textAlign: 'center' },
  scrapLock: { fontSize: 17, opacity: 0.85 },
  codexIntro: { fontFamily: FONT.nunito.semibold, fontSize: 12, color: '#7a6a58', marginTop: -8 },
  ageRow: { flexDirection: 'row', gap: 6 },
  ageCard: { flex: 1, backgroundColor: '#fff8ef', borderRadius: 12, paddingVertical: 8, alignItems: 'center' },
  ageCount: { fontFamily: FONT.baloo.extrabold, fontSize: 17, color: '#3f7d47' },
  ageLabel: { fontFamily: FONT.nunito.extrabold, fontSize: 9, color: '#9a8a76' },
  codexCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff8ef', borderRadius: 14, padding: 11 },
  codexIcon: { width: 38, height: 38, borderRadius: 11 },
  codexNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  codexName: { fontFamily: FONT.nunito.extrabold, fontSize: 13, color: '#3a2a1c' },
  ageBadge: { backgroundColor: '#5EA862', borderRadius: 9, paddingHorizontal: 7, paddingVertical: 1 },
  hardBadge: { backgroundColor: '#C0392B', borderRadius: 9, paddingHorizontal: 6, paddingVertical: 1 },
  ageBadgeText: { fontFamily: FONT.nunito.extrabold, fontSize: 9, color: '#fff' },
  codexSkill: { fontFamily: FONT.nunito.semibold, fontSize: 10.5, color: '#7a6a58', marginTop: 2 },
  codexPlayBtn: { borderRadius: 18, paddingHorizontal: 16, paddingVertical: 9 },
  codexPlayText: { fontFamily: FONT.baloo.bold, fontSize: 13, color: '#fff' },
});
