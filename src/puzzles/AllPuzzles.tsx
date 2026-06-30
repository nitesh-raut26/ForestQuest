import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import RadialOrb from '../components/RadialOrb';
import ShapeIcon from '../components/ShapeIcon';
import { FONT } from '../theme/fonts';
import { firstGradientColor, parseGradientColors } from '../utils/parseGradient';

interface Props { vals: Record<string, any> }

// ── Colour Match ─────────────────────────────────────────────────────────────
export function ColourPuzzle({ vals }: Props) {
  const buckets = vals.cmBuckets || [];
  const tray = vals.cmTray || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Tap a treasure, then tap its matching basket.</Text>
      <View style={s.row}>
        {buckets.map((b: any) => (
          <TouchableOpacity key={b.label} style={s.bucketWrap} onPress={b.onTap} activeOpacity={0.85}>
            <View style={[s.bucket, { backgroundColor: b.colorDark }]}>
              <View style={[s.bucketTop, { backgroundColor: b.color }]} />
              <Text style={s.bucketCount}>{b.count}</Text>
            </View>
            <Text style={s.bucketLabel}>{b.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.tray}>
        {tray.map((item: any) => (
          <TouchableOpacity
            key={item.id} onPress={item.onTap} activeOpacity={0.8}
            style={{ transform: [{ scale: item.selected ? 1.18 : 1 }] }}
          >
            <RadialOrb size={48} glow={item.glow} body={item.color} style={item.selected ? s.gemSelected : undefined} />
          </TouchableOpacity>
        ))}
        {tray.length === 0 && <Text style={s.allSorted}>All sorted! ✦</Text>}
      </View>
    </View>
  );
}

// ── Memory Match ─────────────────────────────────────────────────────────────
export function MemoryPuzzle({ vals }: Props) {
  const cards = vals.memCards || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Flip cards to find matching pairs. Moves: {vals.memMoves}</Text>
      <View style={s.grid3}>
        {cards.map((c: any) => {
          const flat = !c.face.includes('gradient');
          const card = (
            <View style={[s.card, { opacity: parseFloat(c.op) }, flat && { backgroundColor: c.face }]}>
              <View style={[s.cardDot, { backgroundColor: c.dot }]} />
            </View>
          );
          if (flat) return <TouchableOpacity key={c.id} onPress={c.onTap} activeOpacity={0.85}>{card}</TouchableOpacity>;
          const stops = parseGradientColors(c.face);
          return (
            <TouchableOpacity key={c.id} onPress={c.onTap} activeOpacity={0.85} style={[s.card, { opacity: parseFloat(c.op), overflow: 'hidden' }]}>
              <LinearGrad colors={stops} style={StyleSheet.absoluteFillObject} />
              <View style={[s.cardDot, { backgroundColor: c.dot }]} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Flow Direction ───────────────────────────────────────────────────────────
const FLOW_CELL = 85, FLOW_SEG_LEN = FLOW_CELL * 0.56, FLOW_SEG_W = 15;
export function FlowPuzzle({ vals }: Props) {
  const cells = vals.flowCells || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Tap the pipes to rotate them. Connect the water from the spring to the leaf.</Text>
      <View style={s.flowLegend}>
        <View style={s.flowLegendItem}>
          <RadialOrb size={14} glow="#dff5ff" body="#54C7E0" />
          <Text style={s.flowLegendText}>Spring</Text>
        </View>
        <View style={s.flowLegendItem}>
          <View style={s.flowLeaf} />
          <Text style={[s.flowLegendText, { color: '#d8f3c8' }]}>Leaf</Text>
        </View>
      </View>
      <View style={s.flowGridWrap}>
        <RadialOrb size={18} glow="#dff5ff" body="#54C7E0" style={s.flowSpringMarker} />
        <View style={[s.flowLeaf, s.flowLeafMarker]} />
        <View style={s.flowGrid}>
          {cells.map((c: any) => (
            <TouchableOpacity key={c.key} style={[s.flowCell, { backgroundColor: c.cellBg }]} onPress={c.onTap} activeOpacity={0.8}>
              <View style={[s.flowHub, { backgroundColor: c.hub }]} />
              {c.segs.map((seg: any, si: number) => (
                <View key={si} style={[s.flowSegBase, flowSegStyle(seg), { backgroundColor: seg.col }]} />
              ))}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
function flowSegStyle(seg: any): any {
  // seg.tf only tells us the axis (N/S vs E/W) — seg.top/bottom/left/right
  // (vs 'auto') tell us which edge of the cell this segment actually anchors to.
  if (String(seg.tf).includes('translateX')) {
    return {
      left: FLOW_CELL / 2 - FLOW_SEG_W / 2, width: FLOW_SEG_W, height: FLOW_SEG_LEN,
      ...(seg.top !== 'auto' ? { top: 0 } : { bottom: 0 }),
    };
  }
  return {
    top: FLOW_CELL / 2 - FLOW_SEG_W / 2, width: FLOW_SEG_LEN, height: FLOW_SEG_W,
    ...(seg.left !== 'auto' ? { left: 0 } : { right: 0 }),
  };
}

// ── Shape Fit ─────────────────────────────────────────────────────────────────
export function ShapePuzzle({ vals }: Props) {
  const slots = vals.shapeSlots || [];
  const tray = vals.shapeTray || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Tap a shape, then tap the matching hole in the log.</Text>
      <View style={s.shapeSlotGrid}>
        {slots.map((sl: any) => (
          <TouchableOpacity key={sl.id} style={s.shapeSlot} onPress={sl.onTap} activeOpacity={0.8}>
            <ShapeIcon cp={sl.cp} br={sl.br} size={44} color={sl.filled ? '#FFE7A8' : 'rgba(0,0,0,0.32)'} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={s.shapeTray}>
        {tray.map((p: any) => (
          <TouchableOpacity key={p.id} onPress={p.onTap} activeOpacity={0.8} style={{ transform: [{ scale: p.sel ? 1.16 : 1 }] }}>
            <ShapeIcon cp={p.cp} br={p.br} size={50} glow="#FFF3C4" body="#F2B33D" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Sequence Order ────────────────────────────────────────────────────────────
export function SequencePuzzle({ vals }: Props) {
  const tiles = vals.seqTiles || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>{vals.seqHint || 'Tap the leaves from smallest to largest.'}</Text>
      <View style={s.row}>
        {tiles.map((t: any) => (
          <TouchableOpacity
            key={t.id} onPress={t.onTap} activeOpacity={0.8}
            style={{ opacity: parseFloat(t.op), transform: [{ scale: t.scale === 'scale(1.06)' ? 1.06 : 1 }] }}
          >
            <RadialOrb size={t.size} glow="#bfe89a" body="#6FB36A" cx={0.4} cy={0.28} style={s.seqLeaf} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Weight Balance ─────────────────────────────────────────────────────────────
export function WeightPuzzle({ vals }: Props) {
  const weights = vals.wgtWeights || [];
  const placed = vals.wgtPlaced || [];
  const tilt = vals.wgtTilt || 0;
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Add acorns to the left pan until it balances. Target: {vals.wgtTarget}</Text>
      <View style={s.scaleWrap}>
        <LinearGrad colors={['#8b6f3a', '#6e572c']} style={s.scalePole} vertical />
        <View style={[s.scaleBeam, { transform: [{ rotate: `${tilt}deg` }] }]}>
          <LinearGrad colors={['#8b6f3a', '#c69a4a']} style={StyleSheet.absoluteFillObject} />
          <View style={s.scaleLeft}><Text style={s.scaleNum}>{vals.wgtSum}</Text></View>
          <View style={s.scaleRight}><Text style={s.scaleNum}>{vals.wgtTarget}</Text></View>
        </View>
      </View>
      <View style={s.row}>
        {placed.map((p: any, i: number) => (
          <TouchableOpacity key={i} onPress={p.onTap} activeOpacity={0.8}>
            <RadialOrb size={30} glow="#C9986A" body="#8B6355" style={s.placedAcorn}>
              <Text style={s.placedLabel}>{p.v}</Text>
            </RadialOrb>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={s.sub}>Tap to add · tap a placed acorn to remove</Text>
      <View style={s.row}>
        {weights.map((w: any) => (
          <TouchableOpacity key={w.v} onPress={w.onTap} activeOpacity={0.85}>
            <LinearGrad colors={['#C9986A', '#8B6355']} style={s.weightBtn}>
              <Text style={s.weightLabel}>+{w.v}</Text>
            </LinearGrad>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Light Refraction ──────────────────────────────────────────────────────────
export function LightPuzzle({ vals }: Props) {
  const mirrors = vals.lightMirrors || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Tap each crystal to rotate it. Line them all up to carry the light to the gem.</Text>
      <View style={s.lightRow}>
        <RadialOrb size={20} glow="#fff" body="#FFE7A8" />
        <View style={s.lightBeam} />
        {mirrors.map((m: any) => (
          <TouchableOpacity key={m.i} onPress={m.onTap} activeOpacity={0.8} style={[s.mirror, { backgroundColor: firstGradientColor(m.bg, 'rgba(255,248,239,0.1)') }]}>
            <View style={[s.mirrorBar, { transform: [{ rotate: `${m.deg}deg` }] }]} />
          </TouchableOpacity>
        ))}
        <View style={s.lightBeam} />
        <View style={[s.lightGemShape, { backgroundColor: vals.lightGem }]} />
      </View>
      <Text style={[s.lightHint, { opacity: parseFloat(vals.lightHintOp ?? '0.8') }]}>
        Each crystal points to where the next light should go.
      </Text>
    </View>
  );
}

// ── Shadow Match ──────────────────────────────────────────────────────────────
export function ShadowPuzzle({ vals }: Props) {
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Rotate the crystal until its shadow matches the shape on the wall.</Text>
      <Text style={s.shadowSectionLabel}>Target Shadow</Text>
      <View style={s.shadowBox}>
        <View style={[s.shadowBar, { backgroundColor: '#15082a', transform: [{ rotate: `${vals.shadowTargetDeg}deg` }] }]} />
      </View>
      <Text style={[s.shadowSectionLabel, { color: '#FFE7A8' }]}>Your Crystal</Text>
      <TouchableOpacity onPress={vals.shadowRotate} activeOpacity={0.85}>
        <View style={s.shadowBoxActive}>
          <LinearGrad colors={['#E040FB', '#7B1FA2']} style={[s.shadowBar, { transform: [{ rotate: `${vals.shadowCurDeg}deg` }] }]} />
        </View>
      </TouchableOpacity>
      <Text style={s.shadowCaption}>Tap the crystal to rotate · 90° each tap</Text>
    </View>
  );
}

// ── Rune Translation ──────────────────────────────────────────────────────────
export function RunePuzzle({ vals }: Props) {
  const opts = vals.runeOpts || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>What does this ancient rune mean?</Text>
      <Text style={s.runeProgress}>Rune {vals.runeProgress}</Text>
      <View style={s.runeBox}>
        <Text style={s.runeSymbol}>{vals.runeSymbol}</Text>
      </View>
      <View style={s.runeOpts}>
        {opts.map((o: any, i: number) => (
          <TouchableOpacity key={i} style={s.runeBtn} onPress={o.onTap} activeOpacity={0.85}>
            <Text style={s.runeBtnText}>{o.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Recall (Pattern / Sound / Matrix) ─────────────────────────────────────────
export function RecallPuzzle({ vals }: Props) {
  const pads = vals.recallPads || [];
  const cols = vals.recallCols === 'repeat(4,1fr)' ? 4 : vals.recallCols === 'repeat(2,1fr)' ? 2 : 3;
  const size = parseInt(vals.recallSize || '62', 10);
  const radius = parseInt(vals.recallRadius || '16', 10);
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>{vals.recallIntro}</Text>
      <Text style={s.sub}>{vals.recallLabel}</Text>
      <View style={[s.recallGrid, { width: cols * size + (cols - 1) * 8 }]}>
        {pads.map((p: any) => {
          const lit = p.scale === 'scale(1.08)';
          const watchDim = String(p.filter).includes('.78');
          return (
            <TouchableOpacity
              key={p.i} onPress={p.onTap} activeOpacity={0.8}
              style={[
                { width: size, height: size, borderRadius: radius, backgroundColor: firstGradientColor(p.bg) },
                lit && s.recallPadLit, watchDim && { opacity: 0.7 },
                { transform: [{ scale: lit ? 1.08 : 1 }] },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

// ── Number Sequence ───────────────────────────────────────────────────────────
export function NumberPuzzle({ vals }: Props) {
  const seq = vals.numSeq || [];
  const opts = vals.numOptions || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>What number comes next in the sequence?</Text>
      <View style={s.row}>
        {seq.map((n: any, i: number) => (
          <LinearGrad key={i} colors={['#2E8BC0', '#1f6a96']} style={s.numBox}><Text style={s.numVal}>{n.v}</Text></LinearGrad>
        ))}
        <View style={[s.numBox, s.numBlank]}><Text style={[s.numVal, { color: '#fff' }]}>?</Text></View>
      </View>
      <View style={s.optGrid2}>
        {opts.map((o: any, i: number) => (
          <TouchableOpacity key={i} style={s.lightOptBtn} onPress={o.onTap} activeOpacity={0.85}>
            <Text style={[s.lightOptText, { color: '#1f6a96' }]}>{o.v}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Sliding Tiles ─────────────────────────────────────────────────────────────
export function SlidePuzzle({ vals }: Props) {
  const tiles = vals.slideTiles || [];
  const N = Math.round(Math.sqrt(tiles.length)) || 3;
  const tileSize = 74;
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Slide the tiles to order them 1–{tiles.length - 1}. Tap a tile next to the gap.</Text>
      <View style={[s.slideGrid, { width: N * tileSize + (N - 1) * 8 }]}>
        {tiles.map((t: any) => {
          const stops = parseGradientColors(t.bg);
          return (
            <TouchableOpacity key={t.i} disabled={t.blank} style={[s.slideTile, { width: tileSize, height: tileSize, overflow: 'hidden' }]} onPress={t.onTap} activeOpacity={0.85}>
              {stops.length >= 2 && <LinearGrad colors={stops} style={StyleSheet.absoluteFillObject} />}
              {!t.blank && <Text style={s.slideTileText}>{t.label}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ── Tower of Hanoi ────────────────────────────────────────────────────────────
export function HanoiPuzzle({ vals }: Props) {
  const pegs = vals.hanoiPegs || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Move the whole stack to the right peg. A bigger disc can never sit on a smaller one.</Text>
      <View style={s.row}>
        {pegs.map((peg: any) => (
          <TouchableOpacity
            key={peg.pi} style={[s.hanoiPeg, { backgroundColor: firstGradientColor(peg.bg, 'rgba(255,255,255,0.06)') }]}
            onPress={peg.onTap} activeOpacity={0.8}
          >
            <View style={s.hanoiPole} />
            {/* peg.discs[0] is the bottom of the stack (biggest); with
                justifyContent:'flex-end' the *last* render item lands at the
                bottom, so reverse to keep big discs under small ones. */}
            {[...peg.discs].reverse().map((d: any, di: number) => (
              <View key={di} style={[s.hanoiDisc, { width: d.w, backgroundColor: d.color }]} />
            ))}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Equation Forge ─────────────────────────────────────────────────────────────
export function EqnPuzzle({ vals }: Props) {
  const opts = vals.eqnOptions || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Pick the operator that makes the equation true.</Text>
      <View style={s.eqnRow}>
        <LinearGrad colors={['#B9770E', '#8a590a']} style={s.eqnBox}><Text style={s.eqnBoxText}>{vals.eqnA}</Text></LinearGrad>
        <View style={s.eqnBlank}><Text style={s.eqnBlankText}>?</Text></View>
        <LinearGrad colors={['#B9770E', '#8a590a']} style={s.eqnBox}><Text style={s.eqnBoxText}>{vals.eqnB}</Text></LinearGrad>
        <Text style={s.eqnEquals}>=</Text>
        <View style={s.eqnTarget}><Text style={s.eqnTargetText}>{vals.eqnTarget}</Text></View>
      </View>
      <View style={s.row}>
        {opts.map((o: any, i: number) => (
          <TouchableOpacity key={i} style={s.eqnOptBtn} onPress={o.onTap} activeOpacity={0.85}>
            <Text style={s.eqnOptText}>{o.op}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Connecting Dots ────────────────────────────────────────────────────────────
export function DotsPuzzle({ vals }: Props) {
  const dots = vals.dotsList || [];
  const points = (vals.dotsLine || '').trim();
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Tap the stars in number order to trace the constellation.</Text>
      <Text style={s.constellationLabel}>{vals.dotsLabel}</Text>
      <View style={s.dotsCanvas}>
        {points.length > 0 && (
          <Svg width="100%" height="100%" viewBox="0 0 100 100" style={StyleSheet.absoluteFillObject}>
            <Polyline points={points} fill="none" stroke="#FFD86B" strokeWidth={1.1} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        )}
        {dots.map((d: any) => (
          <TouchableOpacity key={d.n} style={[s.dot, { left: `${d.x}%`, top: `${d.y}%`, backgroundColor: d.bg }]} onPress={d.onTap} activeOpacity={0.7}>
            <Text style={s.dotLabel}>{d.n}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Word Match ─────────────────────────────────────────────────────────────────
export function WordPuzzle({ vals }: Props) {
  const slots = vals.wordSlots || [];
  const tiles = vals.wordTiles || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Spell the word — tap the letters in the right order.</Text>
      <Text style={s.wordEmoji}>{vals.wordEmoji}</Text>
      <View style={s.row}>
        {slots.map((sl: any, i: number) => {
          const stops = parseGradientColors(sl.bg);
          const flat = stops.length < 2;
          return (
            <View key={i} style={[s.wordSlot, { borderColor: firstGradientColor(sl.border, 'rgba(255,255,255,0.3)') }, flat && { backgroundColor: sl.bg }]}>
              {!flat && <LinearGrad colors={stops} style={StyleSheet.absoluteFillObject} />}
              <Text style={s.wordSlotText}>{sl.ch}</Text>
            </View>
          );
        })}
      </View>
      <View style={s.row}>
        {tiles.map((t: any, i: number) => (
          <TouchableOpacity key={i} onPress={t.onTap} activeOpacity={0.8} style={{ opacity: parseFloat(t.op) }}>
            <LinearGrad colors={['#3DBE9B', '#2a9a7c']} style={s.wordTile}>
              <Text style={s.wordTileText}>{t.ch}</Text>
            </LinearGrad>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Glyph Trace ────────────────────────────────────────────────────────────────
const TRACE_CANVAS = 300;
export function TracePuzzle({ vals }: Props) {
  const dots = vals.traceDots || [];
  const points = (vals.traceLine || '').trim();
  // gameLogic.js's traceXY() expects `traceRef.current.getBoundingClientRect()`
  // (a web DOM API) — feed it a fixed-size shim since our canvas is a known size.
  if (vals.traceRef) {
    vals.traceRef.current = { getBoundingClientRect: () => ({ left: 0, top: 0, width: TRACE_CANVAS, height: TRACE_CANVAS }) };
  }
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Press and drag through the stars in order — one smooth stroke. Lift off early and it resets.</Text>
      <Text style={s.constellationLabel}>{vals.traceLabel}</Text>
      <View
        style={s.traceCanvas}
        onStartShouldSetResponder={() => true}
        onResponderGrant={(e) => vals.traceDown?.({ clientX: e.nativeEvent.locationX, clientY: e.nativeEvent.locationY })}
        onResponderMove={(e) => vals.traceMove?.({ clientX: e.nativeEvent.locationX, clientY: e.nativeEvent.locationY })}
        onResponderRelease={() => vals.traceUp?.()}
        onResponderTerminate={() => vals.traceUp?.()}
      >
        {points.length > 0 && (
          <Svg width="100%" height="100%" viewBox="0 0 100 100" style={StyleSheet.absoluteFillObject} pointerEvents="none">
            <Polyline points={points} fill="none" stroke="#FFD86B" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        )}
        {dots.map((d: any) => (
          <View key={d.n} pointerEvents="none" style={[s.dot, { left: `${d.x}%`, top: `${d.y}%`, backgroundColor: d.bg }]}>
            <Text style={s.traceDotLabel}>{d.n}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Odd One Out ────────────────────────────────────────────────────────────────
export function OddPuzzle({ vals }: Props) {
  const cells = vals.oddCells || [];
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>One of these is not like the others. Tap the odd one out!</Text>
      <View style={s.oddGrid}>
        {cells.map((c: any) => (
          <TouchableOpacity key={c.i} style={s.oddCell} onPress={c.onTap} activeOpacity={0.8}>
            <Text style={s.oddEmoji}>{c.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// gameLogic.js's initCount() scatters items with pure random x/y and no
// collision avoidance at all — with up to 12 items in a small canvas, that
// reliably overlaps. The win condition only checks the count number (never
// positions), so it's safe to lay items out on a deterministic grid+jitter
// here in the rendering layer instead, without touching the verbatim logic.
function spreadCountItems(items: any[]): { x: number; y: number; rot: number }[] {
  const k = items.length || 1;
  const cols = Math.max(1, Math.round(Math.sqrt(k * 1.3)));
  const rows = Math.ceil(k / cols);
  const cellW = 100 / cols, cellH = 100 / rows;
  return items.map((it, idx) => {
    const col = idx % cols, row = Math.floor(idx / cols);
    const jitterX = (((it.rot ?? 0) + 15) / 30 - 0.5) * cellW * 0.5;
    const jitterY = (((it.i ?? idx) * 53 % 30) / 30 - 0.5) * cellH * 0.5;
    return {
      x: Math.min(94, Math.max(6, col * cellW + cellW / 2 + jitterX)),
      y: Math.min(90, Math.max(10, row * cellH + cellH / 2 + jitterY)),
      rot: it.rot ?? 0,
    };
  });
}

// ── Counting Quest ─────────────────────────────────────────────────────────────
export function CountPuzzle({ vals }: Props) {
  const items = vals.countItems || [];
  const opts = vals.countOptions || [];
  const positions = spreadCountItems(items);
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>How many do you count? Tap the right number.</Text>
      <View style={s.countCanvas}>
        {positions.map((p, i) => (
          <Text key={i} style={[s.countItem, { left: `${p.x}%`, top: `${p.y}%`, transform: [{ translateX: -15 }, { translateY: -15 }, { rotate: `${p.rot}deg` }] }]}>{vals.countEmoji}</Text>
        ))}
      </View>
      <View style={s.optGrid2}>
        {opts.map((o: any, i: number) => (
          <TouchableOpacity key={i} style={s.lightOptBtn} onPress={o.onTap} activeOpacity={0.85}>
            <Text style={[s.lightOptText, { color: '#3f7faa' }]}>{o.v}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Maze Run ───────────────────────────────────────────────────────────────────
export function MazePuzzle({ vals }: Props) {
  const cells = vals.mazeCells || [];
  const N = Math.round(Math.sqrt(cells.length)) || 5;
  const cellSize = 42;
  return (
    <View style={s.wrapper}>
      <Text style={s.intro}>Guide the leaf to the glowing exit. Tap the arrows — walls block the way.</Text>
      <View style={[s.mazeGrid, { width: N * cellSize + (N - 1) * 4 }]}>
        {cells.map((c: any, i: number) => {
          const isGoal = String(c.bg).includes('radial-gradient');
          return (
            <View key={i} style={[s.mazeCell, { width: cellSize, height: cellSize, backgroundColor: isGoal ? '#FFD86B' : c.bg }]}>
              {c.token && <View style={s.flowLeaf} />}
            </View>
          );
        })}
      </View>
      <View style={s.dpad}>
        <TouchableOpacity style={s.dpadBtnUp} onPress={vals.mazeUp} activeOpacity={0.85}><Text style={s.dpadText}>▲</Text></TouchableOpacity>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity style={s.dpadBtn} onPress={vals.mazeLeft} activeOpacity={0.85}><Text style={s.dpadText}>◀</Text></TouchableOpacity>
          <TouchableOpacity style={s.dpadBtn} onPress={vals.mazeDown} activeOpacity={0.85}><Text style={s.dpadText}>▼</Text></TouchableOpacity>
          <TouchableOpacity style={s.dpadBtn} onPress={vals.mazeRight} activeOpacity={0.85}><Text style={s.dpadText}>▶</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tiny inline LinearGradient wrapper so call sites read as plain components.
import { LinearGradient } from 'expo-linear-gradient';
function LinearGrad({ colors, style, vertical, children }: { colors: string[]; style?: any; vertical?: boolean; children?: React.ReactNode }) {
  const safe = colors.length >= 2 ? colors : [colors[0] || '#999', colors[0] || '#999'];
  return (
    <LinearGradient
      colors={safe as any}
      start={vertical ? { x: 0, y: 0 } : { x: 0, y: 0 }}
      end={vertical ? { x: 0, y: 1 } : { x: 1, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  wrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 16 },
  intro: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: '#fff', textAlign: 'center', opacity: 0.9, maxWidth: 270 },
  sub: { fontFamily: FONT.nunito.semibold, fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  // colour
  bucketWrap: { alignItems: 'center', gap: 8, width: 104 },
  bucket: { width: '100%', height: 84, borderRadius: 18, borderBottomLeftRadius: 26, borderBottomRightRadius: 26, alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
  bucketTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '55%' },
  bucketCount: { fontFamily: FONT.baloo.extrabold, fontSize: 22, color: '#fff', marginBottom: 8 },
  bucketLabel: { fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#fff' },
  tray: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 14, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,248,239,0.14)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderStyle: 'dashed',
    borderRadius: 20, padding: 18, minHeight: 104, width: '100%',
  },
  gemSelected: { shadowColor: '#FFF3C4', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8, elevation: 6 },
  allSorted: { color: '#fff', opacity: 0.6, fontFamily: FONT.nunito.bold, fontSize: 13 },
  // memory
  grid3: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, width: 3 * 72 + 20 },
  card: { width: 72, height: 96, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardDot: { width: 32, height: 32, borderRadius: 16 },
  // flow
  flowLegend: { flexDirection: 'row', gap: 18, alignItems: 'center' },
  flowLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  flowLegendText: { fontFamily: FONT.nunito.bold, fontSize: 11, color: '#bfe9ff' },
  flowLeaf: { width: 16, height: 16, borderRadius: 8, borderBottomLeftRadius: 0, backgroundColor: '#6FB36A', transform: [{ rotate: '45deg' }] },
  flowGridWrap: { position: 'relative', width: FLOW_CELL * 3 + 16 },
  // initFlow()'s src/dst are always row 0 ({r:0,c:0} / {r:0,c:2}) — align
  // the markers with row 0's vertical center, not the whole 3-row grid.
  flowSpringMarker: { position: 'absolute', left: -22, top: FLOW_CELL / 2 - 9, zIndex: 2 },
  flowLeafMarker: { position: 'absolute', right: -24, width: 20, height: 20, top: FLOW_CELL / 2 - 10, zIndex: 2 },
  flowGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, width: FLOW_CELL * 3 + 16 },
  flowCell: { width: FLOW_CELL, height: FLOW_CELL, borderRadius: 14, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  flowHub: { width: 18, height: 18, borderRadius: 9, zIndex: 2 },
  flowSegBase: { position: 'absolute', borderRadius: 5 },
  // shape
  shapeSlotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, width: 200 },
  shapeSlot: { width: 88, height: 88, borderRadius: 16, backgroundColor: '#5c3e26', alignItems: 'center', justifyContent: 'center' },
  shapeTray: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center',
    backgroundColor: 'rgba(255,248,239,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', borderStyle: 'dashed',
    borderRadius: 18, padding: 16, minHeight: 80, width: '100%',
  },
  // sequence
  seqLeaf: { borderRadius: 999 },
  // weight
  scaleWrap: { alignItems: 'center', width: 250, height: 120 },
  scalePole: { position: 'absolute', top: 8, width: 8, height: 104, borderRadius: 4 },
  scaleBeam: { flexDirection: 'row', alignItems: 'center', position: 'absolute', top: 8, width: 230, height: 6, borderRadius: 4, overflow: 'visible' },
  scaleLeft: { position: 'absolute', left: 6, top: 6, width: 64, height: 46, borderRadius: 0, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, backgroundColor: 'rgba(201,154,106,0.4)', borderWidth: 2, borderColor: '#c69a4a', alignItems: 'center', justifyContent: 'center' },
  scaleRight: { position: 'absolute', right: 6, top: 6, width: 64, height: 46, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, backgroundColor: 'rgba(245,166,35,0.35)', borderWidth: 2, borderColor: '#F5A623', alignItems: 'center', justifyContent: 'center' },
  scaleNum: { fontFamily: FONT.baloo.extrabold, fontSize: 16, color: '#fff' },
  placedAcorn: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  placedLabel: { fontFamily: FONT.baloo.extrabold, color: '#fff', fontSize: 12 },
  weightBtn: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  weightLabel: { fontFamily: FONT.baloo.extrabold, color: '#fff', fontSize: 18 },
  // light
  lightRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  lightBeam: { width: 14, height: 4, backgroundColor: '#FFE7A8' },
  mirror: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  mirrorBar: { width: 38, height: 6, borderRadius: 3, backgroundColor: '#E040FB' },
  lightGemShape: { width: 24, height: 24, borderRadius: 8, borderBottomLeftRadius: 0, transform: [{ rotate: '45deg' }] },
  lightHint: { fontFamily: FONT.nunito.bold, fontSize: 12, color: '#FFE7A8', textAlign: 'center' },
  // shadow
  shadowSectionLabel: { fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#bfa6e6', textTransform: 'uppercase', letterSpacing: 0.5 },
  shadowBox: { width: 120, height: 120, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  shadowBoxActive: { width: 120, height: 120, borderRadius: 18, backgroundColor: 'rgba(224,64,251,0.12)', borderWidth: 2, borderColor: 'rgba(224,64,251,0.4)', alignItems: 'center', justifyContent: 'center' },
  shadowBar: { width: 84, height: 30, borderRadius: 8 },
  shadowCaption: { fontFamily: FONT.nunito.bold, fontSize: 12, color: '#fff', opacity: 0.6 },
  // rune
  runeProgress: { fontFamily: FONT.nunito.extrabold, fontSize: 11, color: '#FFD54F' },
  runeBox: { width: 128, height: 128, borderRadius: 22, backgroundColor: '#241638', alignItems: 'center', justifyContent: 'center' },
  runeSymbol: { fontSize: 64 },
  runeOpts: { gap: 10, width: '100%' },
  runeBtn: { backgroundColor: 'rgba(255,248,239,0.95)', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  runeBtnText: { fontFamily: FONT.baloo.bold, color: '#3a2a1c', fontSize: 16 },
  // recall
  recallGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  recallPadLit: { shadowColor: '#FFF3C4', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 12, elevation: 8 },
  // number
  numBox: { minWidth: 50, height: 56, paddingHorizontal: 8, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  numBlank: { backgroundColor: 'transparent', borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)', borderStyle: 'dashed' },
  numVal: { fontFamily: FONT.baloo.extrabold, fontSize: 22, color: '#fff' },
  optGrid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, width: '100%', justifyContent: 'center' },
  lightOptBtn: { width: '44%', paddingVertical: 16, borderRadius: 16, backgroundColor: 'rgba(255,248,239,0.95)', alignItems: 'center' },
  lightOptText: { fontFamily: FONT.baloo.extrabold, fontSize: 20 },
  // slide
  slideGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 8, backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 16 },
  slideTile: { borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  slideTileText: { fontFamily: FONT.baloo.extrabold, fontSize: 24, color: '#fff' },
  // hanoi
  hanoiPeg: { flex: 1, height: 160, borderRadius: 14, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 8, gap: 4, marginHorizontal: 4 },
  hanoiPole: { position: 'absolute', top: 8, bottom: 30, width: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3 },
  hanoiDisc: { height: 20, borderRadius: 7, marginTop: 5 },
  // eqn
  eqnRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  eqnBox: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  eqnBoxText: { fontFamily: FONT.baloo.extrabold, fontSize: 24, color: '#fff' },
  eqnBlank: { width: 48, height: 48, borderRadius: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.55)', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  eqnBlankText: { fontFamily: FONT.baloo.extrabold, fontSize: 24, color: '#FFE7A8' },
  eqnEquals: { fontFamily: FONT.baloo.extrabold, fontSize: 24, color: '#fff' },
  eqnTarget: { width: 60, height: 56, borderRadius: 14, backgroundColor: 'rgba(255,231,168,0.2)', alignItems: 'center', justifyContent: 'center' },
  eqnTargetText: { fontFamily: FONT.baloo.extrabold, fontSize: 24, color: '#FFE7A8' },
  eqnOptBtn: { width: 62, height: 62, borderRadius: 18, backgroundColor: 'rgba(255,248,239,0.95)', alignItems: 'center', justifyContent: 'center' },
  eqnOptText: { fontFamily: FONT.baloo.extrabold, fontSize: 28, color: '#8a590a' },
  // dots / trace
  constellationLabel: { fontFamily: FONT.baloo.bold, fontSize: 14, color: '#C9D6FF' },
  dotsCanvas: {
    width: 300, height: 300, backgroundColor: 'rgba(30,70,110,0.35)', borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(159,200,255,0.25)', position: 'relative', overflow: 'hidden',
  },
  traceCanvas: {
    width: TRACE_CANVAS, height: TRACE_CANVAS, backgroundColor: 'rgba(50,70,130,0.3)', borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(159,200,255,0.25)', position: 'relative', overflow: 'hidden',
  },
  dot: {
    position: 'absolute', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    marginLeft: -18, marginTop: -18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  dotLabel: { fontFamily: FONT.baloo.extrabold, fontSize: 15, color: '#1A1140' },
  traceDotLabel: { fontFamily: FONT.baloo.extrabold, fontSize: 14, color: '#16204a' },
  // word
  wordEmoji: { fontSize: 56 },
  wordSlot: { width: 44, height: 52, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, overflow: 'hidden' },
  wordSlotText: { fontFamily: FONT.baloo.extrabold, fontSize: 20, color: '#fff' },
  wordTile: { width: 54, height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  wordTileText: { fontFamily: FONT.baloo.extrabold, fontSize: 24, color: '#fff' },
  // odd — own grid width (74px cells), not Memory's grid3 (sized for 72px cards)
  oddGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, width: 74 * 3 + 12 * 2 },
  oddCell: { width: 74, height: 74, borderRadius: 18, backgroundColor: 'rgba(255,248,239,0.95)', alignItems: 'center', justifyContent: 'center' },
  oddEmoji: { fontSize: 38 },
  // count
  countCanvas: { width: 260, height: 200, backgroundColor: 'rgba(255,248,239,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', borderStyle: 'dashed', borderRadius: 20, overflow: 'hidden', position: 'relative' },
  countItem: { position: 'absolute', fontSize: 30, lineHeight: 32 },
  // maze
  mazeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, padding: 6, backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: 14 },
  mazeCell: { borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  dpad: { gap: 6, alignItems: 'center', marginTop: 8 },
  dpadBtnUp: { width: 54, height: 46, borderRadius: 13, backgroundColor: '#86C166', alignItems: 'center', justifyContent: 'center', shadowColor: '#4f7d38', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  dpadBtn: { width: 54, height: 46, borderRadius: 13, backgroundColor: '#86C166', alignItems: 'center', justifyContent: 'center', shadowColor: '#4f7d38', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  dpadText: { fontSize: 20, color: '#fff', fontWeight: '900' },
});
