import React from 'react';
import {View, Text, StyleSheet, Pressable, Modal} from 'react-native';
import {SCREEN_HEIGHT} from '../../configs/device';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../styles/color';
import {IPopupModalProps} from '../../types/App';
import usePopupStore from '../../hooks/usePopupStore';
import EmptyBox from '../EmptyBox';

function PopupModal() {
  const navigation = useNavigation<any>();

  const {visible, hideModal, data} = usePopupStore(state => state);
  const onPress = () => {
    hideModal();
  };

  if (!visible) return <></>;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onPress}>
      <Pressable onPress={onPress} style={styles.centeredView}>
        <View
          style={{
            backgroundColor: colors.Grey,
            marginHorizontal: 10,
            borderRadius: 15,
            paddingHorizontal: 30,
            paddingVertical: 50,
          }}>
          <View>
            <Text
              style={{color: colors.Black, fontSize: 22, fontWeight: '900'}}>
              {data.title}
            </Text>
          </View>
          <EmptyBox height={30} />
          <View>
            <Text style={{color: colors.BgColor, fontSize: 17}}>
              {data.content}
            </Text>
          </View>
          <EmptyBox height={30} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <Pressable style={styles.leftBtn} onPress={onPress}>
              <Text style={{color: 'white', fontWeight: '800', fontSize: 16}}>
                {data.leftText}
              </Text>
            </Pressable>
            <EmptyBox width={50} />
            <Pressable
              style={styles.rightBtn}
              onPress={() => {
                data.rightAction();
                hideModal();
              }}>
              <Text style={{color: 'white', fontWeight: '800', fontSize: 16}}>
                {data.rightText}
              </Text>
            </Pressable>
          </View>
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
    backgroundColor: colors.BgColor,
    borderWidth: 2,
    borderColor: colors.White,
    padding: 15,
    borderRadius: 30,
  },
  rightBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.Accent,
    padding: 15,
    borderRadius: 30,
  },
});

export default PopupModal;
