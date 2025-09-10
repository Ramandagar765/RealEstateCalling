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
import TeamMember from '#/screens/Dashboard/TeamMember';
import LastComment from '#/screens/Dashboard/LastComment';
import CreateContact from '#/screens/Dashboard/CreateContact';

const Drawer = createDrawerNavigator();
const CustomDrawerContent = ({ navigation, state }) => {
  const dashboardStats = useSelector(state => state?.dashboard?.stats || {});
  const responseDataUser = useSelector(state => state?.user);

  
  const drawerItems = [
    {
      name: 'AssignedContacts',
      label: 'Assigned Contacts',
      icon: 'call-outline',
      count: dashboardStats.totalAssigned || 0,
      component: AssignedContacts
    },
    {
      name: 'CreateContact',
      label: 'Create Contact',
      icon: 'add-circle-outline',
      count: 0,
      component: CreateContact
    },
    // {
    //   name: 'SuccessfulCalls',
    //   label: 'Successful Calls',
    //   icon: 'checkmark-circle-outline',
    //   count: dashboardStats.successful || 0,
    //   component: SuccessfulCalls
    // },
    {
      name: 'ScheduledCalls',
      label: 'Scheduled Calls',
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
      count: dashboardStats.closedDeals, 
      component: ClosedDeals
    },
    ...(responseDataUser?.user_data?.role === 'team_lead' ? [{
      name: 'Team Member',
      label: 'Team Member',
      icon: 'people-outline',
      count: 0,
      component: TeamMember
    }] : []),
    {
      name: 'Last Comments',
      label: 'Last Comments',
      icon: 'chatbubble-ellipses-outline',
      count: 0,
      component: LastComment
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
                <Ionicons name={item.icon} size={24} color='black' />
                <Text style={[F.fsOne6, F.fw5, F.ffM, L.mL15,isActive ? C.fcBlue : C.fcBlack]}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
      <Drawer.Screen 
        name="CreateContact" 
        component={CreateContact}
        options={{ title: 'Create Contact' }}
      />
      <Drawer.Screen 
        name="ScheduledCalls" 
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
       <Drawer.Screen 
        name="Team Member" 
        component={TeamMember}
        options={{ title: 'Team Member' }}
      />
      <Drawer.Screen
        name="Last Comments"
        component={LastComment}
        options={{ title: 'Last Comments' }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
