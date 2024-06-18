import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
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
import {IOS, SCREEN_WIDTH, deviceId} from '../../configs/device';
import EmptyBox from '../EmptyBox';
import {useNavigation} from '@react-navigation/native';
import Indicator from './Indicator';
import {addFrontAndBack} from '../../utils/formatList';
import axios from 'axios';
import {SERVER_URL} from '../../configs/server';
import {colors} from '../../styles/color';
import {conforms} from 'lodash';
import useModalStore from '../../hooks/useModalStore';
import useReservationStore from '../../hooks/useReservationStore';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootStackParamList} from '../../types/rootStackParam';
import {loginReq} from '../../apis/App';
import {sleep} from '../../utils/sleep';
import {postImgSize} from '../../styles/postImg';

export type ItemData = {
  postImg: string;
  cinemaType: string[];
  movieName: string;
  subscription?: string[];
};

// 1.405 * SCREEN_WIDTH => height
function SpecialBenner() {
  const {currentIndex, setCurrentIndex} = useReservationStore(state => state);
  const [dataList, setDataList] = useState([] as ItemData[]);
  const xRef = useRef(0);
  const flatRef = useRef<FlatList | null>(null);
  const navigation = useNavigation<any>();
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const setDatas = async () => {
    try {
      const movieData = await axios.get(
        SERVER_URL + 'movies?deviceId=' + deviceId,
      );
      console.log(movieData.data[0].info.length);
      if (movieData.data[0].info.length >= 3) {
        const newDatas = addFrontAndBack(movieData.data[0].info) as ItemData[];
        setDataList(newDatas);
        setCurrentIndex(2);
      } else {
        setDataList(movieData.data[0].info);
        setCurrentIndex(0);
      }
      setReady(true);
    } catch (err: any) {
      console.log(err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setDatas();
    DeviceEventEmitter.emit('AppInit');
    setRefreshing(false);
  };

  useEffect(() => {
    console.log('바뀐인덱스 : ', currentIndex);
    if (dataList.length < 3) {
      flatRef.current?.scrollToOffset({
        animated: false,
        offset: SCREEN_WIDTH * currentIndex,
      });
      return;
    }
    console.log('============');
    if (currentIndex <= 1) {
      flatRef.current?.scrollToOffset({
        animated: false,
        offset: SCREEN_WIDTH * (dataList.length - 3),
      });
      setCurrentIndex(dataList.length - 3);
    } else if (currentIndex >= dataList.length - 2) {
      flatRef.current?.scrollToOffset({
        animated: false,
        offset: SCREEN_WIDTH * 2,
      });
      setCurrentIndex(2);
    }

    const subScriptionListner = DeviceEventEmitter.addListener(
      'SubscriptionMovie',
      data => {
        handleRefresh();
      },
    );

    return () => subScriptionListner.remove();
  }, [currentIndex, dataList, ready]);
  useEffect(() => {
    setDatas();
  }, []);
  const renderItem = useCallback(
    ({item, index}: {item: ItemData; index: number}) => {
      const renderOnPress = () => {
        if (item.subscription != null && item.subscription.length === 2) {
          return;
        }
        navigation.navigate('Reservation', {
          cinemaTypes: item.cinemaType,
          movieName: item.movieName,
          postImg: item.postImg,
          subscription: item.subscription,
        });
      };
      // const scale = currentIndex === index ? 1.2 : 0.8;
      const marginHorizontal = (SCREEN_WIDTH - 230) / 2;
      return (
        <Pressable
          style={[styles.renderItemBtn, {marginHorizontal}]}
          onPress={renderOnPress}>
          <Image source={{uri: item.postImg}} style={postImgSize.nomal} />
        </Pressable>
      );
    },
    [],
  );

  const onContentSizeChange = (contentWidth: any, contentHeight: any) => {
    if (!ready) {
      flatRef.current?.scrollToOffset({
        animated: false,
        offset: SCREEN_WIDTH * currentIndex,
      });
    }
  };

  if (!ready || (!ready && dataList.length === 0) || dataList.length === 0)
    return <></>;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}>
      <FlatList
        onContentSizeChange={onContentSizeChange}
        ref={flatRef}
        horizontal
        data={dataList}
        keyExtractor={e => Math.random().toString()}
        scrollEventThrottle={16}
        pagingEnabled={true}
        initialScrollIndex={currentIndex}
        onScrollToIndexFailed={() => {
          console.log('흐하핫');
          flatRef.current?.scrollToOffset({
            animated: false,
            offset: SCREEN_WIDTH * currentIndex,
          });
        }}
        onScroll={e => {
          xRef.current = e.nativeEvent.contentOffset.x;
        }}
        onMomentumScrollEnd={e => {
          const x = Math.ceil(e.nativeEvent.contentOffset.x);
          const nextIndex = Math.ceil(x / SCREEN_WIDTH);
          // if (dataList.length < 3) return;
          console.log(nextIndex, '넥스트 인덱스');
          if (nextIndex <= dataList.length - 1) {
            setCurrentIndex(nextIndex);
          }
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <View>
            <Text style={{color: colors.Accent}}>
              상영중인 IMAX, 4DX영화가 없습니다!
            </Text>
          </View>
        )}
      />
      <Indicator index={currentIndex} arr={dataList} />
      <View style={{alignItems: 'center'}}>
        <EmptyBox height={30} />
        <EmptyBox height={30} />

        <EmptyBox height={15} />
        <View
          style={{
            bottom: 0,
            position: 'absolute',
            flexDirection: 'row',
            width: '50%',
          }}>
          {Object.keys(dataList[currentIndex]).includes('subscription') && (
            <Pressable
              onPress={() => navigation.navigate('내역')}
              style={{
                width: '100%',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>
                추적중
              </Text>
              <EmptyBox height={15} />
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                }}>
                {dataList[currentIndex].subscription!.sort().map((type, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      // setCinemaType(type);
                    }}
                    style={[
                      styles.activeContentBtn,
                      type === 'IMAX'
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
                ))}
              </View>
            </Pressable>
          )}
        </View>

        <EmptyBox height={30} />
      </View>
      <EmptyBox height={30} />
    </ScrollView>
  );
}

export default memo(SpecialBenner);

const styles = StyleSheet.create({
  imgMom: {
    flexDirection: 'row',
    position: 'absolute',
  },
  scrollView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  //
  goBackBtn: {
    position: 'absolute',
    paddingHorizontal: 15,
    zIndex: 1,
  },
  description: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cinemaTypeView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  unContentBtn: {
    padding: 20,
    width: SCREEN_WIDTH / 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 0.7,
  },
  activeContentBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    opacity: 1,
    borderColor: colors.Accent,
    flex: 1,
    padding: 5,
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
  renderItemBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -40,
  },
});
