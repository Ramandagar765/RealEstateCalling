import { View, Text, Image } from 'react-native'
import React from 'react'
import { Images } from '../../commonStyles/images'
import { normalize, HT, WT ,F, C, L } from '../../commonStyles/style-layout'

const EmptyList = () => {
  return (
    <View style={[L.f1,L.aiC,L.jcC,HT(200)]}>
        <Text style={[F.fsOne8,F.ffM,C.fcBlack]}>No Calls Found</Text>
    </View>
  )
}

export default EmptyList