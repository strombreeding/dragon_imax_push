import React, {Dispatch, Fragment, SetStateAction, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Modal} from 'react-native';
import useModalStore from '../../hooks/useModalStore';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../configs/device';
import EmptyBox from '../EmptyBox';
import {ScreenProps} from '../../types/screenProps';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../styles/color';
import useGuideStore from '../../hooks/useGuideStore';

function GuideModal() {
  const navigation = useNavigation<any>();

  const {visible, hideModal} = useGuideStore(state => state);
  const onPress = () => {
    hideModal();
  };
  const req = async () => {
    hideModal();
    navigation.navigate('HomeScreen');
  };

  if (!visible) return <></>;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onPress}>
      <Pressable onPress={onPress} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              padding: 25,
            }}>
            <Text style={{fontSize: 19, fontWeight: '500'}}>
              1. [ 용산CGV ]를 모니터링하여 {'\n'}[ IMAX ]와 [ 4DX ]상영관의
              업데이트 소식을 알려줍니다.
              {'\n'}
            </Text>
            <Text style={{fontSize: 19, fontWeight: '500'}}>
              2. 정상적으로 기능이 작동할 수 있도록 [푸쉬알림]설정을 켜두세요.
              {'\n'}
              <Text style={{fontSize: 15}}>
                *[홈][마이]탭 상당중앙에서 변경 가능
              </Text>
              {'\n'}
            </Text>
            <Text style={{fontSize: 19, fontWeight: '500'}}>
              3. [용아맥뚫었냥]의 정보를 맹신하시지는 마시길 바랍니다.
              {'\n'}
            </Text>
            <Text style={{fontSize: 19, fontWeight: '500'}}>
              4. 추적에 필요한 츄르는 상점탭에서 획득하실 수 있습니다.
              {'\n'}
            </Text>
            <Text style={{fontSize: 19, fontWeight: '500'}}>
              그럼 [용아맥 뚫었냥]과 함께 성공적인 예매를 기원합니다!
              {'\n'}
            </Text>
          </View>
          <Pressable
            onPress={onPress}
            style={{
              padding: 20,
              borderRadius: 30,
              backgroundColor: colors.Accent,
            }}>
            <Text style={{color: colors.White, fontSize: 20}}>닫기</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: colors.Grey,
    borderRadius: 20,
    width: '90%',
    padding: 1,
    height: SCREEN_HEIGHT / 1.4,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default GuideModal;
