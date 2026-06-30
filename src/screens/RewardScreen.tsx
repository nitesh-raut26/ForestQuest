import React from 'react';
// RewardScreen component
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RadialOrb from '../components/RadialOrb';
import RadialBackdrop from '../components/RadialBackdrop';
import CharacterArt, { characterIdFromName } from '../components/CharacterArt';
import GameIcon from '../components/GameIcon';
import { FONT } from '../theme/fonts';

const { width: W, height: H } = Dimensions.get('window');

export default function RewardScreen({ vals }: Props) {
  const rw = vals.rw || {};
  const friendId = characterIdFromName(rw.creature);
  return (
    <View style={styles.container}>
      <RadialBackdrop width={W} height={H} cx={0.5} cy={0.4} colors={['rgba(74,124,89,0.55)', 'rgba(20,15,10,0.85)']} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {friendId ? (
            <View style={[styles.avatarFrame, { backgroundColor: rw.glow || '#FFC58C' }]}>
              <CharacterArt id={friendId} size={108} />
            </View>
          ) : (
            <RadialOrb size={84} glow={rw.glow || '#FFC58C'} body={rw.body || '#E8822F'} style={styles.avatar} />
          )}
          <View style={styles.stars}>
            {[0, 1, 2].map(i => <Text key={i} style={styles.star}>★</Text>)}
          </View>
          <Text style={styles.title}>{rw.title || 'Puzzle Solved!'}</Text>
          {vals.rwHasProg && <Text style={styles.ladderProg}>{rw.ladderProg}</Text>}
          <Text style={styles.creatureLine}>
            "{rw.line || 'Well done!'}"{'\n'}
            <Text style={[styles.creatureName, { color: rw.body }]}>— {rw.creature}</Text>
          </Text>

          <View style={styles.rewards}>
            <View style={[styles.rewardPill, { backgroundColor: '#f3ead9' }]}>
              <Text style={[styles.rewardVal, { color: '#8B6355' }]}>+{rw.acorns}</Text>
              <Text style={styles.rewardLabel}>Acorns</Text>
            </View>
            <View style={[styles.rewardPill, { backgroundColor: '#efe6f3' }]}>
              <Text style={[styles.rewardVal, { color: '#9B59B6' }]}>+{rw.glowDust}</Text>
              <Text style={styles.rewardLabel}>Glow Dust</Text>
            </View>
            <View style={[styles.rewardPill, { backgroundColor: '#eaf2ec' }]}>
              <Text style={[styles.rewardVal, { color: '#3f7d47' }]}>+{rw.bond}</Text>
              <Text style={styles.rewardLabel}>Bond</Text>
            </View>
          </View>
          <Text style={styles.xpLine}>
            <Text style={styles.xpVal}>+{rw.xp} XP</Text>
            <Text style={styles.xpEarned}>  earned</Text>
          </Text>

          {rw.rankedUp && (
            <LinearGradient colors={['#F5A623', '#E8822F']} style={styles.banner}>
              <Text style={styles.bannerTag}>✨ Rank Up!</Text>
              <Text style={styles.bannerTitle}>Rank {rw.newRankNum} · {rw.newRankName}</Text>
            </LinearGradient>
          )}
          {vals.rwIsEvent && (
            <LinearGradient colors={['#1565C0', '#37474F']} style={styles.banner}>
              <View style={styles.bannerIconRow}>
                <View style={styles.bannerIcon}>
                  <GameIcon kind="rising" size={26} color="#A9E8FF" secondary="#fff" />
                </View>
                <View>
                  <Text style={styles.bannerTag}>Monsoon Reward</Text>
                  <Text style={styles.bannerTitle}>+{rw.pearls} Rain Pearls</Text>
                </View>
              </View>
            </LinearGradient>
          )}
          {rw.hasUnlock && (
            <LinearGradient colors={['#F7D87C', '#E8954E']} style={styles.unlockBanner}>
              <View style={styles.unlockGuideArt}>
                <CharacterArt id="ari" size={88} />
              </View>
              <View style={styles.unlockCopy}>
                <Text style={[styles.bannerTag, { color: '#704512' }]}>Ari found a new trail!</Text>
                <Text style={[styles.bannerTitle, { color: '#3a2a1c' }]}>{rw.unlockedName}</Text>
                <Text style={[styles.bannerSub, { color: '#5d4427' }]}>
                  “The path is awake. I’ll jump there first—{rw.unlockedGuide} is waiting!”
                </Text>
              </View>
            </LinearGradient>
          )}

          <TouchableOpacity onPress={vals.rewardContinue} activeOpacity={0.88} style={{ width: '100%' }}>
            <LinearGradient colors={['#5EA862', '#3f7d47']} style={styles.continueBtn}>
              <Text style={styles.continueBtnText}>{vals.rewardBtnLabel || 'Continue'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

interface Props { vals: Record<string, any> }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#140a08' },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  card: {
    width: '100%', maxWidth: 320, backgroundColor: '#FFF8EF', borderRadius: 28,
    paddingTop: 16, paddingHorizontal: 24, paddingBottom: 24, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 30 }, shadowOpacity: 0.5, shadowRadius: 50, elevation: 20,
  },
  avatar: { marginTop: -58, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 24, elevation: 10 },
  avatarFrame: {
    width: 94, height: 94, borderRadius: 30, marginTop: -62, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 24, elevation: 10,
  },
  stars: { flexDirection: 'row', gap: 6, marginTop: 6, marginBottom: 10 },
  star: { fontSize: 22, color: '#F5A623' },
  title: { fontFamily: FONT.baloo.bold, fontSize: 24, color: '#3a2a1c', textAlign: 'center' },
  ladderProg: { fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#9a8a76', marginTop: 3 },
  creatureLine: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#7a6a58', textAlign: 'center', marginVertical: 8, lineHeight: 18 },
  creatureName: { fontFamily: FONT.nunito.extrabold },
  rewards: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  rewardPill: { flex: 1, borderRadius: 16, paddingVertical: 11, alignItems: 'center' },
  rewardVal: { fontFamily: FONT.baloo.bold, fontSize: 18 },
  rewardLabel: { fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#9a8a76', textTransform: 'uppercase' },
  xpLine: { marginBottom: 12 },
  xpVal: { fontFamily: FONT.baloo.extrabold, fontSize: 15, color: '#F5A623' },
  xpEarned: { fontFamily: FONT.nunito.bold, fontSize: 11, color: '#9a8a76' },
  banner: { width: '100%', borderRadius: 16, padding: 13, marginBottom: 14 },
  bannerIconRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bannerIcon: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center',
  },
  bannerTag: { fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#fff', textTransform: 'uppercase', letterSpacing: 1, opacity: 0.9 },
  bannerTitle: { fontFamily: FONT.baloo.bold, fontSize: 18, color: '#fff', marginTop: 1 },
  bannerSub: { fontFamily: FONT.nunito.semibold, fontSize: 11.5, color: '#fff', opacity: 0.92 },
  unlockBanner: {
    width: '100%', minHeight: 112, borderRadius: 18, marginBottom: 14, overflow: 'hidden',
    flexDirection: 'row', alignItems: 'flex-end',
  },
  unlockGuideArt: { width: 96, height: 112, alignItems: 'center', justifyContent: 'flex-end', marginLeft: -4 },
  unlockCopy: { flex: 1, paddingTop: 14, paddingRight: 12, paddingBottom: 13 },
  continueBtn: { borderRadius: 30, paddingVertical: 15, alignItems: 'center', shadowColor: '#2f5e36', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 1, shadowRadius: 0, elevation: 6 },
  continueBtnText: { fontFamily: FONT.baloo.bold, fontSize: 17, color: '#fff' },
});
