import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { C, F, HT, L } from '#/commonStyles/style-layout';
import { Ionicons } from '#/components/Icons';

import AssignedContacts from '#/screens/Dashboard/AssignedContacts';
import UnsuccessfulCalls from '#/screens/Dashboard/UnsuccessfulCalls';
import RescheduledCalls from '#/screens/Dashboard/RescheduledCalls';
import ClosedDeals from '#/screens/Dashboard/ClosedDeals';
import OutcomeScreen from '#/screens/Dashboard/OutcomeScreen';
import { useSelector } from 'react-redux';
import TeamMember from '#/screens/Dashboard/TeamMember';
import LastComment from '#/screens/Dashboard/LastComment';
import CreateContact from '#/screens/Dashboard/CreateContact';

const Drawer = createDrawerNavigator();
const CustomDrawerContent = ({ navigation, state }) => {
  const dashboardStats = useSelector(state => state?.dashboard?.stats || {});
  const leadsStats = useSelector(state => state?.leads?.stats || {});
  const appMode = useSelector(state => state?.app?.mode || 'data');
  const responseDataUser = useSelector(state => state?.user);

  // Choose stats based on current mode
  const stats = appMode === 'leads' ? leadsStats : dashboardStats;
  
  const drawerItems = [
    {
      name: 'AssignedContacts',
      label: appMode === 'leads' ? 'Assigned Leads' : 'Assigned Contacts',
      icon: 'call-outline',
      count: stats.totalAssigned || stats.assigned || 0,
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
      name: 'Interested',
      label: appMode === 'leads' ? 'Interested Leads' : 'Interested',
      icon: 'heart-outline',
      count: 0,
      component: OutcomeScreen,
      params: { outcomeType: 'interested', title: appMode === 'leads' ? 'Interested Leads' : 'Interested' }
    },
    {
      name: 'FollowUp',
      label: 'Follow Up',
      icon: 'repeat-outline',
      count: 0,
      component: OutcomeScreen,
      params: { outcomeType: 'follow_up', title: 'Follow Up' }
    },
    {
      name: 'InformationSharing',
      label: 'Information Sharing',
      icon: 'information-circle-outline',
      count: 0,
      component: OutcomeScreen,
      params: { outcomeType: 'information_sharing', title: 'Information Sharing' }
    },
    {
      name: 'SiteVisitPlanned',
      label: 'Site Visit Planned',
      icon: 'calendar-outline',
      count: 0,
      component: OutcomeScreen,
      params: { outcomeType: 'site_visit_planned', title: 'Site Visit Planned' }
    },
    {
      name: 'SiteVisitDone',
      label: 'Site Visit Done',
      icon: 'checkmark-done-outline',
      count: 0,
      component: OutcomeScreen,
      params: { outcomeType: 'site_visit_done', title: 'Site Visit Done' }
    },
    {
      name: 'ReadyToMove',
      label: 'Ready to Move',
      icon: 'home-outline',
      count: 0,
      component: OutcomeScreen,
      params: { outcomeType: 'ready_to_move', title: 'Ready to Move' }
    },
    {
      name: 'Not Connected',
      label: appMode === 'leads' ? 'Not Connected Leads' : 'Not Connected Calls',
      icon: 'close-circle-outline',
      count: stats?.noAnswer || stats?.unsucessful_calls || 0,
      component: UnsuccessfulCalls
    },
    {
      name: 'ClosedDeals',
      label: 'Sales Closed',
      icon: 'trophy-outline',
      count: stats.closedDeals || stats.closed_deals || 0, 
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
        <Text style={[F.fsOne6, C.fcWhite, F.ffR, L.mT5]}>
          {appMode === 'leads' ? 'Leads Dashboard' : 'Calling Dashboard'}
        </Text>
      </View>

      {/* Navigation Items */}
      <View style={[L.f1, L.pT20]}>
        {drawerItems.map((item, index) => {
          const isActive = activeRouteIndex === index;
          
          return (
            <TouchableOpacity key={item.name} style={[L.fdR, L.aiC, L.jcSB, L.pH20, L.pV15,isActive && C.bgLightBlue]}
              onPress={() => navigation.navigate(item.name, item.params)}
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
        name="Interested" 
        component={OutcomeScreen}
        initialParams={{ outcomeType: 'interested', title: 'Interested' }}
        options={{ title: 'Interested' }}
      />
      <Drawer.Screen 
        name="FollowUp" 
        component={OutcomeScreen}
        initialParams={{ outcomeType: 'follow_up', title: 'Follow Up' }}
        options={{ title: 'Follow Up' }}
      />
      <Drawer.Screen 
        name="InformationSharing" 
        component={OutcomeScreen}
        initialParams={{ outcomeType: 'information_sharing', title: 'Information Sharing' }}
        options={{ title: 'Information Sharing' }}
      />
      <Drawer.Screen 
        name="SiteVisitPlanned" 
        component={OutcomeScreen}
        initialParams={{ outcomeType: 'site_visit_planned', title: 'Site Visit Planned' }}
        options={{ title: 'Site Visit Planned' }}
      />
      <Drawer.Screen 
        name="SiteVisitDone" 
        component={OutcomeScreen}
        initialParams={{ outcomeType: 'site_visit_done', title: 'Site Visit Done' }}
        options={{ title: 'Site Visit Done' }}
      />
      <Drawer.Screen 
        name="ReadyToMove" 
        component={OutcomeScreen}
        initialParams={{ outcomeType: 'ready_to_move', title: 'Ready to Move' }}
        options={{ title: 'Ready to Move' }}
      />
      <Drawer.Screen 
        name="Not Connected" 
        component={UnsuccessfulCalls}
        options={{ title: 'Not Connected' }}
      />
      <Drawer.Screen 
        name="RescheduledCalls" 
        component={RescheduledCalls}
        options={{ title: 'Scheduled Calls' }}
      />
      <Drawer.Screen 
        name="ClosedDeals" 
        component={ClosedDeals}
        options={{ title: 'Sales Closed' }}
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
