import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { C, F, HT, L, WT } from '#/commonStyles/style-layout';
import { Ionicons } from '#/components/Icons';
import ContactAvatar from './ContactAvatar';

const CallItem = ({ item, onInfoPress, onCallPress, onWhatsAppPress, hideCallButton = false }) => {
  return (
    <TouchableOpacity 
      style={[WT('100%'), L.fdR, L.aiC, HT(70), L.asC, L.brB05, { borderColor: 'gray' }, L.pH15, L.jcC]}
      activeOpacity={0.7}
      onPress={() => onInfoPress?.(item)}
    >
      {/* Contact Avatar */}
      <ContactAvatar name={item?.name} size={40} style={[L.mR15, L.aiC, L.jcC, C.bgTrans, L.br03]} />
      
      {/* Contact Info */}
      <View style={[L.f1]}>
        <Text style={[F.ffM, F.fsOne6, F.fw6, C.fcBlack]}>{item?.name}</Text>
        <Text style={[F.fsOne6, C.fcGray, L.mT2]}>{item?.phone}</Text>
      </View>
      
      {/* Time and Actions */}
      <View style={[L.fdR, L.aiC]}>
        <Text style={[F.fsOne4, C.fcGray, L.mR15]}>{item?.lastCallTime || '2:24PM'}</Text>
        {!hideCallButton && (
          <TouchableOpacity style={[L.mR10]} onPress={() => (onCallPress ? onCallPress(item) : Linking.openURL(`tel:${item?.phone}`))}>
            <Ionicons name="call" size={20} color="gray" />
          </TouchableOpacity>
        )}
        {onWhatsAppPress && (
          <TouchableOpacity style={[L.mR10]} onPress={() => onWhatsAppPress(item)}>
            <Ionicons name="logo-whatsapp" size={20} color="gray" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => onInfoPress?.(item)}>
          <Ionicons name="chevron-forward-circle-outline" size={26} color="gray" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default CallItem;
