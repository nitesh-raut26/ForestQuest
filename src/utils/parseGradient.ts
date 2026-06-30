// gameLogic.js's renderVals() emits raw CSS gradient/shadow strings (it was
// extracted verbatim from a web template). React Native has no CSS, so this
// pulls the literal color stops back out for use with <LinearGradient colors>
// or a flat backgroundColor.
const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g;

export function parseGradientColors(css: string | undefined | null): string[] {
  if (!css) return [];
  return css.match(COLOR_RE) || [];
}

export function firstGradientColor(css: string | undefined | null, fallback = '#999'): string {
  return parseGradientColors(css)[0] || fallback;
}
