import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import History from './History';
import Mypage from './Mypage';
import Store from './Store';
import {Image} from 'react-native';
import {IOS} from '../configs/device';
import {IconType, icon} from '../styles/icon';
import {colors} from '../styles/color';

const Tab = createBottomTabNavigator();
function BottomTab() {
  return (
    <Tab.Navigator screenOptions={navScreenOptions}>
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={screenOptions('home_30px')}
      />
      <Tab.Screen
        name="내역"
        component={History}
        options={screenOptions('history_30px')}
      />
      {/* <Tab.Screen
        name="상점"
        component={Store}
        options={screenOptions('store_30px')}
      /> */}
      <Tab.Screen
        name="마이"
        component={Mypage}
        options={screenOptions('mypage_30px')}
      />
    </Tab.Navigator>
  );
}

export default BottomTab;

const navScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: {
    backgroundColor: '#000000',
    borderTopColor: '#7d7d7d',
    borderTopWidth: 0.5,
    paddingTop: 20,
    paddingBottom: 30,
    height: 100,
    marginBottom: IOS ? -10 : -30,
    justifyContent: 'center',
    alignItems: 'center',
  }, // 탭의 배경색 변경
  tabBarActiveTintColor: colors.Accent, // 활성 상태의 탭 텍스트 색상 변경
  tabBarInactiveTintColor: 'white', // 비활성 상태의 탭 텍스트 색상 변경
  tabBarLabelStyle: {fontSize: 16, fontWeight: 'bold', marginBottom: 10}, // 탭 텍스트 스타일 변경
};

//BottomTabNavigationOptions
const screenOptions = (name: IconType): BottomTabNavigationOptions => {
  return {
    tabBarIcon: ({focused}) => {
      return (
        <Image
          tintColor={focused ? colors.Accent : colors.White}
          source={icon[name]}
          style={{width: 30, height: 30, marginBottom: 10}}
        />
      );
    },
  };
};
