import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { C } from '../../commonStyles/style-layout';


const Loader = (props) => {
  return (
    <ActivityIndicator
      animating={props.isLoading}
      style={[
        styles.container,{backgroundColor:'rgba(1,0,2.5,.3)'},props.style
      ]}
      size={props.size || 'large'}
      color={props.color || C.blue}
    />
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: C.transparentColor,
    zIndex: 100,
  },
});
