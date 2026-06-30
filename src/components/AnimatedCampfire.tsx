import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Props {
  onPress?: () => void;
}

function Ember({ left, delay, drift }: { left: number; delay: number; drift: number }) {
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(rise, { toValue: 1, duration: 1300 + delay, useNativeDriver: true }),
        Animated.timing(rise, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, rise]);

  return (
    <Animated.View
      style={[
        styles.ember,
        {
          left,
          opacity: rise.interpolate({ inputRange: [0, 0.18, 0.82, 1], outputRange: [0, 1, 0.55, 0] }),
          transform: [
            { translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [0, -78] }) },
            { translateX: rise.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, drift, -drift / 2] }) },
            { scale: rise.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.4, 1, 0.3] }) },
          ],
        },
      ]}
    />
  );
}

export default function AnimatedCampfire({ onPress }: Props) {
  const flicker = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const flameLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(flicker, { toValue: 1, duration: 420, useNativeDriver: true }),
        Animated.timing(flicker, { toValue: 0, duration: 340, useNativeDriver: true }),
      ]),
    );
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    flameLoop.start();
    glowLoop.start();
    return () => {
      flameLoop.stop();
      glowLoop.stop();
    };
  }, [flicker, glow]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel="Burning campfire. Tap to stoke the fire."
      style={styles.touch}
    >
      <Animated.View
        style={[
          styles.glow,
          {
            opacity: glow.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.62] }),
            transform: [{ scale: glow.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.08] }) }],
          },
        ]}
      />

      <Ember left={44} delay={0} drift={8} />
      <Ember left={62} delay={260} drift={-7} />
      <Ember left={52} delay={520} drift={5} />
      <Ember left={70} delay={780} drift={-5} />

      <View style={styles.flames}>
        <Animated.View
          style={[
            styles.flameOuter,
            {
              transform: [
                { rotate: flicker.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '5deg'] }) },
                { scaleY: flicker.interpolate({ inputRange: [0, 1], outputRange: [0.93, 1.08] }) },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.flameMiddle,
            {
              transform: [
                { translateX: flicker.interpolate({ inputRange: [0, 1], outputRange: [-2, 3] }) },
                { scaleY: flicker.interpolate({ inputRange: [0, 1], outputRange: [1.08, 0.92] }) },
              ],
            },
          ]}
        />
        <View style={styles.flameInner} />
      </View>

      <View style={styles.logs}>
        <View style={[styles.log, { transform: [{ rotate: '-18deg' }] }]} />
        <View style={[styles.log, { transform: [{ rotate: '18deg' }] }]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touch: { width: 118, height: 126, alignItems: 'center', justifyContent: 'flex-end' },
  glow: {
    position: 'absolute', bottom: 5, width: 112, height: 72, borderRadius: 56,
    backgroundColor: '#FFB72E',
    shadowColor: '#FF8A16', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 28, elevation: 8,
  },
  ember: {
    position: 'absolute', bottom: 54, width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#FFE36E',
    shadowColor: '#FF9C24', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 6, elevation: 10,
  },
  flames: { width: 74, height: 88, alignItems: 'center', justifyContent: 'flex-end', zIndex: 3 },
  flameOuter: {
    position: 'absolute', bottom: 3, width: 60, height: 82, borderTopLeftRadius: 38, borderTopRightRadius: 10,
    borderBottomLeftRadius: 34, borderBottomRightRadius: 34, backgroundColor: '#F06A1B',
    transform: [{ rotate: '-3deg' }],
  },
  flameMiddle: {
    position: 'absolute', bottom: 4, width: 43, height: 62, borderTopLeftRadius: 27, borderTopRightRadius: 8,
    borderBottomLeftRadius: 25, borderBottomRightRadius: 25, backgroundColor: '#FFB323',
  },
  flameInner: {
    position: 'absolute', bottom: 5, width: 25, height: 38, borderTopLeftRadius: 16, borderTopRightRadius: 5,
    borderBottomLeftRadius: 15, borderBottomRightRadius: 15, backgroundColor: '#FFF2A5',
  },
  logs: { flexDirection: 'row', gap: 3, marginTop: -9, marginBottom: 3, zIndex: 4 },
  log: {
    width: 48, height: 11, borderRadius: 6, backgroundColor: '#684229',
    borderWidth: 2, borderColor: '#8C5A35',
  },
});
