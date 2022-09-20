// import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, 
    View, FlatList, Alert, StatusBar, TextInput
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { setTaskID, setTasks } from '../redux/actions';
import CheckBox from '@react-native-community/checkbox';
import firestore from '@react-native-firebase/firestore';

export default function Done({ navigation }) {

    const { tasks } = useSelector(state => state.taskReducer);
    const dispatch = useDispatch();
    const [agenda, setAgenda] = useState([]);
    const [backup, setBackup] = useState([]);
    const [query, setQuery] = useState('');

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
            });

            setAgenda(list);
            setBackup(list);
        });
    }, [])

    const deleteTask = async (id) => {
        await firestore().collection('agenda').doc(id).delete()
        .then(() => {
            Alert.alert('Success!', 'Task removed successfully!');
        })
        .catch(err => console.log(err))  
    }

    const checkTask = async (id, done) => {
        await firestore().collection('agenda').doc(id).update({ done: false, })
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
            </View>
            <FlatList
                data={agenda.filter(agenda => agenda.done === true)}
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
                                colorProps: item.color
                            });
                        }}
                    >
                        <View style={styles.item_row}>
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
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    body: {
        flex: 1,
        zIndex: 1,
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
        paddingHorizontal: 10,
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
    header: {
        height: 80,
        width: '100%',
        backgroundColor: '#0080ff',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 45,
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        paddingLeft: 10,
    },
})