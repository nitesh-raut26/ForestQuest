import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FONT } from '../theme/fonts';

interface NavItem {
  label: string;
  onTap: () => void;
  color: string;
  iconBg: string;
  iconShadow: string;
}

interface Props { navItems: NavItem[] }

export default function BottomNav({ navItems }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 14 }]}>
      {navItems.map((n) => (
        <TouchableOpacity key={n.label} style={styles.tab} onPress={n.onTap} activeOpacity={0.7}>
          <View style={[styles.iconBg, { backgroundColor: n.iconBg, shadowColor: n.iconShadow === 'none' ? 'transparent' : n.color }]} />
          <Text style={[styles.label, { color: n.color }]}>{n.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
    flexDirection: 'row', backgroundColor: 'rgba(255,248,239,0.96)',
    paddingTop: 8, paddingHorizontal: 12,
    shadowColor: 'rgba(80,60,40,0.4)', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 1, shadowRadius: 20, elevation: 12,
  },
  tab: { flex: 1, alignItems: 'center', gap: 4, paddingTop: 6 },
  iconBg: {
    width: 26, height: 26, borderRadius: 9,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 3,
  },
  label: { fontFamily: FONT.nunito.extrabold, fontSize: 10 },
});
