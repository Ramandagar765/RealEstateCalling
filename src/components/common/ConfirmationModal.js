// src/components/common/ConfirmationModal.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import Modal from '#/components/common/Modal';
import { F, L, C, WT, HT } from '#/commonStyles/style-layout';

const ConfirmationModal = ({
  visible,
  onClose,
  title='Log Out User',
  message='You will be logged out from the device.',
  confirmText = 'Log Out',
  cancelText = 'Cancel',
  onConfirm
}) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <Animated.View
        entering={FadeInUp.duration(500)}
        exiting={FadeInDown.duration(500)}
        style={[C.bgWhite, L.pH20, L.pV10, L.bR15, L.mH10, L.jcC]}
      >
        <Text style={[C.fcBlack, F.fsTwo2, F.fw6, F.ffM]}>{title}</Text>
        <Text style={[C.fcBlack, F.fsOne6, F.fw4, F.ffM, L.mT5]}>{message}</Text>
        
        <View style={[L.even, L.mT10, L.jcC, L.mB10]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onClose}
            style={[L.jcC, L.bR50, WT('30%'), HT(30), L.asC, L.mH5]}
          >
            <Text style={[C.fcLGray, L.taC, F.fsOne4, F.fw5, F.ffM]}>
              {cancelText}
            </Text>
          </TouchableOpacity>
          
          <View style={[WT(40)]} />
          
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={onConfirm}
            style={[C.bgRed, L.jcC, L.bR10, WT('40%'), HT(40), L.asC, L.card, L.mH5]}
          >
            <Text style={[C.fcWhite, L.taC, F.fsOne4, F.fw5, F.ffM]}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default ConfirmationModal;