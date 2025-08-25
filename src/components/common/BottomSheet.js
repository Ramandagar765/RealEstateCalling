import React, { useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder, TouchableWithoutFeedback } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

const BottomSheet = ({ children, isVisible, onClose }) => {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const lastGestureDy = useRef(0);

  useEffect(() => {
    if (isVisible) {
      springAnimation(0);
    } else {
      springAnimation(SCREEN_HEIGHT);
    }
  }, [isVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        translateY.setOffset(lastGestureDy.current);
      },
      onPanResponderMove: (_, gestureState) => {
        translateY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        translateY.flattenOffset();
        const { dy, vy } = gestureState;

        if (dy < -100 || (vy < -0.5 && dy < 0)) {
          springAnimation(MAX_TRANSLATE_Y);
        } else if (dy > 100 || (vy > 0.5 && dy > 0)) {
          onClose();
        } else {
          springAnimation(0);
        }
      },
    })
  ).current;

  const springAnimation = useCallback((toValue) => {
    lastGestureDy.current = toValue;
    Animated.spring(translateY, {
      toValue,
      damping: 15,
      mass: 1,
      stiffness: 150,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const bottomSheetAnimation = {
    transform: [
      {
        translateY: translateY.interpolate({
          inputRange: [MAX_TRANSLATE_Y, SCREEN_HEIGHT],
          outputRange: [MAX_TRANSLATE_Y, SCREEN_HEIGHT],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  if (!isVisible) return null;

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.bottomSheetContainer, bottomSheetAnimation]}>
          <TouchableWithoutFeedback>
            <View style={styles.contentContainer}>
              <View style={styles.draggableArea} {...panResponder.panHandlers}>
                <View style={styles.draggableIcon} />
              </View>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
  },
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: SCREEN_HEIGHT - 550,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 1001,
  },
  contentContainer: {
    flex: 1,
  },
  draggableArea: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draggableIcon: {
    width: 40,
    height: 5,
    backgroundColor: '#D3D3D3',
    borderRadius: 3,
  },
});

export default BottomSheet;