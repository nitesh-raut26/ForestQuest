import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

const CHARACTER_ART = {
  ari: require('../../assets/characters/ari.png'),
  pip: require('../../assets/characters/pip.png'),
  mimi: require('../../assets/characters/mimi.png'),
  tomo: require('../../assets/characters/tomo.png'),
  luma: require('../../assets/characters/luma.png'),
  nori: require('../../assets/characters/nori.png'),
  sol: require('../../assets/characters/sol.png'),
} as const;

export type CharacterId = keyof typeof CHARACTER_ART;

const NAME_TO_ID: Record<string, CharacterId> = {
  ari: 'ari',
  pip: 'pip',
  mimi: 'mimi',
  tomo: 'tomo',
  luma: 'luma',
  nori: 'nori',
  sol: 'sol',
};

export function characterIdFromName(name?: string | null): CharacterId | null {
  if (!name) return null;
  return NAME_TO_ID[name.trim().toLowerCase()] || null;
}

interface Props {
  id?: string | null;
  name?: string | null;
  size: number;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
}

export default function CharacterArt({ id, name, size, style, accessibilityLabel }: Props) {
  const key = characterIdFromName(id || name);
  if (!key) return null;

  return (
    <Image
      source={CHARACTER_ART[key]}
      resizeMode="contain"
      accessibilityLabel={accessibilityLabel || `${name || key} character`}
      style={[{ width: size, height: size }, style]}
    />
  );
}
// Minor update
