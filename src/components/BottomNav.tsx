import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Polygon } from 'react-native-svg';
import { FONT } from '../theme/fonts';

interface NavItem {
  label: string;
  onTap: () => void;
  color: string;
  iconBg: string;
  iconShadow: string;
}

interface Props { navItems: NavItem[] }

// SVG icons derived by label — white fill so they pop on both active & inactive iconBg colors.
function NavIcon({ label, active }: { label: string; active: boolean }) {
  const fill = '#fff';
  const opacity = active ? 1 : 0.85;
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" opacity={opacity}>
      {label === 'Map' && (
        // Location pin — circle at top, tapers to a point at the bottom
        <Path
          fill={fill}
          d="M12 2C8.68 2 6 4.68 6 8c0 4.8 6 12.5 6 12.5S18 12.8 18 8c0-3.32-2.68-6-6-6zm0 8.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        />
      )}
      {label === 'Friends' && (
        // Paw print — four small toe pads + one large central pad
        <>
          <Circle cx="8.5"  cy="6.5"  r="2.1"  fill={fill} />
          <Circle cx="15.5" cy="6.5"  r="2.1"  fill={fill} />
          <Circle cx="5.2"  cy="11.5" r="1.9"  fill={fill} />
          <Circle cx="18.8" cy="11.5" r="1.9"  fill={fill} />
          <Path
            fill={fill}
            d="M12 10.5c-3.6 0-6.5 2.6-6.5 5.8 0 2.3 2.9 4.2 6.5 4.2s6.5-1.9 6.5-4.2c0-3.2-2.9-5.8-6.5-5.8z"
          />
        </>
      )}
      {label === 'Home' && (
        // House — triangle roof + rectangular body + door
        <Path
          fill={fill}
          d="M12 3L2 11h3v9h6v-5h2v5h6v-9h3L12 3z"
        />
      )}
      {label === 'Journey' && (
        // 5-pointed star — outer r=10, inner r=4, centred at (12,12)
        <Polygon
          points="12,2 14.35,8.76 21.51,8.91 15.8,13.24 17.88,20.09 12,16 6.12,20.09 8.2,13.24 2.49,8.91 9.65,8.76"
          fill={fill}
        />
      )}
    </Svg>
  );
}

export default function BottomNav({ navItems }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom + 14 }]}>
      {navItems.map((n) => {
        const active = n.color === '#3a2a1c'; // active tab has dark label color
        return (
          <TouchableOpacity key={n.label} style={styles.tab} onPress={n.onTap} activeOpacity={0.7}>
            <View style={[
              styles.iconBg,
              {
                backgroundColor: n.iconBg,
                shadowColor: active ? n.iconBg : 'transparent',
              },
            ]}>
              <NavIcon label={n.label} active={active} />
            </View>
            <Text style={[styles.label, { color: n.color }]}>{n.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 50,
    flexDirection: 'row', backgroundColor: 'rgba(255,248,239,0.97)',
    paddingTop: 8, paddingHorizontal: 12,
    shadowColor: 'rgba(80,60,40,0.4)', shadowOffset: { width: 0, height: -6 }, shadowOpacity: 1, shadowRadius: 20, elevation: 12,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(200,185,165,0.6)',
  },
  tab: { flex: 1, alignItems: 'center', gap: 4, paddingTop: 6 },
  iconBg: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.45, shadowRadius: 10, elevation: 4,
  },
  label: { fontFamily: FONT.nunito.extrabold, fontSize: 10 },
});
