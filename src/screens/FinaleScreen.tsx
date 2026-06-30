import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CharacterArt from '../components/CharacterArt';
import { FONT } from '../theme/fonts';

interface Props { vals: Record<string, any> }

function Star({ x, y, size, op, dur, delay }: any) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(t, { toValue: 1, duration: (dur * 1000) / 2, delay: delay * 1000, useNativeDriver: true }),
      Animated.timing(t, { toValue: 0, duration: (dur * 1000) / 2, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);
  const baseOp = parseFloat(op) || 0;
  if (baseOp <= 0) return null;
  return (
    <Animated.View style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`, width: size, height: size, borderRadius: size / 2,
      backgroundColor: '#FFF3C4', opacity: t.interpolate({ inputRange: [0, 1], outputRange: [baseOp * 0.6, baseOp] }),
    }} />
  );
}

export default function FinaleScreen({ vals }: Props) {
  const guides = vals.finaleGuides || [];
  const stars = vals.finaleStars || [];
  const guidesOp = parseFloat(vals.finaleGuidesOp || '0');

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#3f7bb0', '#1d4a7a', '#112f54', '#08203c']} locations={[0, 0.4, 0.7, 1]} style={StyleSheet.absoluteFillObject} />

      {stars.map((st: any, i: number) => <Star key={i} {...st} />)}

      <View style={[styles.moon, { opacity: parseFloat(vals.finaleMoonA || '0.2') }]} />
      <View style={styles.horizon} />

      <View style={[styles.guidesRow, { opacity: guidesOp }]} pointerEvents="none">
        {guides.map((g: any) => (
          <View key={g.id} style={[styles.guideDot, { left: `${g.x}%` }]}>
            <View style={[styles.guideGlow, { backgroundColor: g.glow }]}>
              <CharacterArt id={g.id} size={62} />
            </View>
          </View>
        ))}
      </View>
      <View style={[styles.avatarFigure, { opacity: guidesOp }]} pointerEvents="none">
        <CharacterArt id="ari" size={88} />
      </View>

      <View style={styles.captionTop}>
        {vals.finaleShowTitle && (
          <>
            <Text style={styles.kicker}>Forest Quest</Text>
            <Text style={styles.endTitle}>The Sky Awakes</Text>
          </>
        )}
      </View>
      <View style={styles.captionBottom}>
        <Text style={styles.caption}>{vals.finaleCaption}</Text>
      </View>

      {vals.finaleEnded && (
        <View style={styles.controlsCenter}>
          <TouchableOpacity onPress={vals.finaleDone} activeOpacity={0.88}>
            <LinearGradient colors={['#FFE7A8', '#F5C95E']} style={styles.doneBtn}>
              <Text style={styles.doneBtnText}>Return to the Forest</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      {vals.finaleShowSkip && (
        <TouchableOpacity style={styles.skipBtn} onPress={vals.finaleSkip} activeOpacity={0.8}>
          <Text style={styles.skipText}>Skip ›</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08203c' },
  moon: { position: 'absolute', top: '9%', left: '50%', marginLeft: -60, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,246,218,0.5)' },
  horizon: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '34%', backgroundColor: '#154873', borderTopLeftRadius: 999, borderTopRightRadius: 999 },
  guidesRow: { position: 'absolute', bottom: '18%', left: 0, right: 0, height: 70 },
  guideDot: { position: 'absolute', bottom: 0, marginLeft: -26 },
  guideGlow: {
    width: 54, height: 54, borderRadius: 18, overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 8,
  },
  avatarFigure: {
    position: 'absolute', bottom: '14.5%', left: '50%', marginLeft: -44, width: 88, height: 88,
    alignItems: 'center', justifyContent: 'center',
  },
  captionTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '46%', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 38 },
  kicker: { fontFamily: FONT.baloo.extrabold, fontSize: 13, letterSpacing: 5, color: '#FFD86B', textTransform: 'uppercase', marginBottom: 10 },
  endTitle: { fontFamily: FONT.baloo.extrabold, fontSize: 34, color: '#fff', textAlign: 'center', lineHeight: 36 },
  captionBottom: { position: 'absolute', bottom: '30%', left: 0, right: 0, paddingHorizontal: 40, minHeight: 60 },
  caption: { fontFamily: FONT.baloo.semibold, fontSize: 17, lineHeight: 24, color: '#EAF3FF', textAlign: 'center' },
  controlsCenter: { position: 'absolute', bottom: 48, left: 0, right: 0, alignItems: 'center' },
  doneBtn: { paddingHorizontal: 44, paddingVertical: 15, borderRadius: 34 },
  doneBtnText: { fontFamily: FONT.baloo.bold, fontSize: 18, color: '#0c2746' },
  skipBtn: { position: 'absolute', top: 50, right: 18, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 7 },
  skipText: { fontFamily: FONT.nunito.extrabold, fontSize: 12, color: '#EAF3FF' },
});
