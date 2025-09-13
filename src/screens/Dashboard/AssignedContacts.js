import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, AppState, Linking, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { C, L, F, WT } from '#/commonStyles/style-layout';
import CallItem from '#/components/common/CallItem';
import CallOutcomeModal from '#/components/common/CallOutcomeModal';
import ModalRoot from '#/components/common/Modal';
import { Header, Loader } from '#/components/common';
import { useDispatch, useSelector } from 'react-redux';
import { fetch_contacts, fetchDashboardStats, fetchProjects, recordCall, team_calls } from './store';
import EmptyList from '#/components/common/EmptyList';

const AssignedContacts = ({ navigation }) => {
  const dispatch = useDispatch();
  const responseDataDashBoard = useSelector(state => state?.dashboard);
  const [showOutcome, setShowOutcome] = useState(false);
  const [pendingContact, setPendingContact] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [onEndReachedCalledDuringMomentum, setonEndReachedCalledDuringMomentum] = useState(false);
  const appState = useRef(AppState.currentState);
  const hasShownModal = useRef(false);
  const [contacts,set_contacts] = useState([])

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchDashboardStats())
    get_contacts(0);
  }, [dispatch]);

  useEffect(() => {
    set_contacts(responseDataDashBoard?.contacts || [])
}, [responseDataDashBoard?.contacts])


  const get_contacts = (page = 0) => {
    const page_number = page + 1
    let url = `?page=${page_number}`;
    console.log('url',url)
    dispatch(fetch_contacts({
      url: url,
      data: {
        page: page_number
      }
    }));
  }


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
    setSelectedContact(item);
    setShowInfoModal(true);
  };

  const handleStartCall = (item) => {
    const contact = {
      id: item?.contact?.id,
      contact: {
        id: item?.contact.id,
        name: item?.contact?.name,
        phone: item?.contact?.phone
      },
      assignmentId: item?.assignmentId
    };
    setPendingContact(contact);
    hasShownModal.current = false;
    Linking.openURL(`tel:${contact?.contact?.phone}`);
  };

  const handleSaveOutcome = async (callData) => {
    if (!pendingContact) return setShowOutcome(false);

    try {
      const updatedCallData = {
        ...callData,
        contactId: pendingContact.contact.id
      };
      dispatch(recordCall(updatedCallData));
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

 
  const renderContactItem = ({ item,index }) => {
    const transformedItem = {
      id: item?.contact?.id,
      name: item?.contact?.name,
      phone: item?.contact.phone,
      lastCallTime: item?.latestCall ?
        new Date(item.latestCall.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Never',
      callCount: item?.totalCalls,
      status: item?.latestCall?.status || 'pending',
      notes: item?.contact.notes || item?.latestCall?.notes
    };
    if (item?.callStatus !== 'not_called') {
      return;
    }

    return (
      <CallItem
        item={transformedItem}
        onInfoPress={() => handleInfo(item)}
        onCallPress={() => handleStartCall(item)}
        onUpdatePress={() => handleUpdateStatus(item)}
        onWhatsAppPress={() => {
          const phone = item?.contact.phone.replace(/\s+/g, '');
          const whatsappUrl = `whatsapp://send?phone=${phone}`;
          Linking.openURL(whatsappUrl);
        }}
      />
    );
  };

  return (
    <View style={[C.bgWhite, L.f1]}>
      <Header navigation={navigation} label_center='Calls' showDrawer={true} ic_right='person-circle-outline' ic_right_style={[C.bgWhite]} onPressRight={() => navigation.navigate("Profile")} />

      {responseDataDashBoard?.isLoading && <Loader />}
      <View style={[L.pH20, L.pV10, C.bgLGray, L.jcC, L.aiC, L.bR10, L.mB10]}>
        <View style={[L.fdR, L.jcSB, L.w100, L.mT10]}>
          <View style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5, WT('50%')]}>
            <Text style={[F.fsOne5, F.fw6, F.ffM, C.fcBlack, L.taC]}>Assigned Contacts</Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseDataDashBoard?.stats?.assigned}</Text>
          </View>
          <View style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5, WT('50%')]}>
            <Text style={[F.fsOne6, F.fw6, F.ffM, C.fcBlack]}>Scheduled Calls</Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseDataDashBoard?.stats?.scheduled_calls || 0}</Text>
          </View>
        </View>
        <View style={[L.fdR, L.jcSB, L.w100, L.mT10]}>
          <View style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5, WT('50%')]}>
            <Text style={[F.fsOne6, F.fw6, F.ffM, C.fcBlack]}>Unsuccessful Calls</Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseDataDashBoard?.stats?.unsucessful_calls || 0}</Text>
          </View>
          <View style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5, WT('50%')]}>
            <Text style={[F.fsOne6, F.fw6, F.ffM, C.fcBlack]}>Closed Deals</Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseDataDashBoard?.stats?.closed_deals || 0}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item, index) => `${item?.assignmentId || item?.contact?.id || index}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[L.pB20]}
        onEndReached={() => {
          if (onEndReachedCalledDuringMomentum) return;
          if (responseDataDashBoard?.contactsCurrentPage < responseDataDashBoard?.contactsTotalPages) {
            get_contacts(responseDataDashBoard?.contactsCurrentPage);
            setonEndReachedCalledDuringMomentum(true)
          }
        }}
        onMomentumScrollBegin={() => { setonEndReachedCalledDuringMomentum(false) }}
        refreshing={false}
        onEndReachedThreshold={0.05}
        onRefresh={()=>{
          dispatch(fetchDashboardStats())
          get_contacts(0)
        }}
        ListEmptyComponent={() => !responseDataDashBoard?.isLoading && <EmptyList />}
      />

      {/* Info Modal */}
      <ModalRoot visible={showInfoModal} onClose={() => setShowInfoModal(false)} animationType="slide" style={[L.jcB]}>
        <View style={[{ width: '100%' }, L.asC, C.bgWhite, L.bR10, L.p20]}>
          <Text style={[F.fsTwo2, F.fw7, C.fcBlack, F.ffB, L.mB15]}>Contact Details</Text>

          {selectedContact && (
            <>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Name: {selectedContact.contact.name}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Phone: {selectedContact.contact.phone}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Email: {selectedContact.contact.email || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Budget: {selectedContact.contact.budget || 'N/A'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Total Calls: {selectedContact.totalCalls}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Last Call: {selectedContact.latestCall ? new Date(selectedContact.latestCall.calledAt).toLocaleString() : 'Never'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Status: {selectedContact.latestCall ? selectedContact.latestCall.status : 'Not contacted'}</Text>
              <Text style={[F.fsOne4, C.fcGray, F.ffM, L.mB5]}>Notes: {selectedContact.contact.notes || selectedContact.latestCall?.notes || 'No notes'}</Text>
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
        contact={pendingContact}
        onClose={handleCloseOutcome}
        onSave={handleSaveOutcome}
      />
    </View>
  );
};

export default AssignedContacts;
