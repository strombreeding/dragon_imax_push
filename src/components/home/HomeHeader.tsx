import {Image, Pressable, Text, View} from 'react-native';
import {icon} from '../../styles/icon';
import {colors} from '../../styles/color';
import useGuideStore from '../../hooks/useGuideStore';
import useUserStateStore from '../../hooks/useUserStateStore';
import {SCREEN_WIDTH} from '../../configs/device';
import {useNavigation} from '@react-navigation/native';

function HomeHeader() {
  const chur = useUserStateStore(state => state.chur);
  const showModal = useGuideStore(state => state.showModal);
  const navigation = useNavigation<any>();
  return (
    <Pressable
      onPress={() => showModal()}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        marginTop: 3,
        width: SCREEN_WIDTH,
      }}>
      <Image
        source={icon.note_30px}
        tintColor={colors.White}
        style={{
          width: 30,
          aspectRatio: 1,
        }}
      />
      <Pressable
        onPress={() => navigation.navigate('상점')}
        style={{
          flexDirection: 'row',
        }}>
        <Image source={icon.chur} style={{width: 25, height: 30}} />
        <Text style={{fontSize: 18, color: 'white', fontWeight: '900'}}>
          {chur}
        </Text>
      </Pressable>
    </Pressable>
  );
}

export default HomeHeader;
