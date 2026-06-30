import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RadialOrb from '../components/RadialOrb';
import RadialBackdrop from '../components/RadialBackdrop';
import { FONT } from '../theme/fonts';
import {
  ColourPuzzle, MemoryPuzzle, FlowPuzzle, ShapePuzzle, SequencePuzzle,
  WeightPuzzle, LightPuzzle, ShadowPuzzle, RunePuzzle, RecallPuzzle,
  NumberPuzzle, SlidePuzzle, HanoiPuzzle, EqnPuzzle, DotsPuzzle,
  WordPuzzle, TracePuzzle, OddPuzzle, CountPuzzle, MazePuzzle,
} from '../puzzles/AllPuzzles';

const { width: W, height: H } = Dimensions.get('window');

interface Props { vals: Record<string, any> }

function PuzzleBody({ vals }: Props) {
  // gameLogic.js's renderVals() never exposes a `puzzleType` string — the
  // verbatim template dispatches on these per-type booleans instead.
  if (vals.isColour) return <ColourPuzzle vals={vals} />;
  if (vals.isMemory) return <MemoryPuzzle vals={vals} />;
  if (vals.isFlow) return <FlowPuzzle vals={vals} />;
  if (vals.isShape) return <ShapePuzzle vals={vals} />;
  if (vals.isSequence) return <SequencePuzzle vals={vals} />;
  if (vals.isWeight) return <WeightPuzzle vals={vals} />;
  if (vals.isLight) return <LightPuzzle vals={vals} />;
  if (vals.isShadow) return <ShadowPuzzle vals={vals} />;
  if (vals.isRune) return <RunePuzzle vals={vals} />;
  if (vals.isRecall) return <RecallPuzzle vals={vals} />;
  if (vals.isNumber) return <NumberPuzzle vals={vals} />;
  if (vals.isSlide) return <SlidePuzzle vals={vals} />;
  if (vals.isHanoi) return <HanoiPuzzle vals={vals} />;
  if (vals.isEqn) return <EqnPuzzle vals={vals} />;
  if (vals.isDots) return <DotsPuzzle vals={vals} />;
  if (vals.isWord) return <WordPuzzle vals={vals} />;
  if (vals.isTrace) return <TracePuzzle vals={vals} />;
  if (vals.isOdd) return <OddPuzzle vals={vals} />;
  if (vals.isCount) return <CountPuzzle vals={vals} />;
  if (vals.isMaze) return <MazePuzzle vals={vals} />;
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 18 }}>Loading puzzle…</Text></View>;
}

export default function PuzzleScreen({ vals }: Props) {
  const attempts: any[] = vals.attemptDots || [];
  const isLadder = vals.isLadderPuzzle;

  return (
    <View style={styles.container}>
      <RadialBackdrop
        width={W} height={H} cx={0.5} cy={0.3}
        colors={['rgba(74,124,89,0.35)', 'rgba(20,15,10,0.78)']}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={vals.exitPuzzle} style={styles.backBtn} activeOpacity={0.85}>
          <Text style={styles.backText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.titleBox}>
          <Text style={styles.puzzleTitle} numberOfLines={1}>{vals.puzzleTitle}</Text>
          {isLadder && (
            <View style={styles.ladderRow}>
              <Text style={styles.ladderLabel}>{vals.ladderLabel}</Text>
              {vals.showPuzzleTier && (
                <View style={[styles.tierBadge, { backgroundColor: vals.puzzleTierColor }]}>
                  <Text style={styles.tierBadgeText}>{vals.puzzleTierLabel}</Text>
                </View>
              )}
            </View>
          )}
          <View style={styles.dots}>
            {attempts.map((d: any, i: number) => (
              <View key={i} style={[styles.attemptDot, { backgroundColor: d.color }]} />
            ))}
          </View>
        </View>
        <TouchableOpacity onPress={vals.toggleHint} activeOpacity={0.85}>
          <LinearGradient colors={['#FFE7A8', '#F5C95E']} style={styles.hintBtn}>
            <Text style={styles.hintBtnText}>Nudge?</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Creature hint bubble */}
      {vals.hintOpen && (
        <View style={styles.hintRow}>
          <RadialOrb size={42} glow={vals.pgGlow || '#FFC58C'} body={vals.pgBody || '#E8822F'} style={styles.hintAvatar} />
          <View style={styles.hintBubble}>
            <Text style={[styles.hintName, { color: vals.pgBody || '#E8822F' }]}>{vals.pgName}</Text>
            <Text style={styles.hintText}>{vals.hintText}</Text>
          </View>
        </View>
      )}

      {/* Puzzle body */}
      <View style={styles.body}>
        <PuzzleBody vals={vals} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#140a08' },
  header: {
    position: 'absolute', top: 54, left: 0, right: 0, zIndex: 2,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,248,239,0.92)', alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontFamily: FONT.baloo.extrabold, fontSize: 18, color: '#3a2a1c' },
  titleBox: { flex: 1, alignItems: 'center', gap: 4 },
  puzzleTitle: { fontFamily: FONT.baloo.bold, fontSize: 18, color: '#fff' },
  ladderRow: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  ladderLabel: { fontFamily: FONT.nunito.extrabold, fontSize: 10, color: '#FFD86B', letterSpacing: 0.3 },
  tierBadge: { paddingHorizontal: 7, paddingVertical: 1, borderRadius: 9 },
  tierBadgeText: { fontFamily: FONT.nunito.extrabold, fontSize: 9, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.4 },
  dots: { flexDirection: 'row', gap: 5 },
  attemptDot: { width: 8, height: 8, borderRadius: 4 },
  hintBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  hintBtnText: { fontFamily: FONT.nunito.extrabold, fontSize: 12, color: '#3a2a1c' },
  hintRow: { position: 'absolute', top: 108, left: 18, right: 18, zIndex: 2, flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  hintAvatar: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 6 },
  hintBubble: {
    flex: 1, backgroundColor: '#fff8ef', borderRadius: 16, borderTopLeftRadius: 4, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 8,
  },
  hintName: { fontFamily: FONT.nunito.extrabold, fontSize: 11 },
  hintText: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#3a2a1c', lineHeight: 17 },
  body: { flex: 1, paddingTop: 178 },
});
