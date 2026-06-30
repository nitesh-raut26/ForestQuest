import React, { useId } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Path } from 'react-native-svg';

// Replicates the design's rolling-hill silhouette: a full-width shape with a
// shallow dome top (CSS `border-radius:50% 50% 0 0 / domeRatio%`) filled with
// a bottom-anchored radial gradient (CSS `radial-gradient(120% 100% at cx 100%, …)`).
interface Props {
  width: number;
  height: number;
  domeRatio?: number;
  colors: string[];
  cx?: number;
  opacity?: number;
  style?: StyleProp<ViewStyle>;
}

export default function HillShape({ width, height, domeRatio = 0.4, colors, cx = 0.5, opacity = 1, style }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const domeH = height * domeRatio;
  const path = `M0,${height} L0,${domeH} Q${width * cx},0 ${width},${domeH} L${width},${height} Z`;
  return (
    <Svg width={width} height={height} style={style} opacity={opacity}>
      <Defs>
        <RadialGradient id={id} cx={`${cx * 100}%`} cy="100%" r="100%">
          {colors.map((c, i) => (
            <Stop key={i} offset={i / (colors.length - 1)} stopColor={c} />
          ))}
        </RadialGradient>
      </Defs>
      <Path d={path} fill={`url(#${id})`} />
    </Svg>
  );
}
