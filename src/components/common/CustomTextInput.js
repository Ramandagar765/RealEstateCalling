import { View, Text, StyleSheet,TextInput } from 'react-native'
import React from 'react'
import { C, F, L } from '../../commonStyles/style-layout'



const CustomTextInput = ({viewStyle, title, placeholder, multiline,showText, value, txtStyle,...props  }) => (
    <View style={[viewStyle]}>
        {!showText && <Text style={[C.fcBlack,F.fsOne9,L.pV10,txtStyle]}>{title}</Text>}
        <TextInput
            placeholder={placeholder}
            multiline={multiline}
            style={[styles.input, multiline && styles.multilineInput,{fontSize:100,fontWeight:'800'}]}
            value={value}
            {...props}
        />
    </View>
)

const styles = StyleSheet.create({
 
   
    input: {
        backgroundColor: 'white',
        paddingLeft: 20,
        borderRadius: 10,
        marginBottom: 20,
        height: 60,
    },
    multilineInput: {
        height: 150,
        textAlignVertical: 'top',
    },
})

export default CustomTextInput


