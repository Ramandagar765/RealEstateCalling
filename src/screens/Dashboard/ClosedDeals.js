import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity, AppState, Linking } from 'react-native';
import { C, L, F } from '#/commonStyles/style-layout';
import CallItem from '#/components/common/CallItem';
import ModalRoot from '#/components/common/Modal';
import CallOutcomeModal from '#/components/common/CallOutcomeModal';
import { Header, Loader } from '#/components/common';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClosedDeals, recordCall } from './store';
import EmptyList from '#/components/common/EmptyList';

const ClosedDeals = ({ navigation }) => {
  const dispatch = useDispatch();
  const responseDataDashBoard = useSelector(state => state?.dashboard);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [pendingContact, setPendingContact] = useState(null);
  const appState = useRef(AppState.currentState);
  const hasShownModal = useRef(false);

  useEffect(() => {
    dispatch(fetchClosedDeals({ page: 1, size: 20 }));
  }, []);

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
      await dispatch(recordCall(updatedCallData));
      setShowOutcome(false);
      setPendingContact(null);
      hasShownModal.current = false;
      // Refresh the closed deals list
      dispatch(fetchClosedDeals({ page: 1, size: 20 }));
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
    dispatch(fetchClosedDeals({ page: 1, size: 20 }));
  };

  const renderDealItem = ({ item }) => {
    const transformedItem = {
      id: item.id,
      name: item.contact.name,
      phone: item.contact.phone,
      lastCallTime: new Date(item.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      callCount: 1,
      status: 'closed',
      notes: item.notes
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
      <Header navigation={navigation} label_center='Closed Deals' showDrawer={true} />
      
      {responseDataDashBoard?.isLoading && <Loader />}
      
      <FlatList
        data={responseDataDashBoard?.closedDeals || []}
        renderItem={renderDealItem}
        keyExtractor={item => item.id?.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[L.pB20]}
        refreshControl={
          <RefreshControl
            refreshing={responseDataDashBoard?.isLoading || false}
            onRefresh={handleRefresh}
            colors={[C.colorPrimary]}
            tintColor={C.colorPrimary}
          />
        }
        ListEmptyComponent={<EmptyList/>}
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
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Property Type: {selectedDeal.contact.propertyType || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Budget: {selectedDeal.contact.budget || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Deal Closed: {new Date(selectedDeal.calledAt).toLocaleString()}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Notes: {selectedDeal.notes || 'No notes'}</Text>
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
