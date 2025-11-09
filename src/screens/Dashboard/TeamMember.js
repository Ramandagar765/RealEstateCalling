import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { C, F, L, HT, WT } from '#/commonStyles/style-layout';
import { Header } from '#/components/common';
import { Ionicons } from '#/components/Icons';
import { team_dashboard } from './store';
import { useDispatch, useSelector } from 'react-redux';
import RootNavigation from '#/navigation/RootNavigation';


const outcomeMap = {
      'Interested': 'interested',
      'Not Interested': 'not-interested',
      'Follow Up': 'follow_up',
      'Info Sharing': 'information_sharing',
      'Ready to Move': 'ready_to_move',
      'Site Visit Planned': 'site_visit_planned',
      'Site Visit Done': 'site_visit_done',
      'Sales Closed': 'sales_closed',
      'Not Connected': 'not_connected',
      'Data Left': 'data_left',
    };

const TeamMember = ({ navigation }) => {
  const responseDataDashBoard = useSelector(state => state?.dashboard);
  const currentMode = useSelector(state => state?.app?.mode || 'data');
  const dispatch = useDispatch();
  const [teamMembers, setTeamMembers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Fetch team dashboard based on mode
  useEffect(() => {
    const contactType = currentMode === 'leads' ? 1 : 0;
    dispatch(team_dashboard({ contactType }));
  }, [currentMode, dispatch]);

  useEffect(() => {
    setTeamMembers(responseDataDashBoard?.team_members_dasboard || []);
  }, [responseDataDashBoard?.team_members_dasboard]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStatPress = (member, statLabel, statValue) => {
    console.log('statLabel', statLabel, 'statValue', statValue)

    

    const outcome = outcomeMap[statLabel];
    console.log('outcome', outcome)
    if (outcome) {
      RootNavigation.navigate('TeamMemberCalls', {
        memberId: member.id,
        memberName: member.name,
        outcome: outcome,
        outcomeLabel: statLabel,
        statValue: statValue,
      });
    }
  };

  const renderStatItem = (label, value, member) => (
    <TouchableOpacity 
      style={[L.aiC, L.jcC, { width: 80 }]}
      onPress={() => handleStatPress(member, label, value)}
      activeOpacity={value > 0 ? 0.7 : 1}
    >
      <Text style={[F.fsOne6, F.ffB, C.fcBlack, L.mB2]}>{value || 0}</Text>
      <Text style={[F.fsOne2, F.ffR, C.fcGray, L.taC]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderStatsCard = (member) => {
    const stats = [
      { label: 'Data Allotted', value: member?.dataAllotted },
      { label: 'Data Left', value: member?.dataLeft },
      { label: 'Interested', value: member?.interested },
      { label: 'Not Interested', value: member?.notInterested },
      { label: 'Not Connected', value: member?.notConnected },
      { label: 'Follow Up', value: member?.followup },
      { label: 'Info Sharing', value: member?.informationSharing },
      { label: 'Ready to Move', value: member?.readyToMove },
      { label: 'Site Visit Planned', value: member?.siteVisitPlanned },
      { label: 'Site Visit Done', value: member?.siteVisitDone },
      { label: 'Sales Closed', value: member?.salesClosed },
    ];

    return (
      <View style={[C.bgWhite, L.bR10,L.mT10]}>
        <Text style={[C.fcGray,L.mL10]}>swipe right to view more details</Text>
        <FlatList
          data={stats}
          renderItem={({ item }) => renderStatItem(item.label, item.value, member)}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[L.pV5]}
          ItemSeparatorComponent={() => <View style={[L.mR15]} />}
        />
      </View>
    );
  };

  const renderTeamMemberCard = ({ item: member }) => {
    const isExpanded = expandedId === member.id;

    return (
      <View style={[C.bgWhite, L.bR15, L.p15, L.mB15, L.card2]}>
        <TouchableOpacity onPress={() => toggleExpand(member.id)} activeOpacity={0.7}>
          {/* Header with status */}
          <View style={[L.fdR, L.jcSB, L.aiC, L.mB10]}>
            <View style={[L.fdR, L.aiC, L.flex]}>
              <View style={[L.flex]}>
                <Text style={[F.fsOne6, F.ffS, C.fcBlack, L.mB2]} numberOfLines={1}>
                  {member.name}
                </Text>
                <View style={[L.fdR, L.aiC]}>
                  <View
                    style={[
                      WT(8),
                      HT(8),
                      member.isActive ? C.bgGreen : C.bgRed,
                      L.bR50,
                      L.mR5,
                    ]}
                  />
                  <Text style={[F.fsOne2, F.ffR, C.fcGray]}>
                    {member.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Dropdown Icon */}
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={C.fcGray}
            />
          </View>

          {/* Contact Info */}
          <View style={[L.mB5]}>
            <View style={[L.fdR, L.aiC, L.mB5]}>
              <Ionicons name="mail-outline" size={16} color={C.fcGray} style={L.mR8} />
              <Text style={[F.fsOne3, F.ffR, C.fcGray]} numberOfLines={1}>
                {member.email}
              </Text>
            </View>
            <View style={[L.fdR, L.aiC]}>
              <Ionicons name="call-outline" size={16} color={C.fcGray} style={L.mR8} />
              <Text style={[F.fsOne3, F.ffR, C.fcGray]}>{member.phone}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Stats - Only show when expanded */}
        {isExpanded && renderStatsCard(member)}
      </View>
    );
  };

  const renderHeader = () => (
    <View style={[L.card2, L.bR15, L.p15, L.mT10, L.mB15]}>
      <Text style={[F.fsOne8, F.ffB, C.fcBlack, L.mB5]}>Team Overview</Text>
      <Text style={[F.fsOne4, F.ffR, C.fcBlack]}>{teamMembers.length} Team Members</Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={[L.aiC, L.jcC, L.mT50]}>
      <Ionicons name="people-outline" size={60} color={C.fcGray} />
      <Text style={[F.fsOne6, F.ffM, C.fcGray, L.mT10, L.taC]}>No team members found</Text>
      <Text style={[F.fsOne3, F.ffR, C.fcGray, L.mT5, L.taC]}>
        Team members will appear here once added
      </Text>
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  const handleRefresh = () => {
    const contactType = currentMode === 'leads' ? 1 : 0;
    dispatch(team_dashboard({ contactType }));
  };

  return (
    <View style={[C.bgScreen, L.f1]}>
      <Header label_center="Team Members" navigation={navigation} showDrawer={true} />

      <FlatList
        data={teamMembers}
        renderItem={renderTeamMemberCard}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[L.pH15]}
        onRefresh={handleRefresh}
        refreshing={responseDataDashBoard?.isLoading || false}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 200,
          offset: 200 * index,
          index,
        })}
      />
    </View>
  );
};

export default TeamMember;