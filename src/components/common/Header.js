import React from 'react';
import { Text, View, StatusBar, Image, TouchableOpacity } from 'react-native';
import { C, F, L, WTD, HTD, HT, WT } from '../../commonStyles/style-layout';
import { Images } from '../../commonStyles/Images';
import { MaterialIcon, Ionicons } from '../Icons/index'
const Header = ({
    style,
    txt_style,
    label_right,
    ic_left,
    ic_left_tintColor,
    card,
    statusBarColor,
    barStyle,
    label_center,
    height,
    label_left,
    ic_profile,
    ic_left_style,
    navigation,
    ic_right,
    ic_right_style,
    ic_right_tintColor,
    hc_color,
    onPressRight,
    showDrawer = false
}) => {
    return (
        <View style={[L.headerView, height ? height : HT(60), style, ]}>
            <StatusBar barStyle="dark-content" backgroundColor={hc_color} />
            <View style={[L.aiC, WT(label_left ? '85%' : '20%'), HT('100%'), L.even, L.aiC, L.jcSB]}>
                {showDrawer && (
                    <TouchableOpacity 
                        activeOpacity={0.7} 
                        onPress={() => navigation.openDrawer()} 
                        style={[WT(39), HT(39), L.jcC, L.aiC, L.bR10, C.bgTrans]}
                    >
                        <Ionicons name="menu" size={24} color='black' />
                    </TouchableOpacity>
                )}
                {ic_left && <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={[WT(39),HT(39), L.jcC, L.aiC, L.bR10, C.bgGreen, ic_left_style,]}>
                    <Image source={ic_left} style={[{ width: 10.77, height: 18, tintColor: ic_left_tintColor ? ic_left_tintColor : 'white' }]} />
                </TouchableOpacity>}
                {label_left &&
                    <Text style={[C.lColor, F.ffB, F.fsOne8, txt_style, L.mH10]} numberOfLines={1}>{label_left}</Text>
                }
                {label_right &&
                    <Text style={[C.lColor, F.ffB, F.fsOne8, L.taR, txt_style]} numberOfLines={1}>{label_right}</Text>
                }
            </View>
            <View style={[L.aiC, L.jcC, WT('60%'), HT('100%'), L.even]}>
                {label_center &&
                    <Text style={[F.ffB, F.fsTwo, F.ffB, L.taC, txt_style, L.mH10, C.fcBlack]} numberOfLines={1}>{label_center}</Text>
                }
            </View>
            <View style={[L.aiC, WT(label_left ? '13%' : '20%'), HT('100%'), L.even, L.jcB]}>
                {ic_right && <TouchableOpacity activeOpacity={0.7} style={[WT(39),HT(39), L.jcC,L.aiC,L.bR10,  C.bgGreen, ic_right_style,]} onPress={onPressRight}>
                    <Ionicons name={ic_right} size={20}/>
                </TouchableOpacity>}
            </View>
        </View>
    )
}

export default Header;
