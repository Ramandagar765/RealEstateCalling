import { View, Text, ImageBackground, Image } from 'react-native'
import React, { useEffect } from 'react'
import { C, HT, L, WT } from '#/commonStyles/style-layout'
import { useSelector,useDispatch } from 'react-redux'
import RootNavigation from '#/navigation/RootNavigation'
import {verify_token} from './store'
import { Images } from '#/commonStyles/Images'

const Splash = () => {
  const dispatch = useDispatch();
  const responseDataUser = useSelector((state) => state.user);
  console.log('responseDataUser', responseDataUser?.user_token);
  useEffect(() => {
      dispatch(verify_token());
  }, [])


  return (
    <View style={[L.f1,L.aiC,L.jcC,C.bgWhite]}>
        <Image source={Images.INA_logo} style={[HT(400), WT(300),]} />
    </View>
  )
}

export default Splash 