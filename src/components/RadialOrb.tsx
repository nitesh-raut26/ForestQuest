import React, { useId } from 'react';
import { ViewStyle, StyleProp, View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Circle } from 'react-native-svg';

// Replicates the design's recurring `radial-gradient(circle at 35% 30%, glow, body)`
// avatar treatment (creatures, bosses, map nodes) — expo-linear-gradient only
// does linear gradients, so this uses react-native-svg directly.
interface Props {
  size: number;
  glow: string;
  body: string;
  cx?: number;
  cy?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function RadialOrb({ size, glow, body, cx = 0.35, cy = 0.3, style, children }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Defs>
          <RadialGradient id={id} cx={`${cx * 100}%`} cy={`${cy * 100}%`} r="75%">
            <Stop offset="0" stopColor={glow} stopOpacity={1} />
            <Stop offset="1" stopColor={body} stopOpacity={1} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
      </Svg>
      {children}
    </View>
  );
}
