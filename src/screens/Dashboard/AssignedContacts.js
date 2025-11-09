import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, AppState, Linking, RefreshControl, Text, TouchableOpacity, ScrollView } from 'react-native';
import { C, L, F, WT } from '#/commonStyles/style-layout';
import CallItem from '#/components/common/CallItem';
import CallOutcomeModal from '#/components/common/CallOutcomeModal';
import ModalRoot from '#/components/common/Modal';
import { Header, Loader, SearchableList, ModeToggle } from '#/components/common';
import { useDispatch, useSelector } from 'react-redux';
import { fetch_contacts, fetchDashboardStats, fetchProjects, recordCall, team_calls } from './store';
import { fetch_leads, fetchLeadsDashboardStats, recordLeadCall } from '#/screens/Leads/store';
import EmptyList from '#/components/common/EmptyList';

const AssignedContacts = ({ navigation }) => {
  const dispatch = useDispatch();
  const responseDataDashBoard = useSelector(state => state?.dashboard);
  const responseDataLeads = useSelector(state => state?.leads);
  const appMode = useSelector(state => state?.app?.mode || 'data');
  const [showOutcome, setShowOutcome] = useState(false);
  const [pendingContact, setPendingContact] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [onEndReachedCalledDuringMomentum, setonEndReachedCalledDuringMomentum] = useState(false);
  const appState = useRef(AppState.currentState);
  const hasShownModal = useRef(false);
  const [contacts, set_contacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Choose the appropriate data source based on mode
  const responseData = appMode === 'leads' ? responseDataLeads : responseDataDashBoard;

  useEffect(() => {
    dispatch(fetchProjects());
    if (appMode === 'leads') {
      dispatch(fetchLeadsDashboardStats());
      get_leads(0);
    } else {
      dispatch(fetchDashboardStats());
      get_contacts(0);
    }
  }, [dispatch, appMode]);

  useEffect(() => {
    if (appMode === 'leads') {
      set_contacts(responseDataLeads?.leads || []);
    } else {
      set_contacts(responseDataDashBoard?.contacts || []);
    }
    // Reset the momentum flag when contacts/leads change (new page loaded)
    setonEndReachedCalledDuringMomentum(false);
  }, [responseDataDashBoard?.contacts, responseDataLeads?.leads, appMode])


  const get_contacts = (page = 0, search = '') => {
    const page_number = page + 1
    let url = `?page=${page_number}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    console.log('contacts url', url)
    dispatch(fetch_contacts({
      url: url,
      data: {
        page: page_number,
        search: search.trim()
      }
    }));
  }

  const get_leads = (page = 0, search = '') => {
    const page_number = page + 1
    let url = `?page=${page_number}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    }
    console.log('leads url', url)
    dispatch(fetch_leads({
      url: url,
      data: {
        page: page_number,
        search: search.trim()
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
      if (appMode === 'leads') {
        dispatch(recordLeadCall(updatedCallData));
      } else {
        dispatch(recordCall(updatedCallData));
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
      get_leads(0, query);
    } else {
      get_contacts(0, query);
    }
  };


  const renderContactItem = ({ item, index }) => {
    const transformedItem = {
      id: item?.contact?.id,
      name: item?.contact?.name,
      phone: item?.contact.phone,
      lastCallTime: item?.latestCall ?
        new Date(item.latestCall.calledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'Never',
      callCount: item?.totalCalls,
      status: item?.latestCall?.status || 'pending',
      notes: item?.contact.notes || item?.latestCall?.notes,
      file_name:item?.contact?.importSourceKey
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
      <Header navigation={navigation} label_center={appMode === 'leads' ? 'Leads' : 'Calls'} showDrawer={true} ic_right='person-circle-outline' ic_right_style={[C.bgWhite]} ic_right_tintColor={'black'} onPressRight={() => navigation.navigate("Profile")} />
      {/* <Header label_center={"Profile"} ic_left ic_left_style={[C.bgBlack]} navigation={navigation} ic_right="logout" ic_right_style={[C.bgBlack]} onPressRight={()=>RootNavigation.navigate('ReportIssues')} /> */}
        

      <ModeToggle />

      {responseData?.isLoading && <Loader />}
      <View style={[L.pV5,  L.jcC, L.aiC, L.bR10, L.mB10,C.bgLGray,L.mL15,L.bR15]}>
        <ScrollView horizontal style={[L.pV10]} showsHorizontalScrollIndicator={false}>
          <View style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5, L.f1,]}>
            <Text style={[F.fsOne5, F.fw6, F.ffM, C.fcBlack, L.taC]}>
              {appMode === 'leads' ? 'Assigned Leads' : 'Assigned Data'}
            </Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseData?.stats?.assigned  || 0}</Text>
          </View>
          <TouchableOpacity
            style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5,]}
            onPress={() => navigation.navigate('Interested', { mode: appMode })}
          >
            <Text style={[F.fsOne6, F.fw6, F.ffM, C.fcBlack, L.taC]}>
              Interested
            </Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseData?.stats?.interested || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5,]}
            onPress={() => navigation.navigate('FollowUp', { mode: appMode })}
          >
            <Text style={[F.fsOne6, F.fw6, F.ffM, C.fcBlack, L.taC]}>
              Follow Up
            </Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseData?.stats?.followUp || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5,]}
            onPress={() => navigation.navigate('InformationSharing', { mode: appMode })}
          >
            <Text style={[F.fsOne6, F.fw6, F.ffM, C.fcBlack, L.taC]}>
              Info Sharing
            </Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseData?.stats?.informationSharing || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5,]}
            onPress={() => navigation.navigate('SiteVisitPlanned', { mode: appMode })}
          >
            <Text style={[F.fsOne6, F.fw6, F.ffM, C.fcBlack, L.taC]}>
              Site Visit Planned
            </Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseData?.stats?.siteVisitPlanned || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5,]}
            onPress={() => navigation.navigate('SiteVisitDone', { mode: appMode })}
          >
            <Text style={[F.fsOne6, F.fw6, F.ffM, C.fcBlack, L.taC]}>
              Site Visit Done
            </Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseData?.stats?.siteVisitDone || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5,]}
            onPress={() => navigation.navigate('ReadyToMove', { mode: appMode })}
          >
            <Text style={[F.fsOne6, F.fw6, F.ffM, C.fcBlack, L.taC]}>
              Ready to Move
            </Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseData?.stats?.readyToMove || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5,]}
            onPress={() => navigation.navigate('Not Connected', { mode: appMode })}
          >
            <Text style={[F.fsOne6, F.fw6, F.ffM, C.fcBlack, L.taC]}>
              {appMode === 'leads' ? 'Not Connected Leads' : 'Not Connected Calls'}
            </Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseData?.stats?.unsucessful_calls || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[L.aiC, L.jcC, L.pV10, L.pH15, C.bgWhite, L.bR8, L.mH5,]}
            onPress={() => navigation.navigate('ClosedDeals', { mode: appMode })}
          >
            <Text style={[F.fsOne6, F.fw6, F.ffM, C.fcBlack, L.taC]}>
              Sales Closed
            </Text>
            <Text style={[F.fsOne8, F.fw7, C.fcBlack]}>{responseData?.stats?.closed_deals || responseData?.stats?.salesClosed || 0}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>


      <SearchableList
        data={contacts}
        renderItem={renderContactItem}
        searchPlaceholder="Search by name or phone..."
        searchBarStyle={[L.mH20, L.mB10]}
        listContainerStyle={[L.f1]}
        onSearchChange={handleSearchChange}
        contentContainerStyle={[L.pB20]}
        onEndReached={() => {
          const currentPage = appMode === 'leads' ? responseData?.leadsCurrentPage : responseData?.contactsCurrentPage;
          const totalPages = appMode === 'leads' ? responseData?.leadsTotalPages : responseData?.contactsTotalPages;

          console.log('onEndReached called', {
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
              get_leads(currentPage, searchQuery);
            } else {
              get_contacts(currentPage, searchQuery);
            }
            setonEndReachedCalledDuringMomentum(true)
          }
        }}
        onMomentumScrollBegin={() => { setonEndReachedCalledDuringMomentum(false) }}
        refreshing={false}
        onEndReachedThreshold={0.3}
        onRefresh={() => {
          if (appMode === 'leads') {
            dispatch(fetchLeadsDashboardStats());
            get_leads(0, searchQuery);
          } else {
            dispatch(fetchDashboardStats());
            get_contacts(0, searchQuery);
          }
        }}
        ListEmptyComponent={() => !responseData?.isLoading && <EmptyList />}
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
