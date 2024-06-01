import {Pressable, Text} from 'react-native';
import SafeAreaViewCustom from '../components/SafeAreaViewCustom';
import MypageHeader from '../components/mypage/MypageHeader';
import {useEffect} from 'react';

function Mypage() {
  return (
    <SafeAreaViewCustom>
      <MypageHeader />
      <Pressable
        style={{
          backgroundColor: 'red',
          padding: 100,
        }}>
        <Text>FCM 테스트</Text>
      </Pressable>
    </SafeAreaViewCustom>
  );
}

export default Mypage;
