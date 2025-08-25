import React from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';

const CustomSwitch = ({ value, onValueChange, activeColor = '#582F93', inactiveColor = '#D1D1D6' }) => {
  // Animation value for the switch knob
  const translateX = React.useRef(new Animated.Value(value ? 20 : 0)).current;

  const toggleSwitch = () => {
    // Animate the switch
    Animated.spring(translateX, {
      toValue: value ? 0 : 22,
      useNativeDriver: true,
      bounciness: 0,
    }).start();

    onValueChange(!value);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleSwitch}
      style={[
        styles.switchContainer,
        { backgroundColor: value ? activeColor : inactiveColor }
      ]}
    >
      <Animated.View
        style={[
          styles.knob,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: 50,
    height: 25,
    borderRadius: 15,
    padding: 5,
    justifyContent: 'center',
  },
  knob: {
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,
  },
});

export default CustomSwitch;