import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from './rootStackParam';

export type RouteProps<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;
