import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity, AppState, Linking } from 'react-native';
import { C, L, F } from '#/commonStyles/style-layout';
import CallItem from '#/components/common/CallItem';
import ModalRoot from '#/components/common/Modal';
import CallOutcomeModal from '#/components/common/CallOutcomeModal';
import { Header, Loader, SearchableList, Timeline } from '#/components/common';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, fetchUnsuccessfulCalls, recordCall } from './store';
import { fetchUnsuccessfulLeads, recordLeadCall, fetchLeadsDashboardStats } from '#/screens/Leads/store';
import EmptyList from '#/components/common/EmptyList';

const UnsuccessfulCalls = ({ navigation }) => {
  const dispatch = useDispatch();
  const responseDataDashBoard = useSelector(state => state?.dashboard);
  const responseDataLeads = useSelector(state => state?.leads);
  const appMode = useSelector(state => state?.app?.mode || 'data');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [pendingContact, setPendingContact] = useState(null);
  const [onEndReachedCalledDuringMomentum, setonEndReachedCalledDuringMomentum] = useState(false);
  const appState = useRef(AppState.currentState);
  const hasShownModal = useRef(false);
  const [unsuccessfulCalls, setUnsuccessfulCalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Choose the appropriate data source based on mode
  const responseData = appMode === 'leads' ? responseDataLeads : responseDataDashBoard;

  useEffect(() => {
    if (appMode === 'leads') {
      get_unsuccessful_leads(0);
    } else {
      get_unsuccessful_calls(0);
    }
  }, [appMode]);

  useEffect(() => {
    if (appMode === 'leads') {
      setUnsuccessfulCalls(responseDataLeads?.unsuccessfulLeads || []);
    } else {
      setUnsuccessfulCalls(responseDataDashBoard?.unsuccessfulCalls || []);
    }
    // Reset the momentum flag when unsuccessful calls/leads change (new page loaded)
    setonEndReachedCalledDuringMomentum(false);
  }, [responseDataDashBoard?.unsuccessfulCalls, responseDataLeads?.unsuccessfulLeads, appMode]);

  const get_unsuccessful_calls = (page = 0, search = '') => {
    const page_number = page + 1;
    let url = `?page=${page_number}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    console.log('unsuccessful calls url', url);
    dispatch(fetchUnsuccessfulCalls({
      url: url,
      data: {
        page: page_number,
        search: search.trim()
      }
    }));
  };

  const get_unsuccessful_leads = (page = 0, search = '') => {
    const page_number = page + 1;
    let url = `?page=${page_number}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    console.log('unsuccessful leads url', url);
    dispatch(fetchUnsuccessfulLeads({
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
      if (appMode === 'leads') {
        await dispatch(recordLeadCall(updatedCallData));
        get_unsuccessful_leads(0);
      } else {
        await dispatch(recordCall(updatedCallData));
        get_unsuccessful_calls(0);
      }
      setShowOutcome(false);
      setPendingContact(null);
      hasShownModal.current = false;
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
    if (appMode === 'leads') {
      get_unsuccessful_leads(0, query);
    } else {
      get_unsuccessful_calls(0, query);
    }
  };
 

  const renderCallItem = ({ item }) => {
    const transformedItem = {
      id: item.id,
      name: item.contact.name,
      phone: item.contact.phone,
      lastCallTime: new Date(item.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      callCount: 1, // Unsuccessful calls show as single entry
      status: item.status,
      notes: item.notes,
      file_name:item?.contact?.file_name
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
      <Header navigation={navigation} label_center={appMode === 'leads' ? 'Not Connected Leads' : 'Not Connected Calls'} showDrawer={true} />
      
      {responseData?.isLoading && <Loader />}
      
      <SearchableList
        data={unsuccessfulCalls}
        renderItem={renderCallItem}
        searchPlaceholder="Search by name or phone..."
        searchBarStyle={[L.mH20, L.mB10]}
        listContainerStyle={[L.f1]}
        onSearchChange={handleSearchChange}
        contentContainerStyle={[L.pB20]}
        onEndReached={() => {
          const currentPage = appMode === 'leads' ? responseData?.unsuccessfulLeadsCurrentPage : responseData?.unsuccessfulCallsCurrentPage;
          const totalPages = appMode === 'leads' ? responseData?.unsuccessfulLeadsTotalPages : responseData?.unsuccessfulCallsTotalPages;
          
          console.log('onEndReached called - UnsuccessfulCalls/Leads', {
            onEndReachedCalledDuringMomentum,
            currentPage,
            totalPages,
            isLoading: responseData?.isLoading,
            appMode
          });
          if (onEndReachedCalledDuringMomentum) return;
          if (currentPage < totalPages && !responseData?.isLoading) {
            console.log('Loading next page:', currentPage);
            if (appMode === 'leads') {
              get_unsuccessful_leads(currentPage, searchQuery);
            } else {
              get_unsuccessful_calls(currentPage, searchQuery);
            }
            setonEndReachedCalledDuringMomentum(true);
          }
        }}
        onMomentumScrollBegin={() => { setonEndReachedCalledDuringMomentum(false) }}
        refreshing={false}
        onEndReachedThreshold={0.3}
        onRefresh={() => {
          if (appMode === 'leads') {
            dispatch(fetchLeadsDashboardStats());
            get_unsuccessful_leads(0, searchQuery);
          } else {
            dispatch(fetchDashboardStats());
            get_unsuccessful_calls(0, searchQuery);
          }
        }}
        ListEmptyComponent={() => !responseData?.isLoading && <EmptyList />}
      />

      {/* Info Modal */}
      <ModalRoot visible={showInfoModal} onClose={() => setShowInfoModal(false)} animationType="slide" style={[L.jcB]}>
        <View style={[{ width: '100%' }, L.asC, C.bgWhite, L.bR10, L.p20]}>
          <Text style={[F.fsTwo2, F.fw7, C.fcBlack, F.ffB, L.mB15]}>Unsuccessful Call Details</Text>

          {selectedCall && (
            <>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Name: {selectedCall.contact.name}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Phone: {selectedCall.contact.phone}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Email: {selectedCall.contact.email || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Call Date: {new Date(selectedCall.calledAt).toLocaleString()}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Duration: {selectedCall.duration} seconds</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Status: {selectedCall.status}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM,]}>Notes:</Text>
              {/* {selectedCall?.contactNotes?.map((note, index) => <Text key={index} style={[F.fsOne4, C.fcGray, F.ffM, L.mB0]}>{note?.note}</Text>)} */}
            <Timeline notes={selectedCall?.contactNotes || selectedCall?.notes || []} title="Notes" />
            </>
          )}

          <TouchableOpacity style={[{ width: '100%' }, L.aiC, L.jcC, L.pV12, L.mT20, C.bgBlue, L.bR8]} onPress={() => setShowInfoModal(false)}>
            <Text style={[F.fsOne8, C.fcWhite, F.fw5, F.ffM]}>Close</Text>
          </TouchableOpacity>
        </View>
      </ModalRoot>

      {/* Call Outcome Modal - Only Successful Options */}
      <CallOutcomeModal
        visible={showOutcome}
        onClose={handleCloseOutcome}
        contact={pendingContact}
        onSave={handleSaveOutcome}
      />
    </View>
  );
};

export default UnsuccessfulCalls;
