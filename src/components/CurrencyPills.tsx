import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import RadialOrb from './RadialOrb';
import { FONT } from '../theme/fonts';

// The design has no fixed/floating HUD overlay — acorns, glow dust, and the
// daily-gift button sit inline in each screen's own header row, scrolling
// with the content (Map/Creatures/Sanctuary/Journey headers all repeat this
// exact cluster verbatim).
interface Props { acorns: number; glowDust: number; onOpenDaily?: () => void }

export default function CurrencyPills({ acorns, glowDust, onOpenDaily }: Props) {
  return (
    <View style={styles.row}>
      <TouchableOpacity onPress={onOpenDaily} activeOpacity={0.85}>
        <LinearGradient colors={['#FFE7A8', '#F5A623']} style={styles.giftBtn}>
          <Text style={{ fontSize: 16 }}>🎁</Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.pill}>
        <RadialOrb size={15} glow="#C9986A" body="#8B6355" />
        <Text style={[styles.val, { color: '#5a4a3a' }]}>{acorns}</Text>
      </View>
      <View style={styles.pill}>
        <RadialOrb size={15} glow="#E9C7FF" body="#9B59B6" />
        <Text style={[styles.val, { color: '#7a4f8a' }]}>{glowDust}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  giftBtn: {
    width: 32, height: 32, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    shadowColor: 'rgba(245,166,35,0.5)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 4,
  },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#fff8ef', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6, paddingLeft: 7,
    shadowColor: 'rgba(80,60,40,0.4)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 3,
  },
  val: { fontFamily: FONT.baloo.extrabold, fontSize: 13 },
});
