// In App.js in a new project

import React, {useEffect, useRef, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './src/types/rootStackParam';
import Reservation from './src/screens/Reservation';
import BasicModal from './src/components/modals/BasicModal';
import ModalBackground from './src/components/modals/ModalBackground';
import HomeScreen from './src/screens/HomeScreen';
import BottomTab from './src/screens/BottomTab';
import GuideModal from './src/components/modals/GuideModal';
import Intro from './src/screens/Intro';
import BootSplash from 'react-native-bootsplash';
import {IOS, deviceId} from './src/configs/device';
import useLoginStore from './src/hooks/useLoginStore';
import {reject} from 'lodash';
import axios from 'axios';
import {SERVER_URL} from './src/configs/server';
import {AppState} from 'react-native';
import useUserStateStore from './src/hooks/useUserStateStore';
import PayModal from './src/components/modals/PayModal';
import Loading from './src/components/modals/Loading';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [ready, setReady] = useState(false);
  const {login, setLogin} = useLoginStore(state => state);
  const setChur = useUserStateStore(state => state.setChur);
  const init = async () => {
    // setLogin();
    const res = await axios.get(SERVER_URL + 'users?' + 'deviceId=' + deviceId);
    console.log('로그인 결과 : ', res.data.result);
    setLogin(res.data.result);

    if (res.data.result) {
      setChur(res.data.user.chur);
    }
    setReady(true);
    await BootSplash.hide({fade: true});
    return res.data;
  };

  useEffect(() => {
    init();
    const appState = AppState.addEventListener('change', AppStateStatus => {
      if (AppStateStatus === 'active' && ready) {
        // const loginState = init();
        init();
      }
    });

    return () => {
      appState.remove();
    };
  }, []);

  if (!ready) return <></>;
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={login ? 'BottomStack' : 'Intro'}>
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="BottomStack" component={BottomTab} />
        <Stack.Screen name="Reservation" component={Reservation} />
      </Stack.Navigator>
      <ModalBackground />
      <Loading />
      <BasicModal />
      <GuideModal />
      <PayModal />
    </NavigationContainer>
  );
}

export default App;
