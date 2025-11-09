import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { C, L, F } from '#/commonStyles/style-layout';
import CallItem from '#/components/common/CallItem';
import { Header, Loader, Timeline } from '#/components/common';
import ModalRoot from '#/components/common/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamMemberCalls } from './store';
import EmptyList from '#/components/common/EmptyList';
import { formatDate3, hasValue } from '#/Utils';

const TeamMemberCalls = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { memberId, memberName, outcome, outcomeLabel } = route.params;
  
  const responseData = useSelector(state => state?.dashboard);
  const [refreshing, setRefreshing] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);

  // Get pagination data from Redux state
  const calls = responseData?.teamMemberCalls || [];
  const pagination = responseData?.teamMemberCallsPagination || {};
  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 1;
  const hasMore = currentPage < totalPages;

  useEffect(() => {
    loadCalls(1, true);
  }, [memberId, outcome]);

  const loadCalls = async (pageNum = 1, reset = false) => {
    try {
      await dispatch(fetchTeamMemberCalls({
        memberId,
        outcome,
        page: pageNum,
        size: 20
      })).unwrap();
    } catch (error) {
      console.error('Error loading team member calls:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCalls(1, true);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (hasMore && !responseData?.isLoading) {
      loadCalls(currentPage + 1);
    }
  };

  const handleInfo = (item) => {
    setSelectedCall(item);
    setShowInfoModal(true);
  };

  const renderCallItem = ({ item }) => (
    <CallItem
      item={{
        ...item,
        name: item?.contact?.name,
        phone: item?.contact?.phone,
      }}
      navigation={navigation}
      onInfoPress={() => handleInfo(item)}
      onPress={() => handleInfo(item)}
      show_call={false}
    />
  );

  const renderHeader = () => (
      <Text style={[F.fsOne8, F.ffB, C.fcBlack, L.mB5]}>{memberName}</Text>
  );

  return (
    <View style={[C.bgScreen, L.f1]}>
      {responseData?.isLoading && <Loader isLoading={responseData?.isLoading} /> }
      <Header 
        label_center={`${outcomeLabel}`}
        navigation={navigation} 
        showBack={true}
        ic_left
        ic_left_style={[C.bgBlack]}
      />

        
        <FlatList
          data={calls}
          renderItem={renderCallItem}
          keyExtractor={(item, index) => `${item.id || index}`}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={<EmptyList/>}
          contentContainerStyle={[L.pH15]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[C.fcBlue]}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={15}
        />

      {/* Info Modal */}
      <ModalRoot visible={showInfoModal} onClose={() => setShowInfoModal(false)} animationType="slide" style={[L.jcB]}>
        <View style={[{ width: '100%' }, L.asC, C.bgWhite, L.bR10, L.p20]}>
          <Text style={[F.fsTwo2, F.fw7, C.fcBlack, F.ffB, L.mB15]}>Call Details</Text>

          {selectedCall && (
            <>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Name: {selectedCall.contact?.name || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Phone: {selectedCall.contact?.phone || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Email: {selectedCall.contact?.email || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Call Date: {selectedCall.calledAt ? new Date(selectedCall.calledAt).toLocaleString() : 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Outcome: {selectedCall.outcome || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Status: {selectedCall.status || 'N/A'}</Text>
              {selectedCall.scheduledFor && <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Scheduled For: {formatDate3(selectedCall?.scheduledFor)}</Text>}
              {hasValue(selectedCall?.project) && <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Project: {selectedCall?.project?.name}</Text>}
              {selectedCall.duration && <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Duration: {selectedCall.duration} seconds</Text>}
              
              {/* Notes Timeline */}
              {selectedCall?.contactNotes && selectedCall.contactNotes.length > 0 && (
                <Timeline notes={selectedCall.contactNotes} title="Notes" />
              )}
              {selectedCall?.notes && !selectedCall?.contactNotes && (
                <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Notes: {selectedCall.notes}</Text>
              )}
            </>
          )}

          <TouchableOpacity style={[{ width: '100%' }, L.aiC, L.jcC, L.pV12, L.mT20, C.bgBlue, L.bR8]} onPress={() => setShowInfoModal(false)}>
            <Text style={[F.fsOne8, C.fcWhite, F.fw5, F.ffM]}>Close</Text>
          </TouchableOpacity>
        </View>
      </ModalRoot>

    </View>
  );
};

export default TeamMemberCalls;