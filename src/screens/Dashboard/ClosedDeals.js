import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity, AppState, Linking } from 'react-native';
import { C, L, F } from '#/commonStyles/style-layout';
import CallItem from '#/components/common/CallItem';
import ModalRoot from '#/components/common/Modal';
import CallOutcomeModal from '#/components/common/CallOutcomeModal';
import { Header, Loader, SearchableList, Timeline } from '#/components/common';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClosedDeals, recordCall } from './store';
import { fetchClosedLeads, recordLeadCall } from '#/screens/Leads/store';
import EmptyList from '#/components/common/EmptyList';
import { hasValue } from '#/Utils';

const ClosedDeals = ({ navigation }) => {
  const dispatch = useDispatch();
  const responseDataDashBoard = useSelector(state => state?.dashboard);
  const responseDataLeads = useSelector(state => state?.leads);
  const appMode = useSelector(state => state?.app?.mode || 'data');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [pendingContact, setPendingContact] = useState(null);
  const [onEndReachedCalledDuringMomentum, setonEndReachedCalledDuringMomentum] = useState(false);
  const appState = useRef(AppState.currentState);
  const hasShownModal = useRef(false);
  const [closedDeals, setClosedDeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Choose the appropriate data source based on mode
  const responseData = appMode === 'leads' ? responseDataLeads : responseDataDashBoard;

  useEffect(() => {
    if (appMode === 'leads') {
      get_closed_leads(0);
    } else {
      get_closed_deals(0);
    }
  }, [appMode]);

  useEffect(() => {
    if (appMode === 'leads') {
      setClosedDeals(responseDataLeads?.closedLeads || []);
    } else {
      setClosedDeals(responseDataDashBoard?.closedDeals || []);
    }
    // Reset the momentum flag when closed deals/leads change (new page loaded)
    setonEndReachedCalledDuringMomentum(false);
  }, [responseDataDashBoard?.closedDeals, responseDataLeads?.closedLeads, appMode]);

  const get_closed_deals = (page = 0, search = '') => {
    const page_number = page + 1;
    let url = `?page=${page_number}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    console.log('closed deals url', url);
    dispatch(fetchClosedDeals({
      url: url,
      data: {
        page: page_number,
        search: search.trim()
      }
    }));
  };

  const get_closed_leads = (page = 0, search = '') => {
    const page_number = page + 1;
    let url = `?page=${page_number}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    console.log('closed leads url', url);
    dispatch(fetchClosedLeads({
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
    setSelectedDeal(item);
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
        get_closed_leads(0);
      } else {
        await dispatch(recordCall(updatedCallData));
        get_closed_deals(0);
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

  const handleRefresh = () => {
    if (appMode === 'leads') {
      get_closed_leads(0, searchQuery);
    } else {
      get_closed_deals(0, searchQuery);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Reset to first page when searching
    if (appMode === 'leads') {
      get_closed_leads(0, query);
    } else {
      get_closed_deals(0, query);
    }
  };

  const renderDealItem = ({ item }) => {
    const transformedItem = {
      id: item.id,
      name: item.contact.name,
      phone: item.contact.phone,
      lastCallTime: new Date(item.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      callCount: 1,
      status: 'closed',
      notes: item.notes,
      file_name:item?.contact?.file_name
    };

    return (
      <CallItem
        hideCallButton={true}
        item={transformedItem}
        onInfoPress={() => handleInfo(item)}
        onCallPress={() => handleCall(item)}

      />
    );
  };

  return (
    <View style={[C.bgWhite, L.f1]}>
      <Header navigation={navigation} label_center='Sales Closed' showDrawer={true} />

      {responseData?.isLoading && <Loader />}

      <SearchableList
        data={closedDeals}
        renderItem={renderDealItem}
        searchPlaceholder="Search by name or phone..."
        searchBarStyle={[L.mH20, L.mB10]}
        listContainerStyle={[L.f1]}
        onSearchChange={handleSearchChange}
        contentContainerStyle={[L.pB20]}
        onEndReached={() => {
          const currentPage = appMode === 'leads' ? responseData?.closedLeadsCurrentPage : responseData?.closedDealsCurrentPage;
          const totalPages = appMode === 'leads' ? responseData?.closedLeadsTotalPages : responseData?.closedDealsTotalPages;
          
          console.log('onEndReached called - ClosedDeals/Leads', {
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
              get_closed_leads(currentPage, searchQuery);
            } else {
              get_closed_deals(currentPage, searchQuery);
            }
            setonEndReachedCalledDuringMomentum(true);
          }
        }}
        onMomentumScrollBegin={() => { setonEndReachedCalledDuringMomentum(false) }}
        refreshing={false}
        onEndReachedThreshold={0.3}
        onRefresh={() => {
          if (appMode === 'leads') {
            get_closed_leads(0, searchQuery);
          } else {
            get_closed_deals(0, searchQuery);
          }
        }}
        ListEmptyComponent={() => !responseData?.isLoading && <EmptyList />}
      />

      {/* Info Modal */}
      <ModalRoot visible={showInfoModal} onClose={() => setShowInfoModal(false)} animationType="slide" style={[L.jcB]}>
        <View style={[{ width: '100%' }, L.asC, C.bgWhite, L.bR10, L.p20]}>
          <Text style={[F.fsTwo2, F.fw7, C.fcBlack, F.ffB, L.mB15]}>Deal Details</Text>

          {selectedDeal && (
            <>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Name: {selectedDeal.contact.name}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Phone: {selectedDeal.contact.phone}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Email: {selectedDeal.contact.email || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Budget: {selectedDeal.contact.budget || 'N/A'}</Text>
              {hasValue(selectedDeal?.project) && <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Project: {selectedDeal?.project?.name}</Text>}
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Deal Closed: {new Date(selectedDeal.calledAt).toLocaleString()}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM,]}>Notes:</Text>
              {/* {selectedDeal?.contactNotes?.map((note, index) => <Text key={index} style={[F.fsOne4, C.fcGray, F.ffM, L.mB0]}>{note?.note}</Text>)} */}
            <Timeline notes={selectedDeal?.contactNotes || selectedDeal?.notes || []} title="Notes" />
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

export default ClosedDeals;
