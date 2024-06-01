import {
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
import {useCallback, useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {SERVER_URL} from '../configs/server';
import {SCREEN_WIDTH, deviceId} from '../configs/device';
import {formatDateString} from '../utils/formatDateRange';
import {icon} from '../styles/icon';
import {useFocusEffect} from '@react-navigation/native';
import EmptyBox from '../components/EmptyBox';

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

function History() {
  const [tabName, setTabName] = useState('추적중');
  const [filteredData, setFilteredData] = useState([] as any[]);
  const [expiredData, setExpiredData] = useState([] as any[]);
  const [data, setData] = useState([] as any[]);
  const [refresh, setRefresh] = useState(false);

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

      const expiredList: any[] = [];
      const ingList: any[] = [];
      res.data.map((item: ISubscriptionData) => {
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

  useEffect(() => {
    req();

    DeviceEventEmitter.addListener('HistoryRefresh', onRefresh);
  }, []);

  useEffect(() => {
    // 각 조건 필터링 된 배열 filteredData 에 넣기
    if (tabName === '추적중') {
      setData([...filteredData]);
    }

    if (tabName === '추적완료') {
      setData([...expiredData]);
    }
  }, [tabName, filteredData, expiredData]);

  const updateReq = async () => {
    const res = await axios.put(
      SERVER_URL + 'subscriptions',
      updateStack.current,
    );
    updateStack.current = [];
    onRefresh();
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
  console.log(expiredData, 'ㅇㅅㅇ');
  const renderItem = useCallback(
    ({item, index}: {item: ISubscriptionData; index: number}) => {
      return (
        <Pressable style={{width: SCREEN_WIDTH, padding: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {/* 이미지~info 쪽 */}
            <View style={{flexDirection: 'row', flex: 6}}>
              <Image
                source={{uri: item.postImg}}
                style={{width: 100, aspectRatio: 0.8}}
              />
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
                    {formatDateString(item.create_at)}
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

  return (
    <SafeAreaViewCustom>
      <HistoryHeader />

      <HistoryTabs tabName={tabName} setTabName={setTabName} />
      {/* 플랫 리스트로 ㄱㄱ */}
      {/* 필터데이트 */}
      <FlatList
        data={data}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      />
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
});
