import React from 'react';
import { View, Text } from 'react-native';
import { C, F, L } from '#/commonStyles/style-layout';

const ContactAvatar = ({ name, size = 40, style }) => {
  // Function to get initials from name
  const getInitials = (fullName) => {
    if (!fullName) return '?';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Function to get background color based on name
  const getBackgroundColor = (name) => {
    if (!name) return C.gray400;
    
    const colors = [
      C.bgPrimary,    // Purple
      C.bgGreen,      // Green
      C.bgBlue,       // Blue
      C.bgOrange,     // Orange
      C.bgPink,       // Pink
      C.bgViolet,     // Violet
      C.bgRed,        // Red
      C.bgBrown,      // Brown
    ];
    
    // Simple hash function to get consistent color for same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index]?.backgroundColor
  };

  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(name);
  const fontSize = size * 0.4; // 40% of the avatar size

  return (
    <View
      style={[
        L.bR50,
        L.aiC,
        L.jcC,
        {
          width: size,
          height: size,
          backgroundColor: backgroundColor,
        },
        style
      ]}
    >
      <Text
        style={[
          F.fw6,
          C.white,
          {
            fontSize: fontSize,
            lineHeight: fontSize,
          }
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

export default ContactAvatar;
