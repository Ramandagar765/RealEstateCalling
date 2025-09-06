import { View, Text, ImageBackground, Image } from 'react-native'
import React, { useEffect } from 'react'
import { C, HT, L, WT } from '#/commonStyles/style-layout'
import { useSelector, useDispatch } from 'react-redux'
import RootNavigation from '#/navigation/RootNavigation'
import { verify_token } from './store'
import { Images } from '#/commonStyles/Images'
import { hasValue } from '#/Utils'
import messaging from '@react-native-firebase/messaging';


const Splash = () => {
  const dispatch = useDispatch();
  const responseDataUser = useSelector((state) => state.user);
  useEffect(() => {
    requestUserPermission()
    const timer = setTimeout(() => {
      if (hasValue(responseDataUser?.user_token)) {
        dispatch(verify_token());
      } else {
        RootNavigation.replace('Login');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [responseDataUser?.user_token])

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await messaging().getToken();
      console.log('token', token);
    }
  }

  return (
    <View style={[L.f1, L.aiC, L.jcC, C.bgWhite]}>
      <Image source={Images.INA_logo} style={[HT(400), WT(300),]} />
    </View>
  )
}

export default Splash 
