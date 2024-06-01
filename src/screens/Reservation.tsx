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

function Reservation() {
  // const {cinemaTypes, movieName, imgUrl} = route.params;
  const navigation = useNavigation<NavigationProps<'Reservation'>>();
  const {chur, setChur} = useUserStateStore(state => state);
  const [pay, setPay] = useState(0);
  const {cinemaTypes, movieName, postImg, subscription} =
    useRoute<RouteProps<'Reservation'>>().params;
  console.log(useRoute<RouteProps<'Reservation'>>().params);
  const [cinemaType, setCinemaType] = useState([] as string[]);
  const modalStore = useModalStore(state => state);

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
    modalStore.setTitle('스케쥴 추적');
    modalStore.setContent(`
영화 : ${movieName}

상영종류 : ${cinemaType}

비용 : 츄르 ${pay}개

* 보유 중인 츄르 ${chur}개

          `);
    modalStore.setData({
      cinemaType,
      deviceId: deviceId,
      movieName,
      payChur: chur - pay,
      postImg,
    });
    modalStore.showModal();
  };

  return (
    <SafeAreaViewCustom>
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
                    const currentList = [...cinemaType];
                    if (currentList.includes(type.toUpperCase())) {
                      currentList.splice(
                        currentList.indexOf(type.toUpperCase()),
                        1,
                      );
                      setCinemaType([...currentList]);
                      if (type === 'imax') {
                        setPay(pay - 5);
                      } else {
                        setPay(pay - 2);
                      }
                    } else {
                      //등록
                      setCinemaType([...currentList, type.toUpperCase()]);
                      if (type === 'imax') {
                        setPay(pay + 5);
                      } else {
                        setPay(pay + 2);
                      }
                    }
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
        <View style={[styles.description]}>
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
        </View>

        <EmptyBox height={30} />
      </View>

      <View style={styles.bottomView}>
        <Pressable style={[styles.bottomLeftBtn]} onPress={goBack}>
          <Text style={{color: 'white'}}>이전</Text>
        </Pressable>
        <EmptyBox width={30} />
        <Pressable
          style={[
            styles.bottomRightBtn,
            {opacity: cinemaType.length > 0 && chur - pay >= 0 ? 1 : 0.5},
          ]}
          onPress={setContent}>
          <Text style={{color: 'white'}}>다음</Text>
        </Pressable>
      </View>
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
  churText: {fontSize: 20, fontWeight: '900', color: colors.White},
});
