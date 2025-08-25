import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const CustomToast = forwardRef((props, ref) => {
  const [toasts, setToasts] = useState([1,2,3]);
  const fadeAnim = new Animated.Value(0);
  const progressAnim = new Animated.Value(0);

  useImperativeHandle(ref, () => ({
    show: (message, options = {}) => {
      const {
        duration = 3000,
        position = 'top',
        backgroundColor = '#333',
        textColor = '#fff',
      } = options;

      const newToast = {
        id: Date.now(),
        message,
        position,
        backgroundColor,
        textColor,
      };

      setToasts(prev => [...prev, newToast]);

      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: duration,
          useNativeDriver: false,
        }),
      ]).start();

      // Remove toast after duration
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== newToast.id));
      }, duration);
    },
  }));

  return (
    <View style={{ zIndex: 1000, backgroundColor: 'red', top: 100,position:'absolute',alignSelf:'center' }}>
      {toasts.map(toast => (
        <Animated.View
          key={toast.id}
          style={[
            styles.container,
            {
              backgroundColor: toast.backgroundColor,
              [toast.position]: 50,
              opacity: fadeAnim,
            },
          ]}>
          <Text style={[styles.text, { color: toast.textColor }]}>
            {toast.message}
          </Text>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['100%', '0%'],
                }),
              },
            ]}
          />
        </Animated.View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    top: 30,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    elevation: 5,

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
    backgroundColor: 'black'
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default CustomToast; 