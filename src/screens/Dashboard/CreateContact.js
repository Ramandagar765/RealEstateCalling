import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { C, F, L, HT, WT } from '#/commonStyles/style-layout';
import { Header, Loader } from '#/components/common';
import TextField from '#/components/common/TextField';
import { CustomButton } from '#/components/common';
import { createContact } from './store';
import { useDispatch, useSelector } from 'react-redux';
import { MyToast } from '#/Utils';

const CreateContact = ({ navigation }) => {
  const isLoading = useSelector(state => state?.dashboard?.isLoading);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: '',
    budget: '',
    priority: 'medium',
    notes: ''
  });





  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (formData?.name === '' || formData?.phone === '' || formData?.email === '' || formData?.propertyType === '' || formData?.budget === '') {
      MyToast('Please fill all the fields');
      return;
    }


    dispatch(createContact({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      propertyType: formData.propertyType,
      budget: formData.budget,
      priority: formData.priority,
      notes: formData.notes
    }));


  };
 

  return (
    <KeyboardAvoidingView style={[L.f1]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
      <Header label_center="Create New Contact" ic_left navigation={navigation} ic_left_style={[C.bgBlack]}/>
      {isLoading && <Loader isLoading={isLoading} />}
      <ScrollView style={[L.f1]} contentContainerStyle={[L.pV20]}showsVerticalScrollIndicator={false} >
        <View style={[WT('100%'), L.pH20]}>
          <TextField
            label="Name"
            placeholder="Enter contact name"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
            cntstyl={[WT('100%')]}
            style={[L.mH20, HT(40), L.pL0,]}
          />
          <TextField
            label="Phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            keyboardType="phone-pad"
            cntstyl={[WT('100%')]}
            style={[L.mH20, HT(40), L.pL0]}
          />
          <TextField
            label="Email"
            placeholder="Enter email address"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            cntstyl={[WT('100%')]}
            style={[L.mH20, HT(40), L.pL0]}
          />
          <TextField
            label="Budget"
            placeholder="Enter budget amount"
            value={formData.budget}
            onChangeText={(text) => handleInputChange('budget', text)}
            keyboardType="numeric"
            cntstyl={[WT('100%')]}
            style={[L.mH20, HT(40), L.pL0]}
          />
          <TextField
            label="Property Type"
            placeholder="Enter property type"
            value={formData.propertyType}
            onChangeText={(text) => handleInputChange('propertyType', text)}
            cntstyl={[WT('100%')]}
            style={[L.mH20, HT(40), L.pL0]}
          />
          <TextField
            label="Notes"
            placeholder="Additional notes (optional)"
            value={formData.notes}
            onChangeText={(text) => handleInputChange('notes', text)}
            multiline={true}
            numberOfLines={4}
            cntstyl={[WT('100%')]}
            style={[L.mH20, HT(40), L.pL0]}
          />
          <CustomButton
            label={'Create Contact'}
            onPress={handleSubmit}
            style={[L.mT20, WT('90%'), HT(40), L.asC, C.bgBlack]}
            labelStyle={[F.fsOne5, F.ffM, C.fcWhite]}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateContact;
