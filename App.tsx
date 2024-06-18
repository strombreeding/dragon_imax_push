// In App.js in a new project

import React, {useEffect, useRef, useState} from 'react';
import {
  NavigationContainer,
  NavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './src/types/rootStackParam';
import Reservation from './src/screens/Reservation';
import BasicModal from './src/components/modals/BasicModal';
import ModalBackground from './src/components/modals/ModalBackground';
import BottomTab from './src/screens/BottomTab';
import GuideModal from './src/components/modals/GuideModal';
import Intro from './src/screens/Intro';
import BootSplash from 'react-native-bootsplash';
import {IOS} from './src/configs/device';
import useLoginStore from './src/hooks/useLoginStore';
import axios from 'axios';
import {SERVER_URL} from './src/configs/server';
import {
  Alert,
  AppState,
  DeviceEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import useUserStateStore from './src/hooks/useUserStateStore';
import PayModal from './src/components/modals/PayModal';
import Loading from './src/components/modals/Loading';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidColor,
  EventType,
  Event,
  AndroidStyle,
} from '@notifee/react-native';
import {
  getFCMTokenAndPutAPI,
  loginReq,
  permissionRequest,
} from './src/apis/App';
import HistoryDetail from './src/screens/HistoryDetail';
import {NavigationProps} from './src/types/navigationProps';
import PopupModal from './src/components/modals/Popup';

interface IFCMProps {
  title: any;
  body: any;
  data: {img?: any; _id: any; alarmId: any};
}
const convertFcmData = (message: FirebaseMessagingTypes.RemoteMessage) => {
  const convertObj: IFCMProps = {
    title: message.data?.title,
    body: message.data?.body,
    data: {
      _id: message.data?._id,
      img: message.data?.img,
      alarmId: message.data?.alarmId,
    },
  };
  return convertObj;
};
messaging().setBackgroundMessageHandler(async receiveMessage => {
  console.log('백그라운드 수신', receiveMessage);
  const convertMessage = convertFcmData(receiveMessage);
  onMessageReceived(convertMessage);
});

async function setupNotificationChannels() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'notify',
      name: '알림 상세 설정',
      description: '팝업 알림을 체크 하는 것을 추천 합니다.',
      importance: AndroidImportance.HIGH,
    });
  }
}

async function onMessageReceived(message: IFCMProps) {
  await notifee.displayNotification({
    ...message,
    android: {
      channelId: 'notify',
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
        launchActivity: 'default',
        mainComponent: 'Intro',
      },
      style: {
        type: AndroidStyle.BIGPICTURE,
        picture: message.data.img,
      },
    },

    data: {
      _id: message.data._id,
      postImg: message.data.img || '',
      alarmId: message.data.alarmId || '',
    },
  });
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  const [ready, setReady] = useState(false);
  const {login, setLogin} = useLoginStore(state => state);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const userStore = useUserStateStore(state => state);
  const pressAction = async ({type, detail}: Event) => {
    if (type === 1) {
      if (!navigationRef.current) return console.log('No Navigation Ref');
      if (!detail.notification?.data) return;
      if (detail.notification.data._id === 'test') return;
      if (detail.notification.data.alarmId) {
        await axios.put(SERVER_URL + 'alarm', {
          _id: detail.notification.data.alarmId,
          data: {checkout: true},
        });
        DeviceEventEmitter.emit('HistoryRefresh');
      }

      navigationRef.current.dispatch(
        StackActions.push('HistoryDetail', {
          _id: detail.notification.data!._id,
        }),
      );
    }
  };
  const init = async () => {
    // setLogin();
    try {
      // 디바이스 Id로 로그인 시도
      const loginRes = await loginReq();
      setLogin(loginRes.result);
      if (loginRes.result) {
        userStore.setChur(loginRes.user.chur);
        userStore.setFCMToken(loginRes.user.fcmToken);
      }

      // 퍼미션 조회 및 zustand 상태변경
      const permissionRes = await permissionRequest();
      userStore.setNotification(permissionRes);
      // FCM 토큰 조회 및 서버에 토큰 전달
      const fcmReq = await getFCMTokenAndPutAPI();
      console.log('✅ App Init Complate!');
    } catch (err) {
      console.log('App/init() Error', err);
    } finally {
      setReady(true);
      await BootSplash.hide({fade: true});
    }
  };

  useEffect(() => {
    init();

    const onMessage = messaging().onMessage(async remoteMessage => {
      const convertMessage = convertFcmData(remoteMessage);
      onMessageReceived(convertMessage);
    });
    const retryInit = DeviceEventEmitter.addListener('AppInit', init);

    const appState = AppState.addEventListener('change', AppStateStatus => {
      console.log('🔥 AppState : ', AppStateStatus);
      if (AppStateStatus === 'active' && ready === true) {
        init();
      }
    });

    return () => {
      appState.remove();
      retryInit.remove();
      onMessage();
    };
  }, [ready]);

  useEffect(() => {
    setupNotificationChannels();
    const backHandler = notifee.onBackgroundEvent(pressAction);

    const foreHandler = notifee.onForegroundEvent(pressAction);
    return () => {
      foreHandler();
    };
  }, []);
  if (!ready) return <></>;
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={login ? 'BottomStack' : 'Intro'}>
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="BottomStack" component={BottomTab} />
        <Stack.Screen name="Reservation" component={Reservation} />
        <Stack.Screen name="HistoryDetail" component={HistoryDetail} />
      </Stack.Navigator>
      <ModalBackground />
      <Loading />
      <BasicModal />
      <GuideModal />
      <PayModal />
      <PopupModal />
    </NavigationContainer>
  );
}

export default App;
