import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { C, F, L, WT } from '#/commonStyles/style-layout';

const TabBar = ({ activeTab, onTabPress, tabs }) => {
  const renderTabButton = (tab, label) => (
    <TouchableOpacity
      key={tab}
      style={[L.aiC,L.jcC,L.pV5,WT('33%'),activeTab===tab && C.bgWhite,L.bR10]}
      onPress={() => onTabPress(tab)}
      activeOpacity={0.7}
    >
      <Text style={[F.fsOne4,F.fw5,F.ffM,activeTab === tab ? C.fcBlack : C.fcGray]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[L.even,L.mB10,L.bR8,WT('94%'),L.asC,{backgroundColor:'#F2F2F2'},L.jcSB,L.p3]}>
      {tabs.map(({ key, label }) => renderTabButton(key, label))}
    </View>
  );
};

export default TabBar;
