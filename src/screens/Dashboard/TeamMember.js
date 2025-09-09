import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { C, F, L, WTD, HTD, HT, WT } from '#/commonStyles/style-layout';
import { Header } from '#/components/common';
import { Ionicons } from '#/components/Icons';
import { team_dashboard } from './store';
import { useDispatch, useSelector } from 'react-redux';

const TeamMember = ({ navigation }) => {
  const responseDataDashBoard = useSelector(state => state?.dashboard);
  const dispatch = useDispatch();
  const [teamMembers, setTeamMembers] = useState([]);



  useEffect(() => {
    dispatch(team_dashboard())
  }, [])

  useEffect(() => {
    setTeamMembers(responseDataDashBoard?.team_members_dasboard || []);
  }, [responseDataDashBoard?.team_members_dasboard])


  const renderStatsCard = (stats) => (
    <View style={[C.bgWhite, L.bR15, L.p15, L.card2]}>
      <View style={[L.fdR, L.jcSB, L.mB8]}>
        <View style={[L.aiC]}>
          <Text style={[F.fsOne8, F.ffB, C.fcBlack, L.mB2]}>{stats.totalCalls}</Text>
          <Text style={[F.fsOne2, F.ffR, C.fcGray, L.taC]}>Total Calls</Text>
        </View>
        <View style={[L.aiC]}>
          <Text style={[F.fsOne8, F.ffB, C.fcBlack, L.mB2]}>{stats.successfulCalls}</Text>
          <Text style={[F.fsOne2, F.ffR, C.fcGray, L.taC]}>Successful</Text>
        </View>
        <View style={[L.aiC]}>
          <Text style={[F.fsOne8, F.ffB, C.fcBlack, L.mB2]}>{stats.activeAssignments}</Text>
          <Text style={[F.fsOne2, F.ffR, C.fcGray, L.taC]}>Total Calls</Text>
        </View>
        <View style={[L.aiC]}>
          <Text style={[F.fsOne8, F.ffB, C.fcBlack, L.mB2]}>{stats.deals}</Text>
          <Text style={[F.fsOne2, F.ffR, C.fcGray, L.taC]}>Deals</Text>
        </View>
      </View>
    </View>
  );

  const renderTeamMemberCard = ({ item: member }) => (
    <View style={[C.bgWhite, L.bR15, L.p15, L.mB15, L.card2]}>
      {/* Header with status */}
      <View style={[L.fdR, L.jcSB, L.aiC, L.mB10]}>
        <View style={[L.fdR, L.aiC]}>

          <View>
            <Text style={[F.fsOne6, F.ffS, C.fcBlack, L.mB2]} numberOfLines={1}>
              {member.name}
            </Text>
            <View style={[L.fdR, L.aiC]}>
              <View style={[
                WT(8), HT(8),
                member.isActive ? C.bgGreen : C.bgRed,
                L.bR50, L.mR5
              ]} />
              <Text style={[F.fsOne2, F.ffR, C.fcGray]}>
                {member.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>


      </View>

      {/* Contact Info */}
      <View style={[L.mB10]}>
        <View style={[L.fdR, L.aiC, L.mB5]}>
          <Ionicons name="mail-outline" size={16} color={C.fcGray} style={L.mR8} />
          <Text style={[F.fsOne3, F.ffR, C.fcGray]} numberOfLines={1}>
            {member.email}
          </Text>
        </View>
        <View style={[L.fdR, L.aiC]}>
          <Ionicons name="call-outline" size={16} color={C.fcGray} style={L.mR8} />
          <Text style={[F.fsOne3, F.ffR, C.fcGray]}>
            {member.phone}
          </Text>
        </View>
      </View>

      {/* Stats */}
      {renderStatsCard(member.stats)}
    </View>
  );

  const renderHeader = () => (
    <View style={[L.card2, L.bR15, L.p15, L.mT10, L.mB15]}>
      <Text style={[F.fsOne8, F.ffB, C.fcBlack, L.mB5]}>
        Team Overview
      </Text>
      <Text style={[F.fsOne4, F.ffR, C.fcBlack]}>
        {teamMembers.length} Team Members
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={[L.aiC, L.jcC, L.mT50]}>
      <Ionicons name="people-outline" size={60} color={C.fcGray} />
      <Text style={[F.fsOne6, F.ffM, C.fcGray, L.mT10, L.taC]}>
        No team members found
      </Text>
      <Text style={[F.fsOne3, F.ffR, C.fcGray, L.mT5, L.taC]}>
        Team members will appear here once added
      </Text>
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  const handleRefresh = () => {
    dispatch(team_dashboard())
  }

  return (
    <View style={[C.bgScreen, L.f1]}>
      <Header
        label_center="Team Members"
        navigation={navigation}
        showDrawer={true}
      />

      <FlatList
        data={teamMembers}
        renderItem={renderTeamMemberCard}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={[L.pH15]}
        onRefresh={() => dispatch(team_dashboard())}
        refreshing={responseDataDashBoard?.isLoading || false}
        colors={[C.colorPrimary]}
        tintColor={C.colorPrimary}
        progressBackgroundColor={C.colorPrimary}
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
