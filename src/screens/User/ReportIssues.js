import React, { useEffect, useState, } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { C, L, F, WT, HT } from '#/commonStyles/style-layout';
import { CustomButton, Header, Loader, SearchableList, TextField, Timeline } from '#/components/common';
import { useDispatch, useSelector } from 'react-redux';
import { create_support_ticket, get_support_tickets } from './store';
import EmptyList from '#/components/common/EmptyList';
import { Ionicons } from '#/components/Icons';
import { formatDate3, hasValue, MyToast } from '#/Utils';
import ModalRoot from '#/components/common/Modal';

const ReportIssues = ({ navigation }) => {
  const dispatch = useDispatch();
  const responseDataUser = useSelector(state => state?.user);
  const [onEndReachedCalledDuringMomentum, setonEndReachedCalledDuringMomentum] = useState(false);
  const [supportTickets, setSupportTickets] = useState([]);
  const [issue, setIssue] = useState('');
  const [showModal, setShowModal] = useState(false);



  useEffect(() => {
    get_tickets(0);
  }, []);

  useEffect(() => {
    setSupportTickets(responseDataUser?.support_tickets || []);
    setonEndReachedCalledDuringMomentum(false);
  }, [responseDataUser?.support_tickets]);

  const get_tickets = (page = 0, search = '') => {
    const page_number = page + 1;
    let url = `?page=${page_number}`;
    if (search.trim()) {
      url += `&search=${encodeURIComponent(search.trim())}`;
    } 
    dispatch(get_support_tickets({
      url: url,
      data: {
        page: page_number,
        search: search.trim()
      }
    }));
  };

  const renderTicketItem = ({ item }) => {
    return (
      <View style={[C.bgWhite, L.brB05, { borderColor: '#E0E0E0' }, L.pH15, L.pV12]}>
        <Text style={[F.fsOne4, F.ffM,L.taC, C.fcWhite, L.mB5, WT(80), L.p5, L.aiC, L.pV4, L.bR4, item?.status === 'resolved' ? [C.bgGreen] : [C.bgRed]]}>{item.status?.toUpperCase() || 'OPEN'}</Text>
        <Text style={[F.fsOne4, C.fcBlack, F.ffM, L.mB8]} numberOfLines={3}>{item.issue}</Text>
        {hasValue(item.adminNotes) && <Text style={[F.fsOne3, C.fcGray, F.ffM,L.mB5]}>Admin Response: {`\n`}{item.adminNotes}</Text> }
         <Text style={[F.fsOne2, C.fcGray, F.ffM]}>Updated: {item.updatedAt ? formatDate3(item.updatedAt) : 'Recent'}</Text>
      </View>
    );
  };


  const handleSubmit = () => {
    if(issue === '' || issue.trim() === '' || issue.length < 10){
      MyToast('Please enter a detailed issue (at least 10 characters).');
      return;
    }
    dispatch(create_support_ticket({
      issue: issue,
    }))
    setShowModal(false);
  };

 
  return (
    <View style={[C.bgWhite, L.f1]}>
      <Header
        navigation={navigation}
        label_center='Support Tickets'
        ic_left
        ic_left_style={[C.bgBlack]}
        ic_right='add-circle-outline'
        ic_right_style={[C.bgRed]}
        onPressRight={() => setShowModal(true)}
      />
      {responseDataUser?.isLoading && <Loader />}
      <SearchableList
        searchEnable={false}
        searchPlaceholder="Search issues..."
        data={supportTickets}
        renderItem={renderTicketItem}
        listContainerStyle={[L.f1]}
        contentContainerStyle={[L.pB20]}
        ListEmptyComponent={() => !responseDataUser?.isLoading && <EmptyList />}
        onEndReached={() => {
          console.log('calling')
          
          const currentPage = responseDataUser?.support_current_page;
          const totalPages = responseDataUser?.support_total_pages;
          console.log('currentPage', currentPage)
          console.log('totalPages', totalPages)
          if (onEndReachedCalledDuringMomentum) return;
          if (currentPage < totalPages && !responseDataUser?.isLoading) {
            get_tickets(currentPage);
            setonEndReachedCalledDuringMomentum(true);
          }
        }}
        onMomentumScrollBegin={() => { setonEndReachedCalledDuringMomentum(false) }}
        refreshing={false}
        onEndReachedThreshold={0.3}
        onRefresh={() => {
          get_tickets(0);
        }}
      />

      <ModalRoot
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => setShowModal(false)}
        style={[L.jcB]}
      >
       <View style={[{ width: '100%' }, L.asC, C.bgWhite, L.bRTR10,L.bLTR10,L.p20]}>
        <TextField
          label="Issue"
          label_style={[L.taL,WT('100%')]}
          placeholder="Describe your issue..."
          multiline={true}
          numberOfLines={4}
          cntstyl={[WT('100%'),L.br05,C.brGray,HT(100)]}
          style={[L.taL,L.p5,HT('100%'),WT('100%'),L.p5,L.taT]}
          onChangeText={(text) => setIssue(text)}
        />
        <CustomButton
          label="Submit"
          style={[L.mT20, WT('100%'), HT(40), L.asC, C.bgBlack]}
          onPress={handleSubmit}
          txtStyle={[F.fsOne5, F.ffM, C.fcWhite]}
        />
        </View>
        </ModalRoot>
    </View>
  );
};

export default ReportIssues;
