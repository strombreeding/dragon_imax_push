import {useNavigation, useRoute} from '@react-navigation/native';
import SafeAreaViewCustom from '../components/SafeAreaViewCustom';
import HistoryHeader from '../components/history/HistoryHeader';
import {NavigationProps, RouteProps} from '../types/navigationProps';
import {
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EmptyBox from '../components/EmptyBox';
import {colors} from '../styles/color';
import {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {SERVER_URL} from '../configs/server';
import TitleContent from '../components/historyDetail/TitleContent';
import {SCREEN_WIDTH} from '../configs/device';
import {formatDateString} from '../utils/formatDateRange';
import PrevNextBtn from '../components/buttons/PrevNextBtn';

interface IHistoryDetailProps {
  date: string;
  _id: string;
  schedule: string;
  movieName: string;
  createAt: string;
  cinemaType: string;
  table: string[];
  postImg: string;
}
function HistoryDetail() {
  const [data, setData] = useState<IHistoryDetailProps>(
    {} as IHistoryDetailProps,
  );
  const {_id} = useRoute<RouteProps<'HistoryDetail'>>().params;
  const [ready, setReady] = useState(false);
  const [id, setId] = useState('');
  const flatRef = useRef<null | FlatList>(null);
  const navigation = useNavigation<NavigationProps<'HistoryDetail'>>();

  const req = async () => {
    const res = await axios.get(SERVER_URL + 'notifications?' + `_id=${_id}`);
    const resData: IHistoryDetailProps = res.data;
    resData.schedule = resData.schedule.replaceAll('잔여좌석', '');
    resData.schedule = resData.schedule.replaceAll('석', '');
    resData.table = resData.schedule.split('\n');
    setData(resData);
    setReady(true);
  };
  useEffect(() => {
    console.log('할로바디', _id);
    req();
  }, []);
  useEffect(() => {}, []);

  //http://www.cgv.co.kr/theaters/?areacode=01&theaterCode=0013&date=${date}

  if (!ready) return <></>;
  return (
    <SafeAreaViewCustom>
      <HistoryHeader />
      <EmptyBox height={15} />
      {/* 타이틀 */}
      <TitleContent
        cinemaType={data.cinemaType}
        movieName={data.movieName}
        date={data.date}
        postImg={data.postImg}
      />
      {/* 아이템들  */}
      <View style={{alignItems: 'center', width: '100%'}}>
        <Text style={[{color: colors.White, fontSize: 25, fontWeight: '800'}]}>
          상영표
        </Text>
        <Text style={[{color: colors.Grey, fontSize: 15, fontWeight: '800'}]}>
          ( {formatDateString(data.createAt, true)} 수집 기준 )
        </Text>

        <FlatList
          numColumns={4}
          contentContainerStyle={{flex: 1}}
          keyExtractor={(item, index) => index.toString()}
          data={data.table}
          renderItem={({item, index}) => {
            if (item === '') return <></>;
            const splitItem = item.split(' ');
            return (
              <View
                style={{
                  margin: 10,
                  alignItems: 'center',
                  width: SCREEN_WIDTH / 6,
                }}>
                <Text
                  style={{
                    color: colors.White,
                    fontSize: 16,
                    fontWeight: '900',
                  }}>
                  {splitItem[0]}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: colors.Accent,
                      fontSize: 14,
                      fontWeight: '700',
                    }}>
                    {splitItem[1]}
                  </Text>
                  <Text
                    style={{
                      color: colors.White,
                      fontSize: 14,
                      fontWeight: '700',
                    }}>
                    /
                  </Text>
                  <Text
                    style={{
                      color: colors.White,
                      fontSize: 14,
                      fontWeight: '700',
                    }}>
                    {data.cinemaType === '4DX' ? 144 : 624}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>

      <PrevNextBtn
        condition={true}
        leftText="이전"
        rightAction={async () => {
          const res = await Linking.canOpenURL(
            'package:com.cgv.android.movieapp',
          );
          try {
            Linking.openURL(
              `https://m.cgv.co.kr/WebApp/Reservation/schedule.aspx?tc=0013&rc=01&ymd=${data.date}&fst=&fet=&fsrc=`,
            );
          } catch (err) {
            console.log(err);
          }
        }}
        rightText="CGV가기"
      />
    </SafeAreaViewCustom>
  );
}

export default HistoryDetail;

const styles = StyleSheet.create({
  titleView: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    borderRadius: 100,
    marginBottom: 3,
  },
  titleText: {fontSize: 18, fontWeight: '900'},
});
