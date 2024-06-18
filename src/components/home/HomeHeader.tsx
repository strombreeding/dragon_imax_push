import {
  Image,
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import {icon} from '../../styles/icon';
import {colors} from '../../styles/color';
import useGuideStore from '../../hooks/useGuideStore';
import useUserStateStore from '../../hooks/useUserStateStore';
import {IOS, SCREEN_WIDTH} from '../../configs/device';
import {useNavigation} from '@react-navigation/native';
import {permissionRequest} from '../../apis/App';
import {PERMISSIONS, request} from 'react-native-permissions';

const {NotificationSetting, NotificationSettings} = NativeModules;

function HomeHeader() {
  const chur = useUserStateStore(state => state.chur);
  const showModal = useGuideStore(state => state.showModal);
  const navigation = useNavigation<any>();
  const notification = useUserStateStore(state => state.notification);

  const goToSetting = async () => {
    const android33 = Number(Platform.Version) >= 33;
    // Linking.openURL('app://settings');
    if (IOS) {
      Vibration.vibrate(45);
      NotificationSetting.goToNotificationSettings();
      return;
    }
    // android
    if (android33) {
      Vibration.vibrate(45);
    }
    if (!android33) {
      Vibration.vibrate(75);
    }
    if (notification === 'grant') {
      NotificationSettings.openNotificationSettings();
    }
    if (notification === 'dinei' && !android33) {
      await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      NotificationSettings.openNotificationSettings();
    }
    // if (notification === 'dinei' && android33) {
    //   NotificationSettings.openNotificationSettings();
    //   await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
    // }
  };
  return (
    <Pressable onPress={() => showModal()} style={styles.guideBtn}>
      <Image
        source={icon.note_30px}
        tintColor={colors.White}
        style={styles.guideImg}
      />
      <Pressable
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 40,
          paddingHorizontal: 10,
        }}
        onPress={goToSetting}>
        <View
          style={{
            width: 7,
            height: 7,
            marginRight: 3,
            borderRadius: 100,
            backgroundColor: notification === 'grant' ? '#18d81e' : '#fa2929',
          }}
        />
        <Text>알림 : {notification === 'grant' ? '허용' : '꺼짐'}</Text>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate('상점')}
        style={{flexDirection: 'row'}}>
        <Image source={icon.chur} style={{width: 25, height: 30}} />
        <Text style={{fontSize: 18, color: 'white', fontWeight: '900'}}>
          {chur}
        </Text>
      </Pressable>
    </Pressable>
  );
}

export default HomeHeader;

const styles = StyleSheet.create({
  guideBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 3,
    width: SCREEN_WIDTH,
  },
  guideImg: {
    width: 30,
    aspectRatio: 1,
  },
});
