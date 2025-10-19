import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
const formatDDMMYYYY = (d) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
const parseDDMMYYYY = (s) => {
  if (!s) return new Date();
  const [dd, mm, yyyy] = s.split('-').map((x) => parseInt(x, 10));
  const d = new Date(yyyy, (mm || 1) - 1, dd || 1);
  return isNaN(d.getTime()) ? new Date() : d;
};

const DateFilter = ({ value, onChange }) => {
  const [show, setShow] = useState(false);

  const handleChange = (event, selectedDate) => {
    // Android provides event.type === 'dismissed' on cancel
    if (event?.type === 'dismissed') {
      setShow(false);
      return; // do not apply any date on cancel
    }
    setShow(false);
    if (selectedDate) {
      const formatted = formatDDMMYYYY(selectedDate);
      onChange?.(formatted);
    }
  };

  const handleClear = () => {
    onChange?.('');
  };

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 14 }}>Date: {value || 'All'}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {!!value && (
          <TouchableOpacity onPress={handleClear} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#9E9E9E', borderRadius: 6, marginRight: 8 }}>
            <Text style={{ color: '#fff', fontFamily: 'Poppins-Medium' }}>Clear</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setShow(true)} style={{ paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'red', borderRadius: 6 }}>
          <Text style={{ color: 'white', fontFamily: 'Poppins-Medium' }}>Filter Date</Text>
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          value={parseDDMMYYYY(value)}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DateFilter;


