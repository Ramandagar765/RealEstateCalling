import { View, Text, ImageBackground, Image } from 'react-native'
import React, { useEffect } from 'react'
import { C, HT, L, WT } from '#/commonStyles/style-layout'
import { useSelector, useDispatch } from 'react-redux'
import RootNavigation from '#/navigation/RootNavigation'
import { verify_token } from './store'
import { Images } from '#/commonStyles/Images'
import { hasValue } from '#/Utils'
import { set_device_token } from '../User/store'
import messaging from '@react-native-firebase/messaging'

const Splash = () => {
  const dispatch = useDispatch();
  const responseDataUser = useSelector((state) => state.user);
  useEffect(() => {
    getDeviceToken();
    const timer = setTimeout(() => {
      if (hasValue(responseDataUser?.user_token)) {
        dispatch(verify_token());
      } else {
        RootNavigation.reset('Login');
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, [responseDataUser?.user_token])


  const getDeviceToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      dispatch(set_device_token({
        device_token: fcmToken,
      }));
    } catch (error) {
      console.error('Error getting device token:', error);
    }
  };


  return (
    <View style={[L.f1, L.aiC, L.jcC, C.bgWhite]}>
      <Image source={Images.INA_logo} style={[HT(400), WT(300),]} />
    </View>
  )
}

export default Splash 
