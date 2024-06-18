import {
  Alert,
  BackHandler,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SafeAreaViewCustom from '../components/SafeAreaViewCustom';
import {IOS, SCREEN_WIDTH, deviceId} from '../configs/device';
import EmptyBox from '../components/EmptyBox';
import {Fragment, useEffect, useState} from 'react';
import useModalStore from '../hooks/useModalStore';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NavigationProps, RouteProps} from '../types/navigationProps';
import {colors} from '../styles/color';
import useUserStateStore from '../hooks/useUserStateStore';
import {icon} from '../styles/icon';
import PrevNextBtn from '../components/buttons/PrevNextBtn';
import useLoadingStore from '../hooks/useLoadingStore';
import useAdmobStore from '../hooks/useAdmonStore';
import usePopupStore from '../hooks/usePopupStore';
import Admob from '../components/admob/Admob';

function Reservation() {
  // const {cinemaTypes, movieName, imgUrl} = route.params;
  const navigation = useNavigation<NavigationProps<'Reservation'>>();
  const {chur, setChur} = useUserStateStore(state => state);
  const [pay, setPay] = useState(0);
  const {cinemaTypes, movieName, postImg, subscription} =
    useRoute<RouteProps<'Reservation'>>().params;
  console.log(useRoute<RouteProps<'Reservation'>>().params);
  const [cinemaType, setCinemaType] = useState(['IMAX'] as string[]);
  const modalStore = useModalStore(state => state);

  const {hideLoading, showLoading, visible} = useLoadingStore(state => state);
  const popupStore = usePopupStore(state => state);
  const admobVisible = useAdmobStore(state => state.visible);
  const show = useAdmobStore(state => state.show);
  const admobPopup = () => {
    if (admobVisible) {
    } else {
      popupStore.setPopupData({
        content: `광고를 시청하고 
[${movieName}]/[${cinemaType}] 을(를) 구독하세요!`,
        leftText: '취소',
        rightAction: () => {
          show();
          showLoading();
        },
        rightText: '시청',
        title: '광고시청',
        data: {
          cinemaType,
          deviceId: deviceId,
          movieName,
          payChur: pay,
          postImg,
        },
      });
      popupStore.showModal();
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const setContent = () => {
    if (cinemaType.length === 0) {
      Alert.alert('', 'Screen을 골라주세요!');
      return;
    }
    if (chur - pay < 0) {
      return;
    }
    admobPopup();

    //     modalStore.setTitle('구독');
    //     modalStore.setContent(`
    // 영화 : ${movieName}

    // 상영종류 : ${cinemaType}

    // 비용 : 광고시청 1회

    //           `);
    //     modalStore.setData({
    //       cinemaType,
    //       deviceId: deviceId,
    //       movieName,
    //       payChur: pay,
    //       postImg,
    //     });
    //     modalStore.showModal();
  };
  console.log(cinemaType);

  return (
    <SafeAreaViewCustom>
      {admobVisible && <Admob />}

      <View
        style={{
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '100%',
          width: '100%',
        }}>
        <EmptyBox height={10} />

        <View style={{alignItems: 'center'}}>
          <Image source={{uri: postImg}} style={{width: 185, height: 260}} />
        </View>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
            Screen
          </Text>

          <EmptyBox height={30} />

          <View style={[styles.cinemaTypeView]}>
            {cinemaTypes.map((type, i) => {
              if (
                subscription != null &&
                subscription.includes(type.toUpperCase())
              ) {
                return <Fragment key={i}></Fragment>;
              }
              return (
                <Pressable
                  key={i}
                  onPress={() => {
                    setCinemaType([type.toUpperCase()]);
                  }}
                  style={[
                    cinemaType.includes(type.toUpperCase())
                      ? styles.activeContentBtn
                      : styles.unContentBtn,
                    type === 'imax'
                      ? {backgroundColor: 'skyblue'}
                      : {backgroundColor: 'grey'},
                  ]}>
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '900',
                      fontSize: 20,
                    }}>
                    {type.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        {/* <View style={[styles.description]}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={styles.churText}>비용 : </Text>
            <Image source={icon.chur} style={{width: 25, height: 30}} />
            <Text style={styles.churText}>{pay}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={styles.churText}>보유 : </Text>
            <Image source={icon.chur} style={{width: 25, height: 30}} />
            <Text style={styles.churText}>{chur}</Text>
          </View>
          <Text style={{color: 'white'}}>--------------------</Text>
          {chur - pay < 0 ? (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '900',
                  color: colors.Accent,
                }}>
                츄르가 {chur - pay}만큼 부족합니다.
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text style={styles.churText}>잔여 </Text>
              <Text style={styles.churText}>{chur - pay}</Text>
            </View>
          )}
        </View> */}

        <EmptyBox height={30} />
      </View>

      <PrevNextBtn
        // condition={cinemaType.length > 0 && chur - pay >= 0}
        condition={true}
        leftText="이전"
        rightAction={setContent}
        rightText="다음"
      />
    </SafeAreaViewCustom>
  );
}

export default Reservation;

const styles = StyleSheet.create({
  goBackBtn: {
    position: 'absolute',
    paddingHorizontal: 15,
    zIndex: 1,
  },
  description: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cinemaTypeView: {
    flexDirection: 'row',
    padding: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unContentBtn: {
    padding: 10,
    width: SCREEN_WIDTH / 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 0.7,
  },
  activeContentBtn: {
    padding: 10,
    width: SCREEN_WIDTH / 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 1,
    borderWidth: 1,
    borderColor: colors.Accent,
  },

  churText: {fontSize: 20, fontWeight: '900', color: colors.White},
});
