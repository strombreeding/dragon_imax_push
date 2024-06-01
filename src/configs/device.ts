import {Dimensions, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const IOS = Platform.OS === 'ios' ? true : false;

// export const SCREEN_WIDTH = 185;
export const SCREEN_WIDTH = Math.ceil(Dimensions.get('screen').width);
export const SCREEN_HEIGHT = Math.ceil(Dimensions.get('screen').height);

export const deviceId = DeviceInfo.getUniqueIdSync();
