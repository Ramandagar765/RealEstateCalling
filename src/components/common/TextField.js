import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from 'react-native';
import { C , WT , HT, L, F, h} from '../../commonStyles/style-layout';
import Icon from 'react-native-vector-icons/Ionicons';

const TextField = (props) => {
    const [isSecureTextEntry, setIsSecureTextEntry] = useState(true);
    const [isFocused, setIsFocused] = useState(false);

    const updateSecureTextEntry = () => {
        setIsSecureTextEntry((prev) => !prev);
    };
    
    const handleChangeText = (text) => {
        if (props.onChangeText) {
            props.onChangeText(text);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (props.onFocus) {
            props.onFocus();
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (props.onBlur) {
            props.onBlur();
        }
    };

    return (
        <View style={[
            WT('90%'), 
            C.bgWhite, 
            L.mT10, 
            L.bR10, 
            props?.cntstyl, 
            L.fdR, 
            L.aiC,
            isFocused && { borderWidth: 1, borderColor: '#000000' }
        ]}>
            
                <TextInput 
                    style={[C.fcBlack, props.style, F.ffM, F.fsOne4, HT(40), L.pL10, props?.isPassword ? WT('90%'):  WT('100%'), L.pV0]}
                    placeholderTextColor='grey'
                    autoCapitalize="none"  
                    editable={props.editable} 
                    autoFocus={props.autoFocus} 
                    underlineColorAndroid='transparent'
                    onSubmitEditing={() => { props.onSubmitEditing && props.onSubmitEditing() }}
                    ref={(input) => props.inputRef && props.inputRef(input)} 
                    returnKeyType="done" 
                    selectionColor={C.viloet}
                    value={props.value}
                    secureTextEntry={props.isPassword && isSecureTextEntry}
                    onChangeText={handleChangeText}
                    {...props}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    numberOfLines={props.numberOfLines}
                />
          
          {
            props?.isPassword && (props?.editable !== false) && (
                <TouchableOpacity
                style={[]}
                hitSlop={{
                  top: 10, bottom: 10, left: 10, right: 10
                }}
                onPress={updateSecureTextEntry}>
                <Icon name={isSecureTextEntry?'eye-off-outline':'eye-outline'} size={25} color='black' />
              </TouchableOpacity>
            )
          }
        </View>
    );
};

export default TextField;

const styles = StyleSheet.create({
    
});
