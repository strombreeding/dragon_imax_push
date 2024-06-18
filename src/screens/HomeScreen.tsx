import SafeAreaViewCustom from '../components/SafeAreaViewCustom';
import SpecialBanner from '../components/banners/SpecialBanner';
import Header from '../components/home/HomeHeader';
import EmptyBox from '../components/EmptyBox';
import PrevNextBtn from '../components/buttons/PrevNextBtn';
import {Linking} from 'react-native';

function HomeScreen() {
  return (
    <SafeAreaViewCustom>
      <Header />

      <SpecialBanner />

      <EmptyBox height={30} />
    </SafeAreaViewCustom>
  );
}

export default HomeScreen;
