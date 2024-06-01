import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from './rootStackParam';
import {NavigationProp, RouteProp} from '@react-navigation/native';

export type NavigationProps<T extends keyof RootStackParamList> =
  NavigationProp<RootStackParamList, T>;

export type RouteProps<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
