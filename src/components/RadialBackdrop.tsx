import React, { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

// Full-bleed version of the design's `radial-gradient(circle at cx cy, …)`
// screen backgrounds (Puzzle, Boss, Reward overlay, Daily Chest overlay).
interface Props {
  width: number;
  height: number;
  cx?: number;
  cy?: number;
  colors: string[];
  stops?: number[];
}

export default function RadialBackdrop({ width, height, cx = 0.5, cy = 0.3, colors, stops }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const r = Math.max(width, height);
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
      <Defs>
        <RadialGradient id={id} cx={cx * width} cy={cy * height} r={r} gradientUnits="userSpaceOnUse">
          {colors.map((c, i) => (
            <Stop key={i} offset={stops ? stops[i] : i / (colors.length - 1)} stopColor={c} />
          ))}
        </RadialGradient>
      </Defs>
      <Rect x={0} y={0} width={width} height={height} fill={`url(#${id})`} />
    </Svg>
  );
}
