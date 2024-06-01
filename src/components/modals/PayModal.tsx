import React, {Dispatch, Fragment, SetStateAction, useState} from 'react';
import {View, Text, StyleSheet, Pressable, Modal, Image} from 'react-native';
import useModalStore from '../../hooks/useModalStore';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../configs/device';
import EmptyBox from '../EmptyBox';
import {ScreenProps} from '../../types/screenProps';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../styles/color';
import useGuideStore from '../../hooks/useGuideStore';
import usePayModalStore from '../../hooks/usePayModalStore';

function PayModal() {
  const navigation = useNavigation<any>();

  const {visible, hideModal, data} = usePayModalStore(state => state);
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
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{color: 'black'}}>하이하이</Text>
              <Image source={data.src} style={{width: 75, height: 90}} />
              <View style={{alignItems: 'flex-start'}}>
                <Text>츄르 [{data.cnt}개]를 </Text>
                <Text>[{data.price}원]에 구입</Text>
              </View>
            </View>
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
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default PayModal;
