import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { C, L, F } from '#/commonStyles/style-layout';
import { useSelector, useDispatch } from 'react-redux';
import { setAppMode } from '#/redux/appSlice';

const ModeToggle = () => {
  const dispatch = useDispatch();
  const currentMode = useSelector(state => state?.app?.mode || 'data');

  const handleModeChange = (mode) => {
    if (mode !== currentMode) {
      dispatch(setAppMode(mode));
    }
  };

  return (
    <View style={[L.fdR, L.mH20, L.mV10, L.bR10, C.bgLGray, L.p5]}>
      <TouchableOpacity
        style={[
          L.f1,
          L.pV10,
          L.bR8,
          L.aiC,
          L.jcC,
          currentMode === 'data' ? C.bgBlue : C.bgTransparent
        ]}
        onPress={() => handleModeChange('data')}
        activeOpacity={0.7}
      >
        <Text style={[
          F.fsOne6,
          F.fw6,
          F.ffM,
          currentMode === 'data' ? C.fcWhite : C.fcBlack
        ]}>
          Data
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          L.f1,
          L.pV10,
          L.bR8,
          L.aiC,
          L.jcC,
          currentMode === 'leads' ? C.bgBlue : C.bgTransparent
        ]}
        onPress={() => handleModeChange('leads')}
        activeOpacity={0.7}
      >
        <Text style={[
          F.fsOne6,
          F.fw6,
          F.ffM,
          currentMode === 'leads' ? C.fcWhite : C.fcBlack
        ]}>
          Leads
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ModeToggle;

