import React from 'react';
import { View, Text } from 'react-native';
import { C, F, L } from '#/commonStyles/style-layout';

const CallStats = ({ stats }) => {
  return (
    <View style={[
      L.fdR,
      L.mH20,
      L.mT10,
      L.mB15,
      L.p15,
      L.bR10,
      C.bgLightGray,
      L.shadow2
    ]}>
      <View style={[L.f1, L.aiC]}>
        <Text style={[F.fsTwo2, F.fw7, C.fcBlack, F.ffB]}>
          {stats.total}
        </Text>
        <Text style={[F.fsOne6, C.fcGray, F.ffR, L.mT2]}>
          Total Calls
        </Text>
      </View>
      
      <View style={[L.f1, L.aiC]}>
        <Text style={[F.fsTwo2, F.fw7, C.green, F.ffB]}>
          {stats.successful}
        </Text>
        <Text style={[F.fsOne6, C.fcGray, F.ffR, L.mT2]}>
          Successful
        </Text>
      </View>
      
      <View style={[L.f1, L.aiC]}>
        <Text style={[F.fsTwo2, F.fw7, C.fcRed, F.ffB]}>
          {stats.unsuccessful}
        </Text>
        <Text style={[F.fsOne6, C.fcGray, F.ffR, L.mT2]}>
          Unsuccessful
        </Text>
      </View>
      
      <View style={[L.f1, L.aiC]}>
        <Text style={[F.fsTwo2, F.fw7, C.blue, F.ffB]}>
          {stats.successRate}%
        </Text>
        <Text style={[F.fsOne6, C.fcGray, F.ffR, L.mT2]}>
          Success Rate
        </Text>
      </View>
    </View>
  );
};

export default CallStats;
