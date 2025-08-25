import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { C, F, L } from '#/commonStyles/style-layout';

const Spinner = ({ isLoading, text, size = 'small', color = '#000' }) => {
    return (
        <View style={[styles.container, L.pV10, L.aiC]}>
            <ActivityIndicator size={size} color={color} animating={isLoading}/>
            {/* {text && <Text style={[F.fsOne3, F.ffR, L.mT5, C.fcGray]}>{text}</Text>} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height:50,
        width:'100%',
    }
});

export default Spinner;
