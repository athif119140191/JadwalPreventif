import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import moment from 'moment';

const DateTimeModal = (props) => {
    const { defaultDate } = props;
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedValue) => {
        // setShow(Platform.OS === 'ios');
        // if (mode == 'date') {
        //     const currentDate = selectedValue || new Date();
        //     setDate(currentDate);
        //     setMode('time');
        //     setShow(Platform.OS !== 'ios');
        // } else {
        //     const selectedTime = selectedValue || new Date();
        //     setTime(selectedTime);
        //     setShow(Platform.OS === 'ios');
        //     setMode('date');
        // }
        // props.onDateChange(formatDate(date, time));
        setDate(selectedValue);
    };

    const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        setShow(true);
        // showMode('date');
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };
    
    const handleConfirm = (date) => {
        props.onDateChange(date);
        hideDatePicker();
      };

    return (
        <TouchableHighlight
            activeOpacity={0}
            onPress={showDatepicker}>
            <View style={{ flexDirection: 'row' }}>
                <FontAwesome5
                    name={'calendar'}
                    size={25}
                    style={styles.icon}
                />
                {/* Current date selected */}
                <Text style={props.textStyle}>{parseDate(date)}</Text>

                {show && (
                    // <DateTimePicker
                    //     testID='dateTimePicker'
                    //     timeZoneOffsetInMinutes={0}
                    //     value={date}
                    //     mode={mode}
                    //     is24Hour={true}
                    //     display='default'
                    //     onChange={onChange}
                    // />
                    <DateTimePickerModal
                        isVisible={show}
                        mode="datetime"
                        onConfirm={handleConfirm}
                        onCancel={hideDatePicker}
                        onChange={onChange}

                    />
                )}
            </View>
        </TouchableHighlight>
    );
};

const parseDate = (rawDate) => {
    let hours;
    let day;
    let month;

    if (rawDate.getHours().toString().length === 1) {
        hours = `0${rawDate.getHours()}`;
    } else {
        hours = `${rawDate.getHours()}`;
    }

    if (rawDate.getDate().toString().length === 1) {
        day = `0${rawDate.getDate()}`;
    } else {
        day = `${rawDate.getDate()}`;
    }

    if (rawDate.getMonth().toString().length === 1) {
        month = `0${rawDate.getMonth() + 1}`;
    } else {
        month = `${rawDate.getMonth() + 1}`;
    }

    return `${rawDate.getFullYear()}/${month}/${day} ${hours}:${rawDate.getMinutes()}:${rawDate.getSeconds()}`;
};

const formatDate = (dat, tim) => {
    const date = new Date(dat);
    const time = new Date(tim);
    return `${date.getDate()}/${date.getMonth() +
        1}/${date.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
};

DateTimeModal.defaultProps = {
    defaultDate: moment(),
    textStyle: {},
    onDateChange: () => { },
};

const styles = StyleSheet.create({
    icon: {
        paddingVertical: 15,
        paddingLeft: 10,

    },
});

export default DateTimeModal;