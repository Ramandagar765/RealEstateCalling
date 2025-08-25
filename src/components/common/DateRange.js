import { C, F, L } from '#/commonStyles/style-layout';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';

const DateRange = ({ modelOpen, setModelOpen, onDateChange, maxDate, initialRange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // Reset calendar state when modal opens
    useEffect(() => {
        if (modelOpen) {
            setStartDate(null);
            setEndDate(null);
        }
    }, [modelOpen]);

    const handleDateChange = (date) => {
        console.log('Date selected:', date);
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null); // Reset end date if starting a new range
        } else if (startDate && !endDate) {
            setEndDate(date);
            onDateChange(startDate, date); // Pass the selected range back
            // setModelOpen(false); // Close the modal after selecting date
        }
    };

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    return (
        <View>
            <Modal
                transparent={true}
                visible={modelOpen}
                animationType="slide"
                onRequestClose={() => setModelOpen(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <CalendarPicker
                            onDateChange={handleDateChange}
                            allowRangeSelection={true}
                            selectedStartDate={startDate}
                            selectedEndDate={endDate}
                            selectedDayTextColor={'#FFF'}
                            selectedDayColor={C.viloet}
                            maxDate={maxDate}
                            minDate={undefined}  // Explicitly set minDate to undefined to allow all past dates
                            enableDateChange={true}  // Ensure date changes are enabled
                            allowBackwardRangeSelect={true}  // Allow selecting ranges in any order
                            disabledByDefault={false}  // Ensure days are not disabled by default
                        />
                        <TouchableOpacity style={[L.p10, C.bgGreen, L.bR10, L.mT12, L.pH30]} onPress={() => setModelOpen(false)}>
                            <Text style={[C.fcWhite, F.ffB]}>SUBMIT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
});

export default DateRange;
