// Design mandates 'Baloo 2' for headings/buttons/numbers and 'Nunito' for body
// text (see Forest Quest.dc.html <helmet> font link). Use these family names
// directly in StyleSheets instead of fontWeight — RN/Android can fail to
// synthesize bold from a custom regular face when fontWeight is also set.
export const FONT = {
  baloo: {
    medium: 'Baloo2_500Medium',
    semibold: 'Baloo2_600SemiBold',
    bold: 'Baloo2_700Bold',
    extrabold: 'Baloo2_800ExtraBold',
  },
  nunito: {
    regular: 'Nunito_400Regular',
    semibold: 'Nunito_600SemiBold',
    bold: 'Nunito_700Bold',
    extrabold: 'Nunito_800ExtraBold',
    black: 'Nunito_900Black',
    semiboldItalic: 'Nunito_600SemiBold_Italic',
  },
};
