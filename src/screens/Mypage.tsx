import {
  Alert,
  DeviceEventEmitter,
  Image,
  NativeModules,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import SafeAreaViewCustom from '../components/SafeAreaViewCustom';
import MypageHeader from '../components/mypage/MypageHeader';
import {useEffect, useRef, useState} from 'react';
import Header from '../components/home/HomeHeader';
import {PERMISSIONS, check, request} from 'react-native-permissions';
import {colors} from '../styles/color';
import {IconType, icon} from '../styles/icon';
import {SCREEN_WIDTH, deviceId} from '../configs/device';
import axios from 'axios';
import {SERVER_URL} from '../configs/server';
import {useNavigation} from '@react-navigation/native';
import usePopupStore from '../hooks/usePopupStore';
import useUserStateStore from '../hooks/useUserStateStore';

const {NotificationSettings} = NativeModules;
function Mypage() {
  const {setPopupData, showModal} = usePopupStore(state => state);
  const userState = useUserStateStore(state => state);
  const [src, setSrc] = useState<IconType>(
    `logo${Math.round(Math.random() * 3)}` as IconType,
  );
  const navigation = useNavigation<any>();

  const canFCMTest = useRef(true);

  const recieveFunction = async () => {
    const res = await axios.delete(SERVER_URL + 'users', {
      data: {deviceId},
    });

    DeviceEventEmitter.emit('AppInit');
    setTimeout(() => navigation.replace('Intro'), 300);
    console.log(res);
  };

  const fcmTest = async () => {
    console.log('클릭');
    Vibration.vibrate(100);
    if (canFCMTest.current == true) {
      try {
        canFCMTest.current = false;
        axios.post(SERVER_URL + 'notifications/test', {
          fcmToken: userState.fcmToken,
        });
        setTimeout(() => (canFCMTest.current = true), 300000);
      } catch (err) {
        console.log(err);
      }
    } else {
      Alert.alert('푸시알림 테스트 실패', '잠시 후 다시 시도해주세요.');
    }
  };

  const removeInfomation = async () => {
    // const res = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);'
    setPopupData({
      content:
        '디바이스 정보를 삭제하면 구독 정보와 남은 츄르가 모두 사라집니다.\n진행 하시겠습니까?',
      leftText: '취소',
      rightAction: recieveFunction,
      rightText: '네',
      title: '계정 정보 삭제',
    });
    showModal();
  };

  return (
    <SafeAreaViewCustom>
      <Header />

      <View style={{justifyContent: 'space-around', flex: 1}}>
        <View style={{width: '100%', alignItems: 'center'}}>
          <Image
            source={icon[src]}
            style={{width: SCREEN_WIDTH / 2, height: SCREEN_WIDTH / 2}}
          />
        </View>
        <View>
          <Pressable style={styles.btns} onPress={fcmTest}>
            <Text style={{color: 'white'}}>푸시알림 테스트</Text>
          </Pressable>
          <Pressable style={styles.btns} onPress={removeInfomation}>
            <Text
              style={{color: colors.White, fontSize: 15, fontWeight: '800'}}>
              디바이스 정보 삭제
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaViewCustom>
  );
}

export default Mypage;

const styles = StyleSheet.create({
  btns: {
    backgroundColor: colors.Black,
    borderWidth: 1,
    borderColor: colors.Grey,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 100,
    alignItems: 'center',
    marginVertical: 20,
  },
});
