import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { C, F, HT, L } from '#/commonStyles/style-layout';
import { Ionicons } from '#/components/Icons';

import AssignedContacts from '#/screens/Dashboard/AssignedContacts';
import SuccessfulCalls from '#/screens/Dashboard/SuccessfulCalls';
import RescheduledCalls from '#/screens/Dashboard/RescheduledCalls';
import UnsuccessfulCalls from '#/screens/Dashboard/UnsuccessfulCalls';
import ClosedDeals from '#/screens/Dashboard/ClosedDeals';
import { useSelector } from 'react-redux';

const Drawer = createDrawerNavigator();
const CustomDrawerContent = ({ navigation, state }) => {
  const dashboardStats = useSelector(state => state?.dashboard?.stats || {});
  
  const drawerItems = [
    {
      name: 'AssignedContacts',
      label: 'Assigned Contacts',
      icon: 'call-outline',
      count: dashboardStats.totalAssigned || 0,
      component: AssignedContacts
    },
    // {
    //   name: 'SuccessfulCalls',
    //   label: 'Successful Calls',
    //   icon: 'checkmark-circle-outline',
    //   count: dashboardStats.successful || 0,
    //   component: SuccessfulCalls
    // },
    {
      name: 'RescheduledCalls',
      label: 'Rescheduled Calls',
      icon: 'time-outline',
      count: dashboardStats.scheduledCalls || 0,
      component: RescheduledCalls
    },
    {
      name: 'UnsuccessfulCalls',
      label: 'Unsuccessful Calls',
      icon: 'close-circle-outline',
      count: dashboardStats?.noAnswer || 0,
      component: UnsuccessfulCalls
    },
    {
      name: 'ClosedDeals',
      label: 'Closed Deals',
      icon: 'trophy-outline',
      count: dashboardStats.closedDeals, // This might be a separate count from backend
      component: ClosedDeals
    }
  ];

  const activeRouteIndex = state.index;

  return (
    <View style={[L.f1, C.bgWhite]}>
      {/* Header */}
      <View style={[L.pH20, L.pV30, C.bgBlue]}>
      <View style={[HT(50)]}/>
        <Text style={[F.fsTwo4, F.fw7, C.fcWhite, F.ffB]}>Real Estate</Text>
        <Text style={[F.fsOne6, C.fcWhite, F.ffR, L.mT5]}>Calling Dashboard</Text>
      </View>

      {/* Navigation Items */}
      <View style={[L.f1, L.pT20]}>
        {drawerItems.map((item, index) => {
          const isActive = activeRouteIndex === index;
          
          return (
            <TouchableOpacity key={item.name} style={[L.fdR, L.aiC, L.jcSB, L.pH20, L.pV15,isActive && C.bgLightBlue]}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.7}>
              <View style={[L.fdR, L.aiC]}>
                <Ionicons name={item.icon} size={24} color={isActive ? C.colorPrimary : '#666'} />
                <Text style={[F.fsOne6, F.fw5, F.ffM, L.mL15,isActive ? C.fcBlue : C.fcBlack]}>{item.label}</Text>
              </View>
              
              <View style={[L.aiC, L.jcC, L.bR50, L.pH10, L.pV4,L.card2,{ backgroundColor: isActive ? 'white' : '#E0E0E0' }]}>
                <Text style={[F.fsOne2, F.fw6, F.ffM,isActive ? 'black' : C.fcGray]}>{item.count}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Footer */}
      <View style={[L.pH20, L.pV2, C.brLightest,L.mB10,L.acC,L.mL10]}>
        <TouchableOpacity style={[L.fdR, L.aiC]}onPress={() => {}}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mL10]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 280,
        }
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="AssignedContacts"
    >
      <Drawer.Screen 
        name="AssignedContacts" 
        component={AssignedContacts}
        options={{ title: 'Assigned Contacts' }}
      />
      {/* <Drawer.Screen 
        name="SuccessfulCalls" 
        component={SuccessfulCalls}
        options={{ title: 'Successful Calls' }}
      /> */}
      <Drawer.Screen 
        name="RescheduledCalls" 
        component={RescheduledCalls}
        options={{ title: 'Rescheduled Calls' }}
      />
      <Drawer.Screen 
        name="UnsuccessfulCalls" 
        component={UnsuccessfulCalls}
        options={{ title: 'Unsuccessful Calls' }}
      />
      <Drawer.Screen 
        name="ClosedDeals" 
        component={ClosedDeals}
        options={{ title: 'Closed Deals' }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
