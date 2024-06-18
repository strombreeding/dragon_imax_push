import React, {Dispatch, Fragment, SetStateAction, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  DeviceEventEmitter,
  Alert,
} from 'react-native';
import useModalStore from '../../hooks/useModalStore';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../configs/device';
import EmptyBox from '../EmptyBox';
import {ScreenProps} from '../../types/screenProps';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../styles/color';
import useGuideStore from '../../hooks/useGuideStore';
import usePayModalStore from '../../hooks/usePayModalStore';
import {SERVER_URL} from '../../configs/server';
import axios from 'axios';
import usePopupStore from '../../hooks/usePopupStore';

function PayModal() {
  const navigation = useNavigation<any>();

  const {visible, hideModal, data} = usePayModalStore(state => state);
  const datas = usePopupStore(state => state.data);
  const onPress = async () => {
    try {
      console.log(SERVER_URL + 'subscriptions', datas.data);
      const res = await axios.post(SERVER_URL + 'subscriptions', datas.data);

      DeviceEventEmitter.emit('SubscriptionMovie');
      DeviceEventEmitter.emit('HistoryRefresh');
      navigation.navigate('BottomStack');
      hideModal();
    } catch (err) {
      console.log(err);
      Alert.alert('오류', '오류가 발생했네요. 잠시 후 다시 시도해보세요.');
    }
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
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'black', fontSize: 20, fontWeight: '700'}}>
                구독 완료!
              </Text>
              <Image source={data.src} style={{width: 75, height: 90}} />
            </View>
          </View>
          <Pressable
            onPress={onPress}
            style={{
              padding: 15,
              borderRadius: 30,
              backgroundColor: colors.Accent,
            }}>
            <Text style={{color: colors.White, fontSize: 16}}>확인</Text>
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
    padding: 40,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default PayModal;
