// import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import {
    StyleSheet, Text, TouchableOpacity,
    View, FlatList, Alert, Linking, StatusBar, TextInput
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskID, setTasks } from '../redux/actions';
import GlobalStyle from '../utils/GlobalStyle';
import firestore from '@react-native-firebase/firestore';
import CheckBox from '@react-native-community/checkbox';
import { useNotification } from '../utils/useNotification';
import notifee, { EventType } from '@notifee/react-native';

export default function ToDo({ navigation }) {

    const { tasks } = useSelector(state => state.taskReducer);
    const dispatch = useDispatch();

    const [agenda, setAgenda] = useState([]);
    const [backup, setBackup] = useState([]);
    const [query, setQuery] = useState('');

    const {
        displayNotification,
        displayTriggerNotification,
        cancelAllNotifications
    } = useNotification();

    useEffect(() => {
        setAgenda([]);
        const ref = firestore().collection('agenda').onSnapshot(querySnapshot => {
            const list = [];
            querySnapshot.forEach(doc => {
                const { title, desc, time, done, color, created } = doc.data();
                list.push({
                    id: doc.id,
                    title,
                    desc,
                    time,
                    done,
                    color,
                    created,
                });
                if (done == false) {
                    handleCreateTriggerNotification(title, desc, time);
                }
            });

            setAgenda(list);
            setBackup(list);
        });
        
        const def = firestore().collection('url').doc('1').get().then(snapshot => {
            const { link } = snapshot.data();
            setUri(link);
        });

    }, [])

    const [uri, setUri] = useState('');

    // Subscribe to events
    useEffect(() => {
        console.log(uri);
        return notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
                case EventType.DISMISSED:
                    console.log('User dismissed notification', detail.notification);
                    break;
                case EventType.PRESS:
                    Linking.openURL(uri || 'https://bit.ly/JadwalPreventif');
                    break;
            }
        });
    }, []);



    const handleCreateTriggerNotification = (title, desc, datetime) => {
        const [dateRelated, timeRelated] = datetime.split(' ');
        const [year, month, day] = dateRelated.split('/');
        const [hours, minutes, seconds] = timeRelated.split(':');
        const date2 = new Date(+year, month - 1, +day, +hours, +minutes, +seconds);
        const timestamp = date2.getTime() + 1000;
        // Display notification by datetime
        if (timestamp > Date.now()) {
            displayTriggerNotification(title, desc, timestamp);
        } else {
            return;
        }
    }

    const deleteTask = async (id) => {
        await firestore().collection('agenda').doc(id).delete()
            .then(() => {
                Alert.alert('Success!', 'Task removed successfully!');
            })
            .catch(err => console.log(err))
    }

    const checkTask = async (id, done) => {
        await firestore().collection('agenda').doc(id).update({ done: true, })
            .then(() => {
                Alert.alert('Success!', 'Task state is changed.');
            })
            .catch(err => console.log(err))
    }

    const filterItem = event => {
        var query = event.nativeEvent.text;
        setQuery(query);
        if (query == '') {
          setAgenda(backup);
        } else {
          var data = backup;
          query = query.toLowerCase();
          data = data.filter(l => l.title.toLowerCase().match(query) || l.desc.toLowerCase().match(query));
    
          setAgenda(data);
        }
      };

    return (
        <View style={styles.body}>
            <StatusBar barStyle="light-content" backgroundColor="#0080ff" />
            <View style={styles.header}>
                <TextInput
                    placeholder="Enter Text..."
                    placeholderTextColor="gray"
                    value={query}
                    onChange={filterItem.bind()}
                    style={styles.input}
                />
                <TouchableOpacity
                style={{ marginHorizontal: 10, }}
                onPress={() => Linking.openURL(uri || 'https://bit.ly/JadwalPreventif')}
                >
                <FontAwesome5
                    name={'external-link-alt'}
                    size={20}
                    color={'#ffffff'}
                />
                </TouchableOpacity>
            </View>
            <FlatList
                data={agenda.filter(agenda => agenda.done === false)}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => {
                            dispatch(setTaskID(item.id));
                            navigation.navigate('EditTask', {
                                idProps: item.id,
                                titleProps: item.title,
                                descProps: item.desc,
                                timeProps: item.time,
                                doneProps: item.done,
                                colorProps: item.color,
                                createdProps: item.created,
                            });
                        }}
                    >
                        <View style={styles.item_row}>
                            <View
                                style={[
                                    {
                                        backgroundColor:
                                            item.color === 'red' ? '#f28b82' :
                                                item.color === 'blue' ? '#aecbfa' :
                                                    item.color === 'green' ? '#ccff90' : '#ffffff'
                                    },
                                    styles.color]}
                            />
                            <CheckBox
                                value={item.done}
                                onValueChange={(newValue) => { checkTask(item.id, newValue) }}
                            />
                            <View style={styles.item_body}>
                                <Text
                                    style={[
                                        styles.title
                                    ]}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                                <Text
                                    style={[
                                        styles.subtitle
                                    ]}
                                    numberOfLines={1}
                                >
                                    {item.desc}
                                </Text>
                                <Text
                                    style={
                                        styles.created
                                    }
                                >
                                    Created at {item.created}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.delete}
                                onPress={() => { deleteTask(item.id) }}
                            >
                                <FontAwesome5
                                    name={'trash'}
                                    size={25}
                                    color={'#ff3636'}
                                />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    dispatch(setTaskID(tasks.length + 1));
                    navigation.navigate('Task');
                }}
            >
                <FontAwesome5
                    name={'plus'}
                    size={20}
                    color={'#ffffff'}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#0080ff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
        elevation: 5,
    },
    item_row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    item_body: {
        flex: 1,
    },
    delete: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        marginHorizontal: 10,
        marginVertical: 7,
        paddingRight: 10,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 5,
    },
    title: {
        color: '#000000',
        fontSize: 30,
        margin: 5,
    },
    subtitle: {
        color: '#999999',
        fontSize: 20,
        margin: 5,
    },
    created: {
        color: '#999999',
        fontSize: 15,
        margin: 5,
    },
    color: {
        width: 20,
        height: '100%',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    header: {
        height: 80,
        width: '100%',
        backgroundColor: '#0080ff',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    input: {
        height: 45,
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        paddingLeft: 10,
    },
})