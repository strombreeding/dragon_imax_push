import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SafeAreaViewCustom from '../components/SafeAreaViewCustom';
import StoreHeader from '../components/store/StoreHeader';
import {icon} from '../styles/icon';
import {SCREEN_WIDTH} from '../configs/device';
import EmptyBox from '../components/EmptyBox';
import {colors} from '../styles/color';
import useUserStateStore from '../hooks/useUserStateStore';
import {Fragment} from 'react';
import usePayModalStore from '../hooks/usePayModalStore';
import useLoadingStore from '../hooks/useLoadingStore';

function Store() {
  const chur = useUserStateStore(state => state.chur);
  const {hideModal, showModal, setData} = usePayModalStore(state => state);
  const {hideLoading, showLoading, visible} = useLoadingStore(state => state);
  const churImgList = [
    {src: icon.chur, cnt: 1, price: 100},
    {src: icon.chur_2, cnt: 2, price: 200},
    {src: icon.chur_5, cnt: 5, price: 450},
    {src: icon.chur_7, cnt: 7, price: 600},
  ];
  // 에미터로 메인스택 유저정보 업뎃해줭야함.

  return (
    <SafeAreaViewCustom>
      <StoreHeader />
      <EmptyBox height={30} />
      <View
        style={{
          flexDirection: 'row',
          marginLeft: 10,
        }}>
        <Text style={{fontSize: 15, fontWeight: '800', color: 'white'}}>
          보유 :
        </Text>
        <Image source={icon.chur} style={{width: 25, height: 30}} />
        <Text style={{fontSize: 15, fontWeight: '800', color: 'white'}}>
          {chur}
        </Text>
      </View>
      <EmptyBox height={15} />

      <ScrollView
        contentContainerStyle={{justifyContent: 'space-between', flex: 1}}>
        <View style={{width: SCREEN_WIDTH, paddingHorizontal: 15}}>
          {churImgList.map((item, i) => {
            return (
              <Fragment key={i}>
                <Pressable
                  onPress={() => {
                    console.log('gd');
                    // setData(item);
                    // showModal();
                  }}
                  style={styles.itemView}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image source={item.src} style={{width: 50, height: 60}} />
                    <Text
                      style={{fontSize: 16, fontWeight: '900', color: 'white'}}>
                      {item.cnt}개
                    </Text>
                  </View>

                  <View style={{marginRight: 15}}>
                    <Text
                      style={{fontSize: 16, fontWeight: '900', color: 'white'}}>
                      {item.price}원
                    </Text>
                  </View>
                  <Pressable
                    style={{
                      marginRight: 15,
                      padding: 10,
                      borderColor: colors.Accent,
                      borderWidth: 2,
                      borderRadius: 15,
                    }}
                    onPress={() => {
                      showLoading();
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '900',
                        color: colors.Accent,
                      }}>
                      구매
                    </Text>
                  </Pressable>
                </Pressable>
                <EmptyBox height={10} />
              </Fragment>
            );
          })}
        </View>

        <Pressable
          style={{
            backgroundColor: colors.Accent,
            padding: 30,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 30,
            marginTop: 30,
          }}>
          <Text style={{color: 'white', fontSize: 25, fontWeight: '600'}}>
            무료 츄르 뽑기!
          </Text>
        </Pressable>
      </ScrollView>
      <EmptyBox height={50} />
    </SafeAreaViewCustom>
  );
}

export default Store;

const styles = StyleSheet.create({
  itemView: {
    backgroundColor: '#7d7777be',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
