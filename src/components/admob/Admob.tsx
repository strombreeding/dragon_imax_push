import React, {useEffect, useState} from 'react';
import {Alert, Button, Platform} from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import useLoadingStore from '../../hooks/useLoadingStore';
import {rewardChur} from '../../apis/Admob';
import {deviceId} from '../../configs/device';
import useAdmobStore from '../../hooks/useAdmonStore';
import usePayModalStore from '../../hooks/usePayModalStore';
import PopupModal from '../modals/Popup';
import {icon} from '../../styles/icon';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-8533481920261273/6628830712';
// : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  keywords: ['fashion', 'clothing'],
});
RewardedAd;
function Admob() {
  const [loaded, setLoaded] = useState(false);
  const {showLoading, hideLoading} = useLoadingStore(state => state);
  const churStore = usePayModalStore(state => state);
  const hide = useAdmobStore(state => state.hide);
  useEffect(() => {
    console.log('## 리워드 보상 시작');
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      e => {
        console.log(e);
        setLoaded(true);
      },
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('## 리워드 보상 끝', reward);
        rewardChur(deviceId)
          .then(res => {
            churStore.setData({
              cnt: 1,
              price: 0,
              src: icon.logo1,
            });
            churStore.showModal();
          })
          .catch(err =>
            Alert.alert(
              '오류',
              '리워드가 정상지급되지 않는 것 같습니다.\n나중에 다시 시도해주세요.',
            ),
          );
        hideLoading();
        hide();
        console.log('User earned reward of ', reward);
      },
    );

    // Start loading the rewarded ad straight away
    rewarded.load();

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
    };
  }, []);

  // No advert ready to show yet
  if (!loaded) {
    return null;
  }
  rewarded.show();

  return <></>;
}

export default Admob;
