import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity, AppState, Linking } from 'react-native';
import { C, L, F } from '#/commonStyles/style-layout';
import CallItem from '#/components/common/CallItem';
import ModalRoot from '#/components/common/Modal';
import CallOutcomeModal from '#/components/common/CallOutcomeModal';
import { Header, Loader, SearchableList } from '#/components/common';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRescheduledCalls, recordCall } from './store';
import EmptyList from '#/components/common/EmptyList';
import { formatDate3, hasValue } from '#/Utils';

const RescheduledCalls = ({ navigation }) => {
  const dispatch = useDispatch();
  const responseDataDashBoard = useSelector(state => state?.dashboard);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [pendingContact, setPendingContact] = useState(null);
  const [onEndReachedCalledDuringMomentum, setonEndReachedCalledDuringMomentum] = useState(false);
  const appState = useRef(AppState.currentState);
  const hasShownModal = useRef(false);
  const [rescheduledCalls, setRescheduledCalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    get_rescheduled_calls(0);
  }, []);

  useEffect(() => {
    setRescheduledCalls(responseDataDashBoard?.rescheduledCalls || []);
    // Reset the momentum flag when rescheduled calls change (new page loaded)
    setonEndReachedCalledDuringMomentum(false);
  }, [responseDataDashBoard?.rescheduledCalls]);

  const get_rescheduled_calls = (page = 0, search = '') => {
    const page_number = page + 1;
    let url = `?page=${page_number}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    console.log('rescheduled calls url', url);
    dispatch(fetchRescheduledCalls({
      url: url,
      data: {
        page: page_number,
        search: search.trim()
      }
    }));
  };

  // Listen for app state changes to detect return from phone call
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active' && pendingContact && !hasShownModal.current) {
        hasShownModal.current = true;
        setShowOutcome(true);
      }
      appState.current = nextAppState;
    });

    return () => subscription?.remove();
  }, [pendingContact]);

  const handleInfo = (item) => {
    setSelectedCall(item);
    setShowInfoModal(true);
  };

  const handleCall = (item) => {
    setPendingContact(item);
    hasShownModal.current = false;
    Linking.openURL(`tel:${item.contact.phone}`);
  };

  const handleSaveOutcome = async (callData) => {
    if (!pendingContact) return setShowOutcome(false);
    try {
      // Ensure we pass contactId, not the call record id
      const updatedCallData = {
        ...callData,
        contactId: pendingContact.contact.id
      };
      await dispatch(recordCall(updatedCallData));
      setShowOutcome(false);
      setPendingContact(null);
      hasShownModal.current = false;
      // Refresh the rescheduled calls list
      get_rescheduled_calls(0);
    } catch (error) {
      console.error('Error recording call:', error);
    }
  };

  const handleCloseOutcome = () => {
    setShowOutcome(false);
    setPendingContact(null);
    hasShownModal.current = false;
  };

  const handleUpdateStatus = (item) => {
    const contact = {
      id: item.contact?.id || item.id,
      contact: {
        id: item.contact?.id || item.id,
        name: item.contact?.name || item.name,
        phone: item.contact?.phone || item.phone
      },
      assignmentId: item.assignmentId
    };
    setPendingContact(contact);
    setShowOutcome(true);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Reset to first page when searching
    get_rescheduled_calls(0, query);
  };

  const handleRefresh = () => {
    get_rescheduled_calls(0);
  };

  const renderCallItem = ({ item }) => {
    const transformedItem = {
      id: item.id,
      name: item.contact.name,
      phone: item.contact.phone,
      lastCallTime: new Date(item?.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      callCount: 1, // Rescheduled calls show as single entry
      status: item.status,
      notes: item.notes,
      outcome: item.outcome,
      scheduledFor: item.scheduledFor,
      project: item?.project
    };

    return (
      <CallItem
        item={transformedItem}
        onInfoPress={() => handleInfo(item)}
        onCallPress={() => handleCall(item)}
        onUpdatePress={() => handleUpdateStatus(item)}
        hideCallButton={false}
        onWhatsAppPress={() => {
          const phone = item.contact.phone.replace(/\s+/g, '');
          const whatsappUrl = `whatsapp://send?phone=${phone}`;
          Linking.openURL(whatsappUrl);
        }}
      />
    );
  };

  return (
    <View style={[C.bgWhite, L.f1]}>
      <Header navigation={navigation} label_center='Rescheduled Calls' showDrawer={true} />

      {responseDataDashBoard?.isLoading && <Loader />}

      <SearchableList
        data={rescheduledCalls}
        renderItem={renderCallItem}
        searchPlaceholder="Search by name or phone..."
        searchBarStyle={[L.mH20, L.mB10]}
        listContainerStyle={[L.f1]}
        onSearchChange={handleSearchChange}
        contentContainerStyle={[L.pB20]}
        onEndReached={() => {
          console.log('onEndReached called - RescheduledCalls', {
            onEndReachedCalledDuringMomentum,
            currentPage: responseDataDashBoard?.rescheduledCallsCurrentPage,
            totalPages: responseDataDashBoard?.rescheduledCallsTotalPages,
            isLoading: responseDataDashBoard?.isLoading
          });
          if (onEndReachedCalledDuringMomentum) return;
          if (responseDataDashBoard?.rescheduledCallsCurrentPage < responseDataDashBoard?.rescheduledCallsTotalPages && !responseDataDashBoard?.isLoading) {
            console.log('Loading next page - RescheduledCalls:', responseDataDashBoard?.rescheduledCallsCurrentPage);
            get_rescheduled_calls(responseDataDashBoard?.rescheduledCallsCurrentPage, searchQuery);
            setonEndReachedCalledDuringMomentum(true);
          }
        }}
        onMomentumScrollBegin={() => { setonEndReachedCalledDuringMomentum(false) }}
        refreshing={false}
        onEndReachedThreshold={0.3}
        onRefresh={() => get_rescheduled_calls(0, searchQuery)}
        ListEmptyComponent={() => !responseDataDashBoard?.isLoading && <EmptyList />}
      />

      {/* Info Modal */}
      <ModalRoot visible={showInfoModal} onClose={() => setShowInfoModal(false)} animationType="slide" style={[L.jcB]}>
        <View style={[{ width: '100%' }, L.asC, C.bgWhite, L.bR10, L.p20]}>
          <Text style={[F.fsTwo2, F.fw7, C.fcBlack, F.ffB, L.mB15]}>Rescheduled Call Details</Text>

          {selectedCall && (
            <>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Name: {selectedCall.contact.name}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Phone: {selectedCall.contact.phone}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Email: {selectedCall.contact.email || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Last Call: {new Date(selectedCall.calledAt).toLocaleString()}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Scheduled For: {formatDate3(selectedCall?.scheduledFor)}</Text>
              {hasValue(selectedCall?.project) && <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Project: {selectedCall?.project?.name}</Text>}
              <Text style={[F.fsOne4, C.fcGray, F.ffM,]}>Notes:</Text>
              {selectedCall?.contactNotes?.map((note, index) => <Text key={index} style={[F.fsOne4, C.fcGray, F.ffM, L.mB0]}>{note?.note}</Text>)}
            </>
          )}

          <TouchableOpacity style={[{ width: '100%' }, L.aiC, L.jcC, L.pV12, L.mT20, C.bgBlue, L.bR8]} onPress={() => setShowInfoModal(false)}>
            <Text style={[F.fsOne8, C.fcWhite, F.fw5, F.ffM]}>Close</Text>
          </TouchableOpacity>
        </View>
      </ModalRoot>

      {/* Call Outcome Modal */}
      <CallOutcomeModal
        visible={showOutcome}
        onClose={handleCloseOutcome}
        contact={pendingContact}
        onSave={handleSaveOutcome}
      />
    </View>
  );
};

export default RescheduledCalls;
