import {
  Alert,
  AppState,
  BackHandler,
  DeviceEventEmitter,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SafeAreaViewCustom from '../components/SafeAreaViewCustom';
import HistoryHeader from '../components/history/HistoryHeader';
import {colors} from '../styles/color';
import HistoryTabs from '../components/history/Tabs';
import {FC, useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {SERVER_URL} from '../configs/server';
import {IOS, SCREEN_WIDTH, deviceId} from '../configs/device';
import {formatDateString} from '../utils/formatDateRange';
import {icon} from '../styles/icon';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import EmptyBox from '../components/EmptyBox';
import {NavigationProps} from '../types/navigationProps';
import {IAlarmProps} from '../types/History';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureTouchEvent,
  LongPressGestureHandler,
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {postImgSize} from '../styles/postImg';
interface ISubscriptionData {
  _id: string;
  cinemaType: string;
  create_at: string;
  deviceId: string;
  enabled: boolean;
  expired: boolean;
  movieName: string;
  postImg: string;
}

function PushAlarmView({i, item}: {i: number; item: any}) {
  const [targetAlarmIndex, setTargetAlarmIndex] = useState(-100);
  const navigation = useNavigation<any>();
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: translateX.value}],
      opacity: opacity.value,
    };
  });

  const panGesture = Gesture.Pan()
    .onStart(e => {
      runOnJS(setTargetAlarmIndex)(i);
    })
    .onUpdate(event => {
      translateX.value = event.translationX;
    })
    .onEnd(async e => {
      const changedValue = e.translationX;
      runOnJS(setTargetAlarmIndex)(-1);
      if (changedValue > 120) {
        // await axios.delete(SERVER_URL + 'alarm', {
        //   data: {_id: item._id},
        // });
        translateX.value = withSpring(SCREEN_WIDTH);
        opacity.value = withSpring(0, {duration: 100});
      } else if (changedValue < -120) {
        translateX.value = withSpring(-SCREEN_WIDTH);
        opacity.value = withSpring(0, {duration: 100});
      } else {
        translateX.value = withSpring(0);
      }
    });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={panGesture}>
        <Animated.View key={i} style={[animatedStyle]}>
          <Pressable
            style={[
              styles.mainBtn,
              {
                backgroundColor: item.checkout ? colors.BgColor : colors.Accent,
                borderColor: item.checkout ? colors.Grey : colors.Accent,
                opacity: targetAlarmIndex === i ? 0.4 : 1,
              },
            ]}
            onPress={async () => {
              console.log('이거 눌리나?');
              await axios.put(SERVER_URL + 'alarm', {
                _id: item._id,
                data: {checkout: true},
              });
              DeviceEventEmitter.emit('HistoryRefresh');
              navigation.navigate('HistoryDetail', {
                _id: item.notificationId,
              });
            }}
            key={i}>
            {/* <Text>{item.notificationId}</Text> */}
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{uri: item.postImg}}
                style={{width: 23 * 1.5, height: 32 * 1.5}}
              />
              <EmptyBox width={10} />
              <View>
                <Text
                  style={{
                    color: colors.White,
                    fontSize: 15,
                    fontWeight: '800',
                  }}>
                  {item.date}/{item.cinemaType}
                </Text>
                <Text
                  style={{
                    color: colors.White,
                    fontSize: 15,
                    fontWeight: '800',
                  }}
                  numberOfLines={1}>
                  {item.movieName}
                </Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

