import SafeAreaViewCustom from '../components/SafeAreaViewCustom';
import SpecialBanner from '../components/banners/SpecialBanner';
import Header from '../components/home/HomeHeader';
import EmptyBox from '../components/EmptyBox';
import {Alert, Pressable, Text, View} from 'react-native';
import {colors} from '../styles/color';
import {SCREEN_HEIGHT, deviceId} from '../configs/device';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import useLoginStore from '../hooks/useLoginStore';
import axios from 'axios';
import {SERVER_URL} from '../configs/server';
import useGuideStore from '../hooks/useGuideStore';

function Intro() {
  const navigation = useNavigation<any>();
  const loginState = useLoginStore(state => state.login);
  const showGuideModal = useGuideStore(state => state.showModal);
  const onPress = () => {
    navigation.replace('BottomStack');
  };
  const join = async () => {
    try {
      const res = await axios.post(SERVER_URL + 'users', {deviceId});
      if (res.data === 'already') {
        onPress();
        return;
      }
      if (res.data === true) {
        showGuideModal();
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
    console.log(loginState, '인트로');
    if (loginState) {
      onPress();
    }
  }, [loginState]);
  return (
    <SafeAreaViewCustom>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: SCREEN_HEIGHT,
        }}>
        <Text style={{color: 'white'}}>하이 반가워</Text>
        <Text style={{color: 'white'}}>진행하려면 </Text>
        <Pressable
          style={{padding: 30, backgroundColor: colors.Accent}}
          onPress={join}>
          <Text style={{color: 'white'}}>BUTTON </Text>
        </Pressable>
      </View>
    </SafeAreaViewCustom>
  );
}

export default Intro;
