import {
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import { C, F, HT, L, WT } from '../../commonStyles/style-layout'
import { Header, TextField, CustomButton, Loader } from '#/components/common';
import { useDispatch, useSelector } from 'react-redux';
import { doLogin } from './store';
import { MyToast } from '#/Utils';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const responseDataUser = useSelector((state) => state.user);
  const [form_data, set_formdata] = useState({
    email: '',
    password: '',
  });
  
  const handleData = (field) => (text) => {
    set_formdata({
      ...form_data,
      [field]: text,
    });
  };

  const handleLogin = () => {
    if (!form_data?.email || !form_data?.password) {
      MyToast('Please fill all fields');
      return;
    }

    dispatch(doLogin({
      email: form_data?.email,
      password: form_data?.password,
      device_token: responseDataUser?.device_token,
    }))
  };
  return (

    <View style={[L.f1]}>
      <StatusBar barStyle="dark-content" backgroundColor={'#eee'} />
      {responseDataUser?.isLoading && <Loader isLoading={responseDataUser?.isLoading} />}

      <Header
        navigation={navigation}
        label_center="Login"
        ic_left_style={[C.bgTrans]}
        ic_left_tintColor="black"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >

        <View style={[L.f1, L.jcSB, L.m3p]}>
          <View style={[L.aiC, L.jcC, HT("55%")]}>
            <TextField
              cntstyl={[L.mB12, HT(50)]}
              placeholder="Email"
              onChangeText={handleData('email')}
              value={form_data?.email}

            />
            <TextField
              cntstyl={[HT(50)]}
              placeholder="Password"
              onChangeText={handleData('password')}
              value={form_data?.password}
              isPassword={true}
            />

            <CustomButton
              label="Login"
              onPress={handleLogin}
              style={[HT(40), L.mT20, C.bgBlack, WT('90%'), L.bR10]}
              labelStyle={[F.fsOne4, F.ffM, C.fcWhite,]}
            />

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Login;


