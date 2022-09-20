import React, {useState, useEffect} from 'react';
import { Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ToDo from './screens/ToDo';
import Done from './screens/Done';
import Task from './screens/Task';
import Splash from './screens/Splash';
import EditTask from './screens/EditTask';
import { Provider } from 'react-redux';
import { Store } from './redux/store';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import notifee, { EventType } from '@notifee/react-native';
import firestore from '@react-native-firebase/firestore';

const Tab = createBottomTabNavigator();

function HomeTabs() {

  return (
    <Tab.Navigator
      screenOptions={
        ({ route }) => ({
          tabBarIcon: ({ focused, size, color }) => {
            let iconName;
            if (route.name === 'To-Do') {
              iconName = 'clipboard-list';
              size = focused ? 25 : 20;
            } else if (route.name === 'Done') {
              iconName = 'clipboard-check';
              size = focused ? 25 : 20;
            }
            return (
              <FontAwesome5
                name={iconName}
                size={size}
                color={color}
              />
            );
          },          
          tabBarActiveTintColor: '#0080ff',
          tabBarInactiveTintColor: '#777777',
          tabBarLabelStyle: { fontSize: 15, fontWeight: 'bold' }
        })
      }
    >
      <Tab.Screen name={'To-Do'} component={ToDo} options={{ headerShown: false }}/>
      <Tab.Screen name={'Done'} component={Done} options={{ headerShown: false }}/>
    </Tab.Navigator>
  );
}

const RootStack = createStackNavigator();

function App() {
//   const [uri, setUri] = useState('');

//   // Subscribe to events
//   useEffect(  () => {
//     const ref = firestore().collection('url').doc('1').get().then(snapshot =>{
//         const { link } = snapshot.data();
//         setUri(link);
//     });
//     console.log(uri);
//     return notifee.onForegroundEvent(({ type, detail }) => {
//         switch (type) {
//             case EventType.DISMISSED:
//                 console.log('User dismissed notification', detail.notification);
//                 break;
//             case EventType.PRESS:
//                 Linking.openURL(uri || 'https://bit.ly/JadwalPreventif');
//                 break;
//         }
//     });
// }, []);
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#0080ff'
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontSize: 25,
              fontWeight: 'bold'
            }
          }}
        >
          <RootStack.Screen
            name="Splash"
            component={Splash}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="My Tasks"
            component={HomeTabs}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Task"
            component={Task}
            options={{
              headerShown: true,
            }}
          />
          <RootStack.Screen
            name="EditTask"
            component={EditTask}
            options={{
              headerShown: true,
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App;