import {RefreshControl, ScrollView, Text, View} from 'react-native';
import SafeAreaViewCustom from '../components/SafeAreaViewCustom';
import {ScreenProps} from '../types/screenProps';
import SpecialBanner from '../components/banners/SpecialBanner';
import Header from '../components/home/HomeHeader';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../types/rootStackParam';
import {NavigationProps} from '../types/navigationProps';
import {useEffect, useState} from 'react';
import EmptyBox from '../components/EmptyBox';
import axios from 'axios';

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
