import { View, Text } from 'react-native'
import React from 'react'
import { C, F, HT, L, WT } from '#/commonStyles/style-layout'
import { CustomButton, Header, TextField } from '#/components/common'
import { useDispatch, useSelector } from 'react-redux'
import { log_out } from './store'

const Profile = ({ navigation }) => {
  const responseDataUser = useSelector((state) => state.user);
  const dispatch = useDispatch();



  const [formData, setFormData] = React.useState({
    name: responseDataUser?.user_data?.name,
    email: responseDataUser?.user_data?.email,
    role: responseDataUser?.user_data?.role  || "caller",
    phone: responseDataUser?.user_data?.phone,
  });

  const Logout=()=>{
    dispatch(log_out())
  }

  return (
    <View style={[L.f1]}>
      <Header label_center={"Profile"} ic_left ic_left_style={[C.bgBlack]} navigation={navigation} />
      <View style={[WT('100%'),L.aiC]}>
         <TextField
          label="Name"
          label_style={[L.taL,WT('90%')]}
          value={formData?.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          style={[L.mH20, HT(40), WT('90%'), L.mT0, L.pL0]}
          cntstyl={[L.mT5]}
        />
     
        <TextField
          label="Email"
          label_style={[L.taL,WT('90%')]}
          value={formData?.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          style={[L.mH20, HT(40),L.pL0]}
        />
        <TextField
          label="Email"
          label_style={[L.taL,WT('90%')]}
          value={formData?.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          style={[L.mH20, HT(40),L.pL0]}
        />
        <View style={[L.even, L.mT20, L.jcC]}>
          <Text style={[C.fcBlack, F.fsOne5, F.ffM]}>Role:</Text>
          <View style={[WT(100)]} />
          <Text style={[C.fcBlack, F.fsOne5, F.ffM]}>{formData?.role}</Text>
        </View>
        {/* <CustomButton
          label="Update Profile"
          style={[L.mT20, WT('90%'), HT(40), L.asC, C.bgBlack]}
          onPress={() => alert('Profile Updated')}
          txtStyle={[F.fsOne5, F.ffM, C.fcWhite]}
        /> */}
        <CustomButton
          label="SignOut"
          style={[L.mT20, WT('90%'), HT(40), L.asC, C.bgBlack]}
          onPress={Logout}
          txtStyle={[F.fsOne5, F.ffM, C.fcWhite]}
        />
      </View>
    </View>
  )
}

export default Profile