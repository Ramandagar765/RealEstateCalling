import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import { L ,F, C, HT, WT} from '../../commonStyles/style-layout';
import Icon  from 'react-native-vector-icons/Ionicons';
const CustomButton = (props) => {
    let { label, activeOpacity, style, txtStyle, icon, isRtl,image_style, image,onPress ,showIcon,icon_style,showImage} = props;
    return (
        <TouchableOpacity activeOpacity={0.8} {...props} 
            style={[HT(45), C.bgBlue, L.asC, L.jcC, L.aiC, L.bR4, L.even, style]}>
            {showIcon && <Icon name={icon} size={props?.size} color={props?.color} style={[icon_style]}/>}
            {showImage && <Image source={props?.image} style={[image_style]}/>}
            <Text style={[C.fcWhite,F.fsOne6, L.taC,F.ffB,txtStyle]}>{label}</Text>
        </TouchableOpacity>
    )
}
export default CustomButton;