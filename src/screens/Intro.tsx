import SafeAreaViewCustom from '../components/SafeAreaViewCustom';
import SpecialBanner from '../components/banners/SpecialBanner';
import Header from '../components/home/HomeHeader';
import EmptyBox from '../components/EmptyBox';
import {
  Alert,
  DeviceEventEmitter,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import {colors} from '../styles/color';
import {SCREEN_HEIGHT, SCREEN_WIDTH, deviceId} from '../configs/device';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import useLoginStore from '../hooks/useLoginStore';
import axios from 'axios';
import {SERVER_URL} from '../configs/server';
import useGuideStore from '../hooks/useGuideStore';
import {getFCMTokenAndPutAPI, loginReq} from '../apis/App';
import useUserStateStore from '../hooks/useUserStateStore';
import {icon} from '../styles/icon';

function Intro() {
  const navigation = useNavigation<any>();
  const loginState = useLoginStore(state => state.login);
  const {notification, setNotification} = useUserStateStore(state => state);
  const showGuideModal = useGuideStore(state => state.showModal);
  const onPress = () => {
    navigation.replace('BottomStack');
  };
  const join = async () => {
    try {
      const res = await axios.post(SERVER_URL + 'users', {deviceId});

      if (res.data === 'already') {
        DeviceEventEmitter.emit('AppInit');
        return;
      }
      if (res.data === true) {
        DeviceEventEmitter.emit('AppInit');
        showGuideModal();
        await getFCMTokenAndPutAPI();
        onPress();
      }
    } catch (err: any) {
      console.log(err);
      Alert.alert(
        '오류',
        '오류가 발생했습니다. 빠른 시간 안에 확인 후 처리하겠습니다.',
      );
    }
  };
  useEffect(() => {
    if (loginState) {
      onPress();
    }
  }, [loginState, notification]);
  return (
    <SafeAreaViewCustom>
      <View
        style={{
          alignItems: 'center',
          height: SCREEN_HEIGHT,
          justifyContent: 'space-around',
          width: '100%',
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}>
          <View
            style={{
              padding: 30,
              alignContent: 'center',
              width: '100%',
              justifyContent: 'center',
            }}>
            <Image
              source={icon.logo0}
              style={{width: SCREEN_WIDTH / 5, height: SCREEN_WIDTH / 5}}
            />
            <Text style={{color: 'white', fontSize: 28, fontWeight: '700'}}>
              용산 아이맥스 뚫었냥?
            </Text>
          </View>
          <View style={{marginHorizontal: 10}}>
            <Text style={{color: 'white', fontSize: 20, padding: 10}}>
              - 본 서비스는 CGV 용산아이파크몰 의 IMAX와 4DX의 상영스케쥴을
              모니터링하여 변경점이 생길 경우에 푸시알람을 해줍니다
            </Text>
            <Text style={{color: 'white', fontSize: 20, padding: 10}}>
              - 업데이트소식을 수신후 빠르게 예매해서 IMAX 명당석 잡아봅시다!
            </Text>
            <Text style={{color: 'white', fontSize: 20, padding: 10}}>
              - 원활한 서비스 이용을 위해서 귀하의 기기정보와 푸시알림을
              요구합니다
              {'\n'}
              <Text style={{color: 'white', fontSize: 15}}>
                (푸시알림은 언제든 끌 수 있습니다.)
              </Text>
            </Text>
          </View>
        </View>

        <Pressable
          style={{
            padding: 20,
            borderRadius: 10,
            backgroundColor: colors.Accent,
          }}
          onPress={join}>
          <Text style={{color: 'white'}}>
            디바이스 정보 제공 동의 후 서비스 시작!{' '}
          </Text>
        </Pressable>
        <EmptyBox height={1} />
      </View>
    </SafeAreaViewCustom>
  );
}

export default Intro;
