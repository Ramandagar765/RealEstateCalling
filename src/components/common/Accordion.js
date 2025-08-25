import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate,
  measure,
  runOnUI,
  useAnimatedRef,
} from 'react-native-reanimated';
import { Ionicons } from '../Icons';
import { C, F, HT, L, WT } from '../../commonStyles/style-layout';

const Accordion = ({ title, children, show = false }) => {
  const [isOpen, setIsOpen] = useState(show);
  const rotateAnimation = useSharedValue(0);
  const heightAnimation = useSharedValue(0);
  const contentRef = useAnimatedRef();
  const [contentHeight, setContentHeight] = useState(0);

  const measureContent = useCallback(() => {
    if (contentRef?.current) {
      const measurement = measure(contentRef);
      if (measurement) {
        setContentHeight(measurement.height);
      }
    }
  }, [contentRef]);

  const toggleAccordion = () => {
    rotateAnimation.value = withTiming(isOpen ? 0 : 1, { duration: 500 });
    heightAnimation.value = withTiming(isOpen ? 0 : 1, { duration: 500 });
    setIsOpen(!isOpen);
  };

  const iconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      rotateAnimation.value,
      [0, 1],
      [0, 180]
    );
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      height: heightAnimation.value * contentHeight,
      opacity: heightAnimation.value,
      overflow: 'hidden',
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.header, L.even, L.jcSB, L.aiC]} 
        onPress={toggleAccordion}
        activeOpacity={0.7}
      >
        <Text style={[F.fsOne6, F.ffM, C.fcBlack]}>{title}</Text>
        <Animated.View style={iconStyle}>
          <Ionicons name="chevron-down" size={24} color="#000" />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View style={[styles.content, contentStyle]}>
        <View ref={contentRef} onLayout={measureContent}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  content: {
    backgroundColor: '#fff',
  },
});

export default Accordion;
