import React, {Dispatch, Fragment, SetStateAction, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  DeviceEventEmitter,
  Alert,
} from 'react-native';
import useModalStore from '../../hooks/useModalStore';
import {SCREEN_WIDTH} from '../../configs/device';
import EmptyBox from '../EmptyBox';
import {ScreenProps} from '../../types/screenProps';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../styles/color';
import axios from 'axios';
import {SERVER_URL} from '../../configs/server';
import useUserStateStore from '../../hooks/useUserStateStore';
import usePopupStore from '../../hooks/usePopupStore';
import useAdmobStore from '../../hooks/useAdmonStore';
import useLoadingStore from '../../hooks/useLoadingStore';

function BasicModal() {
  const navigation = useNavigation<any>();
  const setChur = useUserStateStore(state => state.setChur);
  const {visible, hideModal, content, title, data} = useModalStore(
    state => state,
  );

  const onPress = () => {
    hideModal();
  };
  const req = async () => {
    console.log(data);
    try {
      const res = await axios.post(SERVER_URL + 'subscriptions', data);

      DeviceEventEmitter.emit('SubscriptionMovie');
      DeviceEventEmitter.emit('HistoryRefresh');
      setChur(data.payChur);
      navigation.navigate('BottomStack');
      onPress();
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
          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'black'}}>{title}</Text>
            <Text style={{color: 'black'}}>{content}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Pressable style={styles.leftBtn} onPress={onPress}>
              <Text style={{color: 'white'}}>취소</Text>
            </Pressable>
            <EmptyBox width={50} />
            <Pressable style={styles.rightBtn} onPress={req}>
              <Text style={{color: 'white'}}>시청</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

export default BasicModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    marginHorizontal: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    elevation: 5,
  },
  leftBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.Grey,
    padding: 20,
    borderRadius: 30,
  },
  rightBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.Accent,
    padding: 20,
    borderRadius: 30,
  },
});
