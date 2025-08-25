import { View, Modal, TouchableWithoutFeedback,KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { C, F, HT, WT, L } from '#/commonStyles/style-layout'
import Loader from './Loader'

const ModalRoot = (props) => {
  return (
    <Modal
      transparent={true}
      supportedOrientations={['portrait', 'landscape']}
      visible={props.visible}
      animationType={props.animationType || 'fade'}
      onRequestClose={props.onClose}>
      {props.isLoading && <Loader isLoading={props.isLoading} style={[C.bgTrans]}/>}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[HT('100%')]}>
      <TouchableWithoutFeedback onPress={props.onClose}>
        <View style={[L.f1, L.jcC, C.overlay,props.style]}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={[props.style]}>
              {props.children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default ModalRoot