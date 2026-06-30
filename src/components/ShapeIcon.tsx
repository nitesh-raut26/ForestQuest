import React, { useId } from 'react';
import Svg, { Defs, RadialGradient, Stop, Polygon, Rect, Circle } from 'react-native-svg';

// gameLogic.js's shapeSlots/shapeTray never export the shape's `k` name (only
// `cp` clip-path and `br` border-radius survive renderVals) — so the shape is
// derived from those two CSS values directly, mirroring initShape()'s `kinds`:
//   circle:   br:'50%' cp:'none'
//   square:   br:'14%' cp:'none'
//   triangle/star: br:'0' cp:'polygon(x% y%, x% y%, …)'
function parsePolygonPoints(cp: string): string | null {
  const m = /polygon\(([^)]+)\)/.exec(cp || '');
  if (!m) return null;
  return m[1].split(',').map((pair) => {
    const [x, y] = pair.trim().split(/\s+/).map((v) => parseFloat(v));
    return `${x},${y}`;
  }).join(' ');
}

interface Props { cp: string; br: string; size: number; color?: string; glow?: string; body?: string }

export default function ShapeIcon({ cp, br, size, color, glow, body }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '');
  const fill = glow && body ? `url(#${id})` : (color || '#999');
  const points = parsePolygonPoints(cp);
  const brPct = parseFloat(br) / 100 || 0;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {glow && body && (
        <Defs>
          <RadialGradient id={id} cx="35%" cy="30%" r="75%">
            <Stop offset="0" stopColor={glow} />
            <Stop offset="1" stopColor={body} />
          </RadialGradient>
        </Defs>
      )}
      {points ? (
        <Polygon points={points} fill={fill} />
      ) : brPct >= 0.5 ? (
        <Circle cx={50} cy={50} r={49} fill={fill} />
      ) : (
        <Rect x={1} y={1} width={98} height={98} rx={brPct * 100} fill={fill} />
      )}
    </Svg>
  );
}
