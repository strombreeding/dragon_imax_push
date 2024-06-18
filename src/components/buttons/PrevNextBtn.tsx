import {Pressable, StyleSheet, Text, View} from 'react-native';
import EmptyBox from '../EmptyBox';
import {IOS} from '../../configs/device';
import {colors} from '../../styles/color';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';

interface IPrevNextBtnProps {
  leftText: string;
  rightText: string;
  rightAction: (val?: any) => any;
  condition: boolean;
}

function PrevNextBtn({
  condition,
  leftText,
  rightAction,
  rightText,
}: IPrevNextBtnProps) {
  const navigation = useNavigation<any>();
  const leftAction = useCallback(() => navigation.goBack(), []);
  return (
    <View style={styles.bottomView}>
      <Pressable style={[styles.bottomLeftBtn]} onPress={leftAction}>
        <Text style={{color: 'white'}}>{leftText}</Text>
      </Pressable>
      <EmptyBox width={30} />
      <Pressable
        style={[styles.bottomRightBtn, {opacity: condition ? 1 : 0.5}]}
        onPress={rightAction}>
        <Text style={{color: 'white'}}>{rightText}</Text>
      </Pressable>
    </View>
  );
}

export default PrevNextBtn;

const styles = StyleSheet.create({
  bottomView: {
    position: 'absolute',
    bottom: IOS ? 44 : 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
    marginTop: 15,
    paddingHorizontal: 30,
  },
  bottomRightBtn: {
    backgroundColor: colors.Accent,
    width: 100,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bottomLeftBtn: {
    backgroundColor: colors.Black,
    width: 100,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.White,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
