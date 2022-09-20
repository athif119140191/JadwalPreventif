import React, { useState, useEffect } from 'react';
import {
    Alert, Modal, StyleSheet,
    Text, TouchableOpacity, View,
    ScrollView,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import CustomButton from '../utils/CustomButton'
import { useDispatch, useSelector } from 'react-redux';
import { setTasks } from '../redux/actions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import CheckBox from '@react-native-community/checkbox';
import firestore from '@react-native-firebase/firestore';
import DateTimeModal from '../utils/DateTimePicker';

export default function EditTask({ navigation, route }) {

    const { tasks, taskID } = useSelector(state => state.taskReducer);
    const dispatch = useDispatch();
    const { idProps, titleProps, descProps,
        timeProps, doneProps, colorProps, createdProps } = route.params;

    const [title, setTitle] = useState(titleProps);
    const [desc, setDesc] = useState(descProps);
    const [done, setDone] = useState(doneProps);
    const [id, setID] = useState(idProps);
    const [color, setColor] = useState(colorProps);
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
    }, [])

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

    const setTask = async () => {
        if (title.length == 0) {
            Alert.alert('Warning!', 'Please write your task title.')
        } else {
            await firestore().collection('agenda').doc(id).update({
                title: title,
                desc: desc,
                time: parseDate(dateTime),
                done: done,
                color: color,
            });
            console.log('Berhasil!');
            navigation.goBack();
        }
    }

    return (
        <ScrollView style={{ paddingTop: 30 }}>
            <View style={styles.body}>
                <Text style={styles.createdText}>
                    Created at {createdProps}
                </Text>
                <TextInput
                    value={title}
                    style={styles.input}
                    placeholder='Title'
                    onChangeText={(value) => setTitle(value)}
                />
                <TextInput
                    value={desc}
                    style={styles.input}
                    placeholder='Description'
                    multiline
                    onChangeText={(value) => setDesc(value)}
                />
                <View style={styles.color_bar}>
                    <TouchableOpacity
                        style={styles.color_white}
                        onPress={() => { setColor('white') }}
                    >
                        {color === 'white' &&
                            <FontAwesome5
                                name={'check'}
                                size={25}
                                color={'#000000'}
                            />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.color_red}
                        onPress={() => { setColor('red') }}
                    >
                        {color === 'red' &&
                            <FontAwesome5
                                name={'check'}
                                size={25}
                                color={'#000000'}
                            />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.color_blue}
                        onPress={() => { setColor('blue') }}
                    >
                        {color === 'blue' &&
                            <FontAwesome5
                                name={'check'}
                                size={25}
                                color={'#000000'}
                            />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.color_green}
                        onPress={() => { setColor('green') }}
                    >
                        {color === 'green' &&
                            <FontAwesome5
                                name={'check'}
                                size={25}
                                color={'#000000'}
                            />
                        }
                    </TouchableOpacity>
                </View>
                <View style={styles.input}>
                    <DateTimeModal
                        textStyle={styles.inputDate}
                        defaultDate={dateTime}
                        onDateChange={(val) => setDateTime(val)}
                    />
                </View>
                <View style={styles.checkbox}>
                    <CheckBox
                        value={done}
                        onValueChange={(newValue) => setDone(newValue)}
                    />
                    <Text style={styles.text}>
                        Is Done
                    </Text>
                </View>
                <CustomButton
                    title='Update Task'
                    color='#1eb900'
                    style={{ width: '100%' }}
                    onPressFunction={setTask}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
    checkbox: {
        flexDirection: 'row',
        margin: 10,
    },
    createdText: {
        fontSize: 15,
        textAlign: 'left',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#555555',
        borderRadius: 10,
        backgroundColor: '#ffffff',
        textAlign: 'left',
        fontSize: 20,
        margin: 10,
        paddingHorizontal: 10,
    },
    inputDate: {
        width: '70%',
        backgroundColor: '#ffffff',
        textAlign: 'left',
        fontSize: 20,
        margin: 10,
        paddingHorizontal: 10,
    },
    text: {
        fontSize: 20,
        color: '#000000',
    },
    color_bar: {
        flexDirection: 'row',
        height: 50,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#555555',
        marginVertical: 10,
    },
    color_white: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    color_red: {
        flex: 1,
        backgroundColor: '#f28b82',
        justifyContent: 'center',
        alignItems: 'center',
    },
    color_blue: {
        flex: 1,
        backgroundColor: '#aecbfa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    color_green: {
        flex: 1,
        backgroundColor: '#ccff90',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    extra_row: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    extra_button: {
        flex: 1,
        height: 50,
        backgroundColor: '#0080ff',
        borderRadius: 10,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centered_view: {
        flex: 1,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center',
    },

    delete: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#ffffff80',
        margin: 10,
        borderRadius: 5,
    }
})