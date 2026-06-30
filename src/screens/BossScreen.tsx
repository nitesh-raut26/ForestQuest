import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import RadialBackdrop from '../components/RadialBackdrop';
import RadialOrb from '../components/RadialOrb';
import { FONT } from '../theme/fonts';
import { firstGradientColor } from '../utils/parseGradient';

const { width: W, height: H } = Dimensions.get('window');

interface Props { vals: Record<string, any> }

export default function BossScreen({ vals }: Props) {
  const bs = vals.bs || {};
  const hearts = vals.bossHearts || [];
  const options = vals.bossOptions || [];
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 1200, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={styles.container}>
      <RadialBackdrop width={W} height={H} cx={0.5} cy={0.32} colors={[bs.glow || '#c084fc', 'rgba(20,15,10,0.92)']} stops={[0, 0.72]} />

      <View style={styles.headerText}>
        <Text style={styles.label}>REGION BOSS</Text>
        <Text style={styles.bossName}>{bs.name || 'Boss'}</Text>
      </View>

      <View style={styles.hearts}>
        {hearts.map((h: any, i: number) => (
          <View key={i} style={[styles.heart, { backgroundColor: firstGradientColor(h.bg, 'rgba(255,255,255,0.18)') }]} />
        ))}
      </View>

      <Animated.View style={{ transform: [{ translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) }] }}>
        <RadialOrb size={150} glow={bs.glow || '#c084fc'} body={bs.body || '#8B5CF6'} cx={0.38} cy={0.32} style={styles.bossAvatar}>
          <View style={styles.eyeRow}>
            <View style={styles.eye} />
            <View style={styles.eye} />
          </View>
        </RadialOrb>
      </Animated.View>

      <Text style={styles.instruction}>Match the glowing weak point to strike!</Text>
      <View style={[styles.targetBox, { shadowColor: bs.glow || '#c084fc' }]}>
        <Text style={styles.targetSym}>{bs.target}</Text>
      </View>

      <View style={styles.options}>
        {options.map((o: any, i: number) => (
          <TouchableOpacity key={i} style={styles.optBtn} onPress={o.onTap} activeOpacity={0.85}>
            <Text style={styles.optSym}>{o.sym}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#140a08' },
  headerText: { position: 'absolute', top: 54, left: 0, right: 0, alignItems: 'center' },
  label: { fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#FFD54F', letterSpacing: 2, textTransform: 'uppercase' },
  bossName: { fontFamily: FONT.baloo.extrabold, fontSize: 24, color: '#fff' },
  hearts: { position: 'absolute', top: 118, left: 40, right: 40, flexDirection: 'row', gap: 6 },
  heart: { flex: 1, height: 10, borderRadius: 6 },
  bossAvatar: {
    position: 'absolute', top: 160, alignSelf: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 40, elevation: 20,
  },
  eyeRow: { flexDirection: 'row', gap: 22, marginTop: -6 },
  eye: { width: 16, height: 22, borderRadius: 8, backgroundColor: '#1a1208' },
  instruction: { position: 'absolute', top: 336, left: 0, right: 0, textAlign: 'center', fontFamily: FONT.nunito.bold, fontSize: 13, color: '#fff', opacity: 0.9 },
  targetBox: {
    position: 'absolute', top: 364, alignSelf: 'center', width: 74, height: 74, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 18, elevation: 10,
  },
  targetSym: { fontSize: 36, color: '#FFE7A8' },
  options: { position: 'absolute', bottom: 64, left: 0, right: 0, flexDirection: 'row', gap: 14, justifyContent: 'center' },
  optBtn: {
    width: 78, height: 78, borderRadius: 20, backgroundColor: 'rgba(255,248,239,0.95)', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 18, elevation: 8,
  },
  optSym: { fontSize: 36, color: '#3a2a1c' },
});
