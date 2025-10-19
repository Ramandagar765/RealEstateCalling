import React, { useEffect, useState, useRef } from 'react';
import { View, AppState, Linking, Text, TouchableOpacity } from 'react-native';
import { C, L, F } from '#/commonStyles/style-layout';
import CallItem from '#/components/common/CallItem';
import ModalRoot from '#/components/common/Modal';
import CallOutcomeModal from '#/components/common/CallOutcomeModal';
import { Header, Loader, SearchableList ,Timeline} from '#/components/common';

import DateFilter from '#/components/common/DateFilter';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchInterestedCalls, 
  fetchFollowUpCalls,
  fetchInformationSharingCalls,
  fetchSiteVisitPlannedCalls,
  fetchSiteVisitDoneCalls,
  fetchReadyToMoveCalls,
  recordCall 
} from './store';
import { 
  fetchInterestedLeads, 
  fetchFollowUpLeads,
  fetchInformationSharingLeads,
  fetchSiteVisitPlannedLeads,
  fetchSiteVisitDoneLeads,
  fetchReadyToMoveLeads,
  recordLeadCall 
} from '#/screens/Leads/store';
import EmptyList from '#/components/common/EmptyList';
import { formatDate3, hasValue } from '#/Utils';

const OutcomeScreen = ({ navigation, route }) => {
  const { outcomeType, title } = route.params;
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
  const [calls, setCalls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Choose the appropriate data source based on mode
  const responseData = appMode === 'leads' ? responseDataLeads : responseDataDashBoard;

  // Get the appropriate state key based on outcome type
  const getStateKey = () => {
    const prefix = appMode === 'leads' ? 'Leads' : 'Calls';
    const outcomeKey = outcomeType.charAt(0).toUpperCase() + outcomeType.slice(1).replace(/_/g, '');
    return `${outcomeKey.charAt(0).toLowerCase() + outcomeKey.slice(1)}${prefix}`;
  };

  const stateKey = getStateKey();

  useEffect(() => {
    if (appMode === 'leads') {
      get_leads_by_outcome(0);
    } else {
      get_calls_by_outcome(0);
    }
  }, [appMode, outcomeType]);

  useEffect(() => {
    if (appMode === 'leads') {
      const keyWithLeads = outcomeType.split('_').map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ).join('') + 'Leads';
      setCalls(responseDataLeads?.[keyWithLeads] || []);
    } else {
      const keyWithCalls = outcomeType.split('_').map((word, index) => 
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ).join('') + 'Calls';
      setCalls(responseDataDashBoard?.[keyWithCalls] || []);
    }
    setonEndReachedCalledDuringMomentum(false);
  }, [responseDataDashBoard, responseDataLeads, appMode, outcomeType]);

  const get_calls_by_outcome = (page = 0, search = '') => {
    const page_number = page + 1;
    let url = `?page=${page_number}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    if (dateFilter) {
      url += `&date=${encodeURIComponent(dateFilter)}`;
    }

    const fetchFunctions = {
      'interested': fetchInterestedCalls,
      'follow_up': fetchFollowUpCalls,
      'information_sharing': fetchInformationSharingCalls,
      'site_visit_planned': fetchSiteVisitPlannedCalls,
      'site_visit_done': fetchSiteVisitDoneCalls,
      'ready_to_move': fetchReadyToMoveCalls,
    };

    const fetchFunction = fetchFunctions[outcomeType];
    if (fetchFunction) {
      dispatch(fetchFunction({ url, data: { page: page_number, search: search.trim() } }));
    }
  };

  const get_leads_by_outcome = (page = 0, search = '') => {
    const page_number = page + 1;
    let url = `?page=${page_number}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    if (dateFilter) {
      url += `&date=${encodeURIComponent(dateFilter)}`;
    }

    const fetchFunctions = {
      'interested': fetchInterestedLeads,
      'follow_up': fetchFollowUpLeads,
      'information_sharing': fetchInformationSharingLeads,
      'site_visit_planned': fetchSiteVisitPlannedLeads,
      'site_visit_done': fetchSiteVisitDoneLeads,
      'ready_to_move': fetchReadyToMoveLeads,
    };

    const fetchFunction = fetchFunctions[outcomeType];
    if (fetchFunction) {
      dispatch(fetchFunction({ url, data: { page: page_number, search: search.trim() } }));
    }
  };

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
      const updatedCallData = {
        ...callData,
        contactId: pendingContact.contact.id
      };
      if (appMode === 'leads') {
        await dispatch(recordLeadCall(updatedCallData));
        get_leads_by_outcome(0);
      } else {
        await dispatch(recordCall(updatedCallData));
        get_calls_by_outcome(0);
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
    if (appMode === 'leads') {
      get_leads_by_outcome(0, query);
    } else {
      get_calls_by_outcome(0, query);
    }
  };

  const renderCallItem = ({ item }) => {
    const transformedItem = {
      id: item.id,
      name: item.contact.name,
      phone: item.contact.phone,
      lastCallTime: new Date(item?.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      callCount: 1,
      status: item.status,
      notes: item.notes,
      outcome: item.outcome,
      scheduledFor: item.scheduledFor,
      project: item?.project,
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

  // Get pagination info based on outcome type and mode
  const getCurrentPage = () => {
    const suffix = appMode === 'leads' ? 'Leads' : 'Calls';
    const outcomeKey = outcomeType.split('_').map((word, index) => 
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    return responseData?.[`${outcomeKey}${suffix}CurrentPage`] || 1;
  };

  const getTotalPages = () => {
    const suffix = appMode === 'leads' ? 'Leads' : 'Calls';
    const outcomeKey = outcomeType.split('_').map((word, index) => 
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
    return responseData?.[`${outcomeKey}${suffix}TotalPages`] || 0;
  };

  return (
    <View style={[C.bgWhite, L.f1]}>
      <Header navigation={navigation} label_center={title} showDrawer={true} />

      {responseData?.isLoading && <Loader />}

      <DateFilter
        value={dateFilter}
        onChange={(d) => {
          setDateFilter(d);
          if (appMode === 'leads') {
            get_leads_by_outcome(0,searchQuery);
          } else {
            get_calls_by_outcome(0,searchQuery);
          }
        }}
      />

      <SearchableList
        data={calls}
        renderItem={renderCallItem}
        searchPlaceholder="Search by name or phone..."
        searchBarStyle={[L.mH20, L.mB10]}
        listContainerStyle={[L.f1]}
        onSearchChange={handleSearchChange}
        contentContainerStyle={[L.pB20]}
        onEndReached={() => {
          const currentPage = getCurrentPage();
          const totalPages = getTotalPages();
          
          if (onEndReachedCalledDuringMomentum) return;
          if (currentPage < totalPages && !responseData?.isLoading) {
            if (appMode === 'leads') {
              get_leads_by_outcome(currentPage, searchQuery);
            } else {
              get_calls_by_outcome(currentPage, searchQuery);
            }
            setonEndReachedCalledDuringMomentum(true);
          }
        }}
        onMomentumScrollBegin={() => { setonEndReachedCalledDuringMomentum(false) }}
        refreshing={false}
        onEndReachedThreshold={0.3}
        onRefresh={() => {
          if (appMode === 'leads') {
            get_leads_by_outcome(0, searchQuery);
          } else {
            get_calls_by_outcome(0, searchQuery);
          }
        }}
        ListEmptyComponent={() => !responseData?.isLoading && <EmptyList />}
      />

      {/* Info Modal */}
      <ModalRoot visible={showInfoModal} onClose={() => setShowInfoModal(false)} animationType="slide" style={[L.jcB]}>
        <View style={[{ width: '100%' }, L.asC, C.bgWhite, L.bR10, L.p20]}>
          <Text style={[F.fsTwo2, F.fw7, C.fcBlack, F.ffB, L.mB15]}>Call Details</Text>

          {selectedCall && (
            <>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Name: {selectedCall.contact.name}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Phone: {selectedCall.contact.phone}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Email: {selectedCall.contact.email || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Last Call: {new Date(selectedCall.calledAt).toLocaleString()}</Text>
              {selectedCall.scheduledFor && <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Scheduled For: {formatDate3(selectedCall?.scheduledFor)}</Text>}
              {hasValue(selectedCall?.project) && <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Project: {selectedCall?.project?.name}</Text>}
              <Timeline notes={selectedCall?.contactNotes || selectedCall?.notes || []} title="Notes" />
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

export default OutcomeScreen;

