import React from 'react';
import Svg, {
  Circle, Ellipse, G, Line, Path, Polygon, Polyline, Rect, Text as SvgText,
} from 'react-native-svg';

interface Props {
  kind: string;
  size?: number;
  color?: string;
  secondary?: string;
}

export default function GameIcon({
  kind,
  size = 28,
  color = '#FFFFFF',
  secondary = '#FFD86B',
}: Props) {
  const key = (kind || '').toLowerCase();
  const stroke = {
    stroke: color,
    strokeWidth: 6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };

  function glyph() {
    switch (key) {
      case 'colour':
        return <G><Circle cx="34" cy="42" r="17" fill="#FF796B" /><Circle cx="62" cy="42" r="17" fill="#FFD45C" /><Circle cx="48" cy="65" r="17" fill="#65D7CB" /></G>;
      case 'shape':
        return <G><Circle cx="24" cy="62" r="13" fill={color} /><Rect x="43" y="49" width="26" height="26" rx="5" fill={secondary} /><Polygon points="50,18 72,43 28,43" fill={color} /></G>;
      case 'word':
        return <G><Path d="M18 24 Q35 18 48 28 V76 Q35 66 18 72 Z" fill={color} opacity=".95" /><Path d="M82 24 Q65 18 52 28 V76 Q65 66 82 72 Z" fill={secondary} /><Line x1="50" y1="28" x2="50" y2="76" stroke="#60492F" strokeWidth="4" /></G>;
      case 'odd':
        return <G><Circle cx="30" cy="30" r="10" fill={color} /><Circle cx="70" cy="30" r="10" fill={color} /><Circle cx="30" cy="70" r="10" fill={color} /><Polygon points="70,56 74,66 85,66 76,73 80,84 70,77 60,84 64,73 55,66 66,66" fill={secondary} /></G>;
      case 'count':
        return <G><Circle cx="25" cy="30" r="9" fill={color} /><Circle cx="50" cy="25" r="9" fill={secondary} /><Circle cx="75" cy="32" r="9" fill={color} /><Circle cx="35" cy="65" r="9" fill={secondary} /><Circle cx="66" cy="68" r="9" fill={color} /></G>;
      case 'maze':
        return <G><Path d="M18 78V20H78V64H36V38H62V50" {...stroke} /><Circle cx="18" cy="80" r="7" fill={secondary} /><Polygon points="75,50 87,58 75,66" fill={secondary} /></G>;
      case 'memory':
        return <G><Rect x="18" y="24" width="30" height="42" rx="7" fill={color} opacity=".92" /><Rect x="52" y="34" width="30" height="42" rx="7" fill={secondary} /><Circle cx="33" cy="45" r="7" fill="#745B3D" /><Circle cx="67" cy="55" r="7" fill="#745B3D" /></G>;
      case 'sequence':
        return <G><Rect x="14" y="64" width="19" height="18" rx="5" fill={color} /><Rect x="40" y="46" width="19" height="36" rx="5" fill={secondary} /><Rect x="66" y="26" width="19" height="56" rx="5" fill={color} /><Polyline points="20,52 48,30 73,16" {...stroke} /></G>;
      case 'pattern':
        return <G><Polyline points="15,65 32,35 49,65 66,35 84,65" {...stroke} /><Circle cx="15" cy="65" r="6" fill={secondary} /><Circle cx="49" cy="65" r="6" fill={secondary} /><Circle cx="84" cy="65" r="6" fill={secondary} /></G>;
      case 'sound':
        return <G><Path d="M20 58H34L52 74V26L34 42H20Z" fill={color} /><Path d="M62 38Q78 50 62 64M71 28Q96 50 71 75" {...stroke} /></G>;
      case 'trace':
        return <G><Path d="M18 72Q35 25 57 55Q72 76 84 28" {...stroke} strokeDasharray="8 8" /><Polygon points="78,17 89,27 80,36 69,25" fill={secondary} /></G>;
      case 'flow':
        return <G><Path d="M17 68H39V31H64V52H84" {...stroke} /><Circle cx="17" cy="68" r="8" fill={secondary} /><Polygon points="83,42 94,52 83,62" fill={secondary} /></G>;
      case 'weight':
        return <G><Line x1="50" y1="20" x2="50" y2="78" {...stroke} /><Line x1="20" y1="34" x2="80" y2="34" {...stroke} /><Path d="M20 36L11 62H29Z" fill={color} /><Path d="M80 36L67 69H93Z" fill={secondary} /><Line x1="32" y1="80" x2="68" y2="80" {...stroke} /></G>;
      case 'rune':
        return <G><Polygon points="50,12 82,31 82,69 50,88 18,69 18,31" fill={color} opacity=".2" stroke={color} strokeWidth="5" /><Path d="M35 69L49 28 66 69M41 52H60" {...stroke} /></G>;
      case 'light':
        return <G><Polygon points="45,24 70,66 22,66" fill={color} opacity=".9" /><Line x1="8" y1="45" x2="39" y2="45" stroke={secondary} strokeWidth="7" /><Line x1="57" y1="46" x2="91" y2="27" stroke="#FF7B72" strokeWidth="6" /><Line x1="59" y1="52" x2="94" y2="52" stroke="#65D7CB" strokeWidth="6" /><Line x1="57" y1="58" x2="91" y2="76" stroke="#8F7AE5" strokeWidth="6" /></G>;
      case 'shadow':
        return <G><Polygon points="34,24 58,34 58,62 34,74 12,62 12,34" fill={color} /><Polyline points="34,24 34,51 58,62M34,51 12,34M34,51 58,34" stroke="#5B4779" strokeWidth="4" fill="none" /><Ellipse cx="69" cy="72" rx="25" ry="10" fill={secondary} opacity=".55" /></G>;
      case 'number':
        return <G><SvgText x="10" y="69" fontSize="54" fontWeight="900" fill={color}>1</SvgText><SvgText x="41" y="69" fontSize="54" fontWeight="900" fill={secondary}>2</SvgText><SvgText x="70" y="69" fontSize="38" fontWeight="900" fill={color}>3</SvgText></G>;
      case 'matrix':
        return <G>{[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => <Rect key={`${r}-${c}`} x={18 + c * 23} y={18 + r * 23} width="16" height="16" rx="4" fill={(r + c) % 2 ? secondary : color} opacity={(r === 1 && c === 1) ? 1 : .72} />))}</G>;
      case 'slide':
        return <G>{[0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => (r === 2 && c === 2) ? null : <Rect key={`${r}-${c}`} x={15 + c * 24} y={15 + r * 24} width="20" height="20" rx="4" fill={(r + c) % 2 ? secondary : color} />))}</G>;
      case 'hanoi':
        return <G><Line x1="13" y1="80" x2="87" y2="80" {...stroke} /><Line x1="50" y1="25" x2="50" y2="78" {...stroke} /><Rect x="22" y="65" width="56" height="11" rx="5" fill={color} /><Rect x="29" y="51" width="42" height="11" rx="5" fill={secondary} /><Rect x="37" y="37" width="26" height="11" rx="5" fill={color} /></G>;
      case 'eqn':
        return <G><Line x1="14" y1="34" x2="38" y2="34" {...stroke} /><Line x1="26" y1="22" x2="26" y2="46" {...stroke} /><Line x1="57" y1="29" x2="85" y2="29" {...stroke} /><Line x1="57" y1="43" x2="85" y2="43" {...stroke} /><Circle cx="50" cy="72" r="10" fill={secondary} /></G>;
      case 'dots':
        return <G><Polyline points="16,70 30,30 53,55 78,22 85,74" {...stroke} /><Circle cx="16" cy="70" r="7" fill={secondary} /><Circle cx="30" cy="30" r="7" fill={secondary} /><Circle cx="53" cy="55" r="7" fill={secondary} /><Circle cx="78" cy="22" r="7" fill={secondary} /><Circle cx="85" cy="74" r="7" fill={secondary} /></G>;

      case 'flood':
        return <G><Rect x="25" y="20" width="50" height="52" rx="5" fill={color} /><Line x1="38" y1="20" x2="38" y2="72" stroke="#52718D" strokeWidth="6" /><Line x1="62" y1="20" x2="62" y2="72" stroke="#52718D" strokeWidth="6" /><Path d="M10 78Q23 65 36 78T62 78T90 78" {...stroke} stroke={secondary} /></G>;
      case 'recall':
        return <G><Path d="M24 57Q16 34 38 27Q50 10 66 28Q88 31 79 57Z" fill={color} /><Polygon points="48,49 64,49 54,67 67,67 42,91 48,72 37,72" fill={secondary} /></G>;
      case 'rising':
        return <G><Path d="M50 12C50 12 25 43 25 63A25 25 0 0050 88A25 25 0 0075 63C75 43 50 12 50 12Z" fill={color} /><Circle cx="42" cy="58" r="7" fill={secondary} opacity=".8" /></G>;
      case 'bridge':
      case 'arch':
        return <G><Path d="M13 76A37 37 0 0187 76" stroke="#FF6B6B" strokeWidth="10" fill="none" /><Path d="M21 77A29 29 0 0179 77" stroke="#FFD65A" strokeWidth="9" fill="none" /><Path d="M29 78A21 21 0 0171 78" stroke="#6FD6B0" strokeWidth="8" fill="none" /><Path d="M37 79A13 13 0 0163 79" stroke="#7E78D2" strokeWidth="7" fill="none" /></G>;
      case 'glyph':
        return <G><Circle cx="50" cy="50" r="36" {...stroke} /><Path d="M50 18Q72 34 51 50Q30 66 50 82M18 50Q34 28 50 50Q66 72 82 50" {...stroke} /></G>;
      case 'cloak':
        return <G><Path d="M40 18Q50 11 60 18L76 77Q50 90 24 77Z" fill={color} /><Path d="M40 20Q50 34 60 20" {...stroke} stroke={secondary} /><Circle cx="50" cy="27" r="5" fill={secondary} /></G>;
      case 'lantern':
        return <G><Path d="M35 26Q34 10 50 10Q66 10 65 26" {...stroke} /><Rect x="28" y="28" width="44" height="50" rx="9" fill={color} /><Rect x="37" y="38" width="26" height="28" rx="7" fill={secondary} /><Line x1="28" y1="80" x2="72" y2="80" {...stroke} /></G>;

      case 'meadow':
        return <G><Circle cx="50" cy="48" r="11" fill={secondary} />{[0, 60, 120, 180, 240, 300].map((deg) => <Ellipse key={deg} cx="50" cy="23" rx="10" ry="17" fill={color} transform={`rotate(${deg} 50 48)`} />)}<Line x1="50" y1="60" x2="50" y2="88" {...stroke} /></G>;
      case 'brook':
        return <G><Path d="M50 12C50 12 27 42 27 61A23 23 0 0050 84A23 23 0 0073 61C73 42 50 12 50 12Z" fill={color} /><Path d="M14 80Q30 68 46 80T78 80" {...stroke} stroke={secondary} /></G>;
      case 'hollow':
        return <G><Path d="M16 70Q50 8 84 70Z" fill={color} /><Rect x="44" y="64" width="12" height="22" rx="5" fill={secondary} /><Circle cx="34" cy="45" r="5" fill={secondary} /><Circle cx="62" cy="38" r="4" fill={secondary} /></G>;
      case 'shore':
        return <G><Polygon points="50,12 71,42 61,83 38,83 28,42" fill={color} /><Polyline points="50,12 50,83M28,42 71,42M38,83 71,42" stroke={secondary} strokeWidth="4" fill="none" /></G>;
      case 'cavern':
        return <G><Path d="M12 83Q20 25 50 17Q80 25 88 83Z" fill={color} /><Path d="M31 83Q36 49 50 43Q64 49 69 83Z" fill="#44305F" /><Circle cx="50" cy="51" r="6" fill={secondary} /></G>;
      case 'canopy':
        return <G><Path d="M50 14Q76 22 82 47Q76 76 50 88Q22 74 18 48Q24 22 50 14Z" fill={color} /><Path d="M50 25V76M50 49L69 37M49 60L31 47" {...stroke} stroke={secondary} /></G>;
      case 'heights':
        return <G><Circle cx="50" cy="47" r="8" fill={secondary} /><Line x1="50" y1="55" x2="50" y2="88" {...stroke} />{[0, 90, 180, 270].map((deg) => <Path key={deg} d="M50 43Q55 19 72 14Q70 34 55 49Z" fill={color} transform={`rotate(${deg} 50 47)`} />)}</G>;
      case 'roots':
        return <G><Path d="M50 15V56M50 30L28 45M50 38L72 52M50 54L24 82M50 54L50 87M50 54L78 82" {...stroke} /><Circle cx="50" cy="18" r="9" fill={secondary} /></G>;
      case 'highlands':
        return <G><Polygon points="10,78 34,37 49,60 65,26 91,78" fill={color} /><Path d="M12 85Q30 72 48 85T88 85" {...stroke} stroke={secondary} /></G>;
      case 'skyroot':
        return <G><Path d="M50 87V42M50 54L27 34M50 62L74 41" {...stroke} /><Circle cx="27" cy="29" r="17" fill={color} /><Circle cx="52" cy="24" r="22" fill={secondary} /><Circle cx="75" cy="35" r="16" fill={color} /></G>;
      case 'stardust':
        return <Polygon points="50,10 60,38 90,38 66,56 76,86 50,68 24,86 34,56 10,38 40,38" fill={secondary} />;
      default:
        return <Polygon points="50,15 59,39 85,39 64,55 72,82 50,66 28,82 36,55 15,39 41,39" fill={color} />;
    }
  }

  return <Svg width={size} height={size} viewBox="0 0 100 100">{glyph()}</Svg>;
}
// Minor update
