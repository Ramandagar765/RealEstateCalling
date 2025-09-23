import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
const tz = 'Asia/Kolkata';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import ModalRoot from './Modal';
import { C, F, HT, L, WT } from '#/commonStyles/style-layout';
import CustomTextInput from './CustomTextInput';
import CustomButton from './Button';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import TextField from './TextField';
import { MyToast, successfulOutcomes, unsuccessfulOutcomes } from '#/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects } from '#/screens/Dashboard/store';

const CallOutcomeModal = ({ visible, onClose, contact, onSave, showOnlySuccessful = false }) => {
  const dispatch = useDispatch();
  const projects = useSelector(state => state?.dashboard?.projects);

  const [callStatus, setCallStatus] = useState(showOnlySuccessful ? 'successful' : '');
  const [outcome, setOutcome] = useState('');
  const [comment, setComment] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');

  // Fetch projects when modal opens
  useEffect(() => {
    if (visible && projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [visible, dispatch, projects.length]);

  const getCurrentOutcomes = () => {
    return callStatus === 'successful' ? successfulOutcomes : unsuccessfulOutcomes;
  };

  const handleConfirm = () => {
    console.log('contact',contact)
    console.log('callStatus',callStatus)
    console.log('outcome',outcome)
    console.log('selectedProject',selectedProject)
    console.log('comment',comment)
    console.log('scheduledDate',scheduledDate)
    if (!contact || !callStatus || !outcome) {
      MyToast('Please Choose a reason')
      return onClose?.();
    }

    if (callStatus === 'successful' && (outcome === 'interested' || outcome === 'deal_closed') && !selectedProject) {
      MyToast('Please select  project');
      return;
    }
    if (!comment) {
      MyToast('Please enter Comments about this call')
      return;
    }

    let payload = {
      contactId: contact.id,
      duration: 0,
      notes: comment,
    };

    if (callStatus === 'successful') {
      payload.status = 'successful';
      payload.outcome = outcome;

      if (outcome === 'interested') {
        console.log('scheduled date', JSON.stringify({ scheduledDate: scheduledDate.toISOString() }));
        payload.followUpRequired = true;
        payload.scheduledFor = scheduledDate.toISOString();
        payload.projectId = selectedProject;
      } else if (outcome === 'deal_closed') {
        payload.outcome = 'deal_closed';
        payload.projectId = selectedProject;
      }
    } else {
      if (outcome === 'no_answer') {
        payload.status = 'no_answer';
      } else if (outcome === 'busy') {
        payload.status = 'busy';
      } else {
        payload.status = 'failed';
      }
    }
    console.log('payload', payload);
    onSave?.(payload);
    resetForm();
  };

  const resetForm = () => {
    setCallStatus(showOnlySuccessful ? 'successful' : '');
    setOutcome('');
    setComment('');
    setScheduledDate(new Date());
    setShowPicker(false);
    setShowTimePicker(false);
    setSelectedProject('');
  };

  const openIOSDateTimePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChangeDateIOS = (_event, selectedDate) => {
    if (selectedDate) {
      setScheduledDate(selectedDate);
      setShowPicker(false);
      setTimeout(() => {
        setShowTimePicker(true);
      }, 100);
    }
  };

  const onChangeTimeIOS = (_event, selectedTime) => {
    if (selectedTime) {
      const updatedDate = new Date(scheduledDate);
      updatedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
      setScheduledDate(updatedDate);
      setShowTimePicker(false);
    }
  };

  const openAndroidDateTimePicker = () => {
    DateTimePickerAndroid.open({
      value: scheduledDate,
      mode: 'date',
      onChange: (event, selectedDate) => {
        if (event.type !== 'set' || !selectedDate) return;
        const pickedDate = new Date(selectedDate);
        setScheduledDate(pickedDate);
        setTimeout(() => {
          if (Platform.OS === 'android') {
            openAndroidTimePicker(pickedDate);
          } else {
            setShowTimePicker(true);
          }
        }, 100);
      },
    });
  };

  const openAndroidTimePicker = (date) => {
    DateTimePickerAndroid.open({
      value: date || scheduledDate,
      mode: 'time',
      onChange: (event, selectedTime) => {
        if (event.type !== 'set' || !selectedTime) return;
        const updatedDate = new Date(date || scheduledDate);
        updatedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
        setScheduledDate(updatedDate);
      },
    });
  };

  const needsScheduling = () => {
    return callStatus === 'successful' && outcome === 'interested';
  };

  const needsProjectSelection = () => {
    return callStatus === 'successful' && (outcome === 'interested' || outcome === 'deal_closed');
  };

  const getButtonLabel = () => {
    if (callStatus === 'successful') {
      if (outcome === 'interested') return 'Schedule Follow-up';
      if (outcome === 'not_interested') return 'Mark Not Interested';
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
                  Connected
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
                  Not Connected
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Outcome Dropdown - show if call status is selected */}
        {callStatus && (
          <View style={[L.mT5]}>
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

        <TextField
          placeholder="Enter your comments about this call..."
          value={comment}
          onChangeText={setComment}
          cntstyl={[WT('100%'), L.mV10, L.br05]}
          style={[L.pH15, L.pV12, L.mB15,]}
          multiline
          numberOfLines={3}
        />

        {/* Project Selection Section - show if needs project selection */}
        {needsProjectSelection() && (
          <View style={[WT('100%'), L.mB15]}>
            <Text style={[F.fsOne5, F.fw5, C.fcBlack, F.ffM, L.mB10]}>Select Project</Text>
            <Dropdown
              style={[
                L.pH15, L.pV12, L.bR8,
                { borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F9F9F9' }
              ]}
              placeholderStyle={[F.fsOne4, C.fcGray, F.ffR]}
              selectedTextStyle={[F.fsOne4, C.fcBlack, F.ffM]}
              data={projects.map(project => ({ label: project.name, value: project.id }))}
              maxHeight={200}
              labelField="label"
              valueField="value"
              placeholder="Select a project"
              value={selectedProject}
              onChange={(item) => setSelectedProject(item.value)}
            />
          </View>
        )}

        {/* Scheduling Section - show if needs scheduling */}
        {needsScheduling() && (
          <View style={[WT('100%'), L.mB15]}>
            <Text style={[F.fsOne5, F.fw5, C.fcBlack, F.ffM]}>Schedule Follow-up Call</Text>

            {/* Date Selection */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => (Platform.OS === 'android' ? openAndroidDateTimePicker() : openIOSDateTimePicker())}
              style={[
                WT('100%'), L.pH15, L.pV12, L.bR8, L.fdR, L.aiC, L.jcSB, L.mB10,
                { borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#F9F9F9' }
              ]}
            >
              <Text style={[F.fsOne4, C.fcBlack, F.ffM]}>{scheduledDate.toLocaleDateString()}-{scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>

            {showPicker && Platform.OS === 'ios' && (
              <DateTimePicker
                value={scheduledDate}
                mode="date"
                display="inline"
                onChange={onChangeDateIOS}
              />
            )}

            {showTimePicker && Platform.OS === 'ios' && (
              <DateTimePicker
                value={scheduledDate}
                mode="time"
                display="spinner"
                onChange={onChangeTimeIOS}
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
            style={[WT('48%'), C.bgBlack,(!callStatus || !outcome || !comment) && C.bgOffGray]}
            onPress={handleConfirm}
            txtStyle={[F.fw5, F.ffM, C.fcWhite, F.fsOne4,]}
            disabled={!callStatus || !outcome}
          />
        </View>
      </View>
    </ModalRoot>
  );
};

export default CallOutcomeModal;