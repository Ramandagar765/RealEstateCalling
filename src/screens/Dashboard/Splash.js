import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { L } from '#/commonStyles/style-layout'
import { useSelector } from 'react-redux'
import RootNavigation from '#/navigation/RootNavigation'

const Splash = () => {
  const responseDataUser = useSelector((state) => state.user);
  console.log('responseDataUser', responseDataUser?.user_token);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (responseDataUser?.user_token) {
        RootNavigation.navigate('DashBoard');
      } else {
        RootNavigation.navigate('Login');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [responseDataUser?.user_token])


  return (
    <View style={[L.f1, L.aiC, L.jcC]}>
      <Text>SplashScreen</Text>
    </View>
  )
}

export default Splash 