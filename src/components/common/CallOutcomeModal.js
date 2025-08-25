import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import ModalRoot from './Modal';
import { C, F, HT, L, WT } from '#/commonStyles/style-layout';
import CustomTextInput from './CustomTextInput';
import CustomButton from './Button';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';

const CallOutcomeModal = ({ visible, onClose, contact, onSave, showOnlySuccessful = false }) => {
  const [callStatus, setCallStatus] = useState(showOnlySuccessful ? 'successful' : '');
  const [outcome, setOutcome] = useState('');
  const [comment, setComment] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const successfulOutcomes = [
    { label: 'Interested', value: 'interested' },
    { label: 'Not Interested', value: 'not_interested' },
    { label: 'Try Again', value: 'try_again' },
    { label: 'Deal Closed', value: 'deal_closed' },
  ];

  const unsuccessfulOutcomes = [
    { label: 'No Answer', value: 'no_answer' },
    { label: 'Busy', value: 'busy' },
    { label: 'Failed to Connect', value: 'failed' },
  ];

  const getCurrentOutcomes = () => {
    return callStatus === 'successful' ? successfulOutcomes : unsuccessfulOutcomes;
  };

  const handleConfirm = () => {
    if (!contact || !callStatus || !outcome) return onClose?.();

    let payload = {
      contactId: contact.id,
      duration: 0,
      notes: comment,
    };

    if (callStatus === 'successful') {
      payload.status = 'successful';
      payload.outcome = outcome;

      if (outcome === 'interested' || outcome === 'try_again') {
        payload.followUpRequired = true;
        payload.scheduledFor = scheduledDate.toISOString();
      } else if (outcome === 'deal_closed') {
        payload.outcome = 'deal_closed'; // Backend expects 'deal_closed' for closed deals
      }
    } else {
      // Unsuccessful call - map outcome to status
      if (outcome === 'no_answer') {
        payload.status = 'no_answer';
      } else if (outcome === 'busy') {
        payload.status = 'busy';
      } else {
        payload.status = 'failed';
      }
    }

    onSave?.(payload);
    resetForm();
  };

  const resetForm = () => {
    setCallStatus(showOnlySuccessful ? 'successful' : '');
    setOutcome('');
    setComment('');
    setScheduledDate(new Date());
  };

  const onChangeDateIOS = (_event, selectedDate) => {
    if (selectedDate) setScheduledDate(selectedDate);
  };

  const openAndroidDateTimePicker = () => {
    DateTimePickerAndroid.open({
      value: scheduledDate,
      mode: 'date',
      onChange: (event, selectedDate) => {
        if (event.type !== 'set' || !selectedDate) return;
        const pickedDate = new Date(selectedDate);
        // Set default time to 2:00 PM
        pickedDate.setHours(14, 0, 0, 0);
        setScheduledDate(pickedDate);
      },
    });
  };

  const needsScheduling = () => {
    return callStatus === 'successful' && (outcome === 'interested' || outcome === 'try_again');
  };

  const getButtonLabel = () => {
    if (callStatus === 'successful') {
      if (outcome === 'interested') return 'Schedule Follow-up';
      if (outcome === 'not_interested') return 'Mark Not Interested';
      if (outcome === 'try_again') return 'Reschedule Call';
      if (outcome === 'deal_closed') return 'Mark as Closed Deal';
    }
    return 'Mark Unsuccessful';
  };
 

  return (
    <ModalRoot visible={visible} onClose={onClose} animationType="slide" style={[L.jcB]}>
      <View style={[WT('100%'), L.asC, C.bgWhite, L.bR10, L.p20]}>
        <Text style={[F.fsTwo2, F.fw7, C.fcBlack, F.ffB, L.mB10]}>Call Outcome</Text>
        
        {contact && (
          <Text style={[F.fsOne6, C.fcBlack, F.ffM, L.mB15]}>
            {contact.contact?.name} • {contact.contact?.phone}
          </Text>
        )}

        {/* Call Status Selection - Only show if not showOnlySuccessful */}
        {!showOnlySuccessful && (
          <>
            <View style={[L.fdR, L.jcSB, { backgroundColor: '#F2F2F2' }, L.bR8, L.p3, L.mB15]}>
              <TouchableOpacity
                style={[WT('49%'), L.aiC, L.jcC, L.pV8, callStatus === 'successful' && C.bgWhite, L.bR8]}
                activeOpacity={0.7}
                onPress={() => {
                  setCallStatus('successful');
                  setOutcome(''); // Reset outcome when changing call status
                }}
              >
                <Text style={[F.fsOne4, F.fw5, F.ffM, callStatus === 'successful' ? C.fcBlack : C.fcGray]}>
                  Successful
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[WT('49%'), L.aiC, L.jcC, L.pV8, callStatus === 'unsuccessful' && C.bgWhite, L.bR8]}
                activeOpacity={0.7}
                onPress={() => {
                  setCallStatus('unsuccessful');
                  setOutcome(''); // Reset outcome
                }}
              >
                <Text style={[F.fsOne4, F.fw5, F.ffM, callStatus === 'unsuccessful' ? C.fcBlack : C.fcGray]}>
                  Unsuccessful
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Outcome Dropdown - show if call status is selected */}
        {callStatus && (
          <View style={[L.mT20,{marginBottom: -15}]}>
            <Dropdown
              style={[
                L.pH15, L.pV12, L.bR8, 
                { borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F9F9F9' }
              ]}
              placeholderStyle={[F.fsOne4, C.fcGray, F.ffR]}
              selectedTextStyle={[F.fsOne4, C.fcBlack, F.ffM]}
              data={getCurrentOutcomes()}
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder={`Select ${callStatus === 'successful' ? 'outcome' : 'reason'}`}
              value={outcome}
              onChange={(item) => setOutcome(item.value)}
            />
          </View>
        )}

        <CustomTextInput
          placeholder="Enter your notes about this call..."
          value={comment}
          onChangeText={setComment}
          style={[WT('100%'), L.br05, L.pH15, L.pV12, L.mB15, L.bR8]}
          multiline
          numberOfLines={3}
        />

        {/* Scheduling Section - show if needs scheduling */}
        {needsScheduling() && (
          <View style={[WT('100%'), L.mB15]}>
            <Text style={[F.fsOne8, F.fw5, C.fcBlack, F.ffM, L.mB10]}>
              {outcome === 'interested' ? 'Schedule Follow-up Call' : 'Schedule Retry'}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => (Platform.OS === 'android' ? openAndroidDateTimePicker() : setShowPicker(true))}
              style={[
                WT('100%'), L.pH15, L.pV12, L.bR8, L.fdR, L.aiC, L.jcSB,
                { borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F9F9F9' }
              ]}
            >
              <Text style={[F.fsOne4, C.fcBlack, F.ffM]}>
                {scheduledDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && showPicker && (
              <DateTimePicker
                value={scheduledDate}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'compact' : 'spinner'}
                onChange={onChangeDateIOS}
                style={[L.mT10]}
              />
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={[L.fdR, L.jcSB, L.mT10]}>
          <CustomButton
            label="Cancel"
            style={[WT('48%'), C.bgLightGray]}
            txtStyle={[F.fw5, F.ffM, C.fcBlack, F.fsOne4]}
            onPress={() => {
              resetForm();
              onClose();
            }}
          />
          <CustomButton
            label={getButtonLabel()}
            style={[WT('48%'), C.bgBlue]}
            onPress={handleConfirm}
            txtStyle={[F.fw5, F.ffM, C.fcWhite, F.fsOne4]}
            disabled={!callStatus || !outcome}
          />
        </View>
      </View>
    </ModalRoot>
  );
};

export default CallOutcomeModal;