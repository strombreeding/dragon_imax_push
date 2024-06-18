export const icon = {
  home_30px: require('../assets/ico/home_30px.png'),
  history_30px: require('../assets/ico/history_30px.png'),
  store_30px: require('../assets/ico/store_30px.png'),
  mypage_30px: require('../assets/ico/mypage_30px.png'),
  note_30px: require('../assets/ico/note_30px.png'),
  bell_26px: require('../assets/ico/bell_26px.png'),
  chur: require('../assets/ico/chur.png'),
  chur_2: require('../assets/ico/chur_2.png'),
  chur_5: require('../assets/ico/chur_5.png'),
  chur_7: require('../assets/ico/chur_7.png'),
  logo0: require('../assets/logo0.png'),
  logo1: require('../assets/logo1.png'),
  logo2: require('../assets/logo2.png'),
  logo3: require('../assets/logo3.png'),
};
export type IconType = keyof typeof icon;

interface IIcon {
  home_30px: string;
  history_30px: string;
  store_30px: string;
  mypage_30px: string;
  note_30px: string;
  bell_26px: string;
  chur: string;
  chur_2: string;
  chur_5: string;
  chur_7: string;
  logo0: string;
  logo1: string;
  logo2: string;
  logo3: string;
}
