import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from './rootStackParam';

export type ScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