function History() {
  const [tabName, setTabName] = useState('추적중');
  const [filteredData, setFilteredData] = useState([] as any[]);
  const [expiredData, setExpiredData] = useState([] as any[]);
  const [data, setData] = useState([] as any[]);
  const [alarmData, setAlarmData] = useState([] as IAlarmProps[]);
  const [refresh, setRefresh] = useState(false);
  const navigation = useNavigation<NavigationProps<'HomeScreen'>>();
  const [visibleAlarm, setVisibleAlarm] = useState(false);
  const alarmViewStyle = useSharedValue({
    right: -SCREEN_WIDTH / 1.5,
    bdWidth: 0,
  });

  const updateStack = useRef<
    {
      _id: string;
      enabled: boolean;
    }[]
  >([]);
  const req = async () => {
    // 구독중인 놈들을 가져와야함
    try {
      const res = await axios.get(
        SERVER_URL + 'subscriptions?deviceId=' + deviceId,
      );
      const res2 = await axios.get(SERVER_URL + 'alarm?deviceId=' + deviceId);
      const sortedMovies = res.data.sort((a: any, b: any) =>
        a.movieName.localeCompare(b.movieName),
      );
      setAlarmData(res2.data);
      const expiredList: any[] = [];
      const ingList: any[] = [];
      sortedMovies.map((item: ISubscriptionData) => {
        if (item.expired) {
          expiredList.push(item);
        } else {
          ingList.push(item);
        }
      });
      setFilteredData([...ingList].sort());
      setExpiredData([...expiredList].sort());
    } catch (err) {
      console.log(err);
    }
  };
  const onRefresh = () => {
    setRefresh(true);
    if (updateStack.current.length > 0) {
      updateReq();
    } else {
      req();
    }
    // updateReq();
    setRefresh(false);
  };

  const [ready, setReady] = useState(false);
  useEffect(() => {
    req();
    const appState = AppState.addEventListener('change', AppStateStatus => {
      console.log('🔥 History Refresh ');
      if (AppStateStatus === 'active') {
        req();
      }
    });
    const deviceEmitter = DeviceEventEmitter.addListener(
      'HistoryRefresh',
      onRefresh,
    );

    return () => {
      deviceEmitter.remove();
      appState.remove();
    };
  }, []);

  useEffect(() => {
    // 각 조건 필터링 된 배열 filteredData 에 넣기
    if (tabName === '추적중') {
      setData([...filteredData]);
    }

    if (tabName === '추적완료') {
      setData([...expiredData]);
    }

    if (!IOS) {
      const backhandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (visibleAlarm) {
            handlePress();
          } else {
            navigation.goBack();
          }
          return true;
        },
      );
      return () => backhandler.remove();
    }
  }, [tabName, filteredData, expiredData, visibleAlarm]);

  const updateReq = async () => {
    const res = await axios.put(
      SERVER_URL + 'subscriptions',
      updateStack.current,
    );
    updateStack.current = [];
    onRefresh();
  };
  const animatedStyles = useAnimatedStyle(() => ({
    right: withTiming(alarmViewStyle.value.right, {duration: 300}),
    borderLeftWidth: withTiming(alarmViewStyle.value.bdWidth, {duration: 300}),
  }));
  const handlePress = () => {
    if (visibleAlarm) {
      console.log('없어졌다.');
      setVisibleAlarm(false);
      alarmViewStyle.value = {
        right: -(SCREEN_WIDTH / 1.5),
        bdWidth: 0,
      };
    } else {
      console.log('나왔다');
      setVisibleAlarm(true);
      alarmViewStyle.value = {
        right: 0,
        bdWidth: 1,
      };
    }
  };
  useFocusEffect(
    useCallback(() => {
      // 화면에 포커스가 있을 때 실행할 코드
      console.log('Screen is focused');

      // 포커스를 잃었을 때 실행할 클린업 함수 반환
      return () => {
        updateReq();

        console.log('Screen is unfocused');
      };
    }, []),
  );

  const renderItem = useCallback(
    ({item, index}: {item: ISubscriptionData; index: number}) => {
      return (
        <Pressable style={{width: SCREEN_WIDTH, padding: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {/* 이미지~info 쪽 */}
            <View style={{flexDirection: 'row', flex: 6}}>
              <Image source={{uri: item.postImg}} style={postImgSize.middle} />
              <View
                style={{padding: 10, flex: 1, backgroundColor: '#c8c8c87d'}}>
                <View
                  style={{
                    backgroundColor:
                      item.cinemaType === 'IMAX' ? 'skyblue' : colors.Grey,
                    borderRadius: 5,
                    width: 70,
                    alignItems: 'center',
                  }}>
                  <Text style={{fontSize: 15, fontWeight: '800'}}>
                    {item.cinemaType}
                  </Text>
                </View>
                <View
                  style={{
                    padding: 5,
                    width: '100%',
                    flex: 1,
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{fontSize: 13, color: 'white'}}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {item.movieName}
                  </Text>
                  <Text style={{fontSize: 13, color: 'white'}}>
                    추적시작 : {formatDateString(item.create_at)}
                  </Text>
                </View>
              </View>
            </View>
            {/* 알람 버튼 쪽 */}

            {/* 추적중 */}
            {!item.expired && (
              <Pressable
                onPress={() => {
                  const updateStackList = [...updateStack.current];
                  const copyData = [...filteredData];
                  copyData[index].enabled = !copyData[index].enabled;
                  let processType = '';
                  if (
                    updateStackList.find(listItem => listItem._id === item._id)
                  ) {
                    processType = 'current';
                  } else {
                    processType = 'update';
                  }

                  if (processType === 'update') {
                    updateStackList.push({
                      _id: item._id,
                      enabled: copyData[index].enabled,
                    });
                  } else {
                    const i = updateStackList.findIndex(
                      ele => ele['_id'] === item._id,
                    );
                    updateStackList.splice(i, 1);
                  }
                  console.log(updateStackList);
                  updateStack.current = [...updateStackList];
                  setData([...copyData]);

                  // setUpdateStack([...updateStackList]);
                }}
                style={[
                  item.enabled
                    ? {
                        backgroundColor: colors.Accent,
                      }
                    : {
                        borderWidth: 1,
                        backgroundColor: colors.BgColor,
                        borderColor: colors.Grey,
                      },
                  styles.itemRightBtn,
                ]}>
                <Image
                  source={icon.bell_26px}
                  style={{width: 30, height: 30}}
                  tintColor={item.enabled ? colors.BgColor : colors.White}
                />

                <View
                  style={{
                    padding: 1.5,
                    height: 40,
                    width: 1,
                    backgroundColor: colors.BgColor,
                    transform: [{rotate: '45deg'}],
                    position: 'absolute',
                    opacity: item.enabled ? 1 : 0,
                  }}
                />
              </Pressable>
            )}

            {/* 추적 완료 */}
            {item.expired && (
              <Pressable
                onPress={async () => {
                  await axios.delete(SERVER_URL + 'subscriptions', {
                    data: {_id: item._id},
                  });
                  onRefresh();
                  DeviceEventEmitter.emit('SubscriptionMovie');
                }}
                style={[
                  {
                    backgroundColor: colors.BgColor,
                    borderWidth: 1,
                    borderColor: 'grey',
                  },
                  styles.itemRightBtn,
                ]}>
                <Text
                  style={{
                    color: colors.White,
                    fontWeight: '900',
                    fontSize: 15,
                  }}>
                  삭제
                </Text>
              </Pressable>
            )}
          </View>
        </Pressable>
      );
    },
    [data],
  );

  // const translateX = useSharedValue(0);
  const pressInX = useRef(0);
  const PressOutX = useRef(0);

  return (
    <SafeAreaViewCustom>
      {visibleAlarm && (
        <Pressable style={styles.modalBg} onPress={handlePress} />
      )}
      <HistoryHeader alarmData={alarmData} handlePress={handlePress} />

      <HistoryTabs tabName={tabName} setTabName={setTabName} />
      {tabName === '추적중' && (
        <View style={{padding: 4}}>
          <Text style={{color: colors.White, fontWeight: '600'}}>
            검정색 종 = 알림 해제
          </Text>
        </View>
      )}
      {/* 필터데이트 */}
      <FlatList
        data={data}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      />

      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            top: 0,
            backgroundColor: colors.BgColor,
            borderLeftColor: colors.Grey,
            width: SCREEN_WIDTH / 1.5,
            padding: 10,
            zIndex: 3,
          },
          animatedStyles,
        ]}>
        <View>
          <Text style={{color: 'white', fontSize: 22, fontWeight: '900'}}>
            알림센터
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingVertical: 20,
          }}>
          <ScrollView style={{flex: 1}}>
            {alarmData.map((item, i) => {
              return <PushAlarmView key={i} item={item} i={i} />;
            })}
          </ScrollView>
          <Pressable
            style={{
              padding: 10,
            }}
            onPress={handlePress}>
            <Text
              style={{fontSize: 22, fontWeight: '900', color: colors.White}}>
              {'>>'}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaViewCustom>
  );
}

export default History;

const styles = StyleSheet.create({
  itemRightBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.Black,
    zIndex: 1,
    opacity: 0.4,
  },
  mainBtn: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

/* 



*/
