/**
 * @format
 */

import {AppRegistry, Linking } from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const ref = firestore().collection('url').doc('1').get().then(snapshot =>{
        const { link } = snapshot.data();
        switch (type) {
            case EventType.DISMISSED:
                console.log('User dismissed notification', detail.notification);
                break;
            case EventType.PRESS:
                console.log('User pressed notification', detail.notification);
                Linking.openURL( link || 'https://bit.ly/JadwalPreventif');
                break;
        }
    });    
  });

AppRegistry.registerComponent(appName, () => App);
