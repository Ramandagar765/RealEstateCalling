import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, RefreshControl, Text, TouchableOpacity, AppState, Linking } from 'react-native';
import { C, L, F } from '#/commonStyles/style-layout';
import CallItem from '#/components/common/CallItem';
import ModalRoot from '#/components/common/Modal';
import CallOutcomeModal from '#/components/common/CallOutcomeModal';
import { Header, Loader } from '#/components/common';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnsuccessfulCalls, recordCall } from './store';
import EmptyList from '#/components/common/EmptyList';

const UnsuccessfulCalls = ({ navigation }) => {
  const dispatch = useDispatch();
  const responseDataDashBoard = useSelector(state => state?.dashboard);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedCall, setSelectedCall] = useState(null);
  const [pendingContact, setPendingContact] = useState(null);
  const appState = useRef(AppState.currentState);
  const hasShownModal = useRef(false);

  useEffect(() => {
    dispatch(fetchUnsuccessfulCalls({ page: 1, size: 20 }));
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
      // Refresh the unsuccessful calls list
      dispatch(fetchUnsuccessfulCalls({ page: 1, size: 20 }));
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
    dispatch(fetchUnsuccessfulCalls({ page: 1, size: 50 }));
  };

  const renderCallItem = ({ item }) => {
    const transformedItem = {
      id: item.id,
      name: item.contact.name,
      phone: item.contact.phone,
      lastCallTime: new Date(item.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      callCount: 1, // Unsuccessful calls show as single entry
      status: item.status,
      notes: item.notes
    };

    return (
      <CallItem
        item={transformedItem}
        onInfoPress={() => handleInfo(item)}
        onCallPress={() => handleCall(item)}
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
      <Header navigation={navigation} label_center='Unsuccessful Calls' showDrawer={true} />
      
      {responseDataDashBoard?.isLoading && <Loader />}
      
      <FlatList
        data={responseDataDashBoard?.unsuccessfulCalls || []}
        renderItem={renderCallItem}
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
              {selectedCall?.contactNotes?.map((note, index) => <Text key={index} style={[F.fsOne4, C.fcGray, F.ffM, L.mB0]}>{note?.note}</Text>)}
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
        showOnlySuccessful={true}
      />
    </View>
  );
};

export default UnsuccessfulCalls;
