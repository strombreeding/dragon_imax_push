import {Image, View} from 'react-native';
import {icon} from '../styles/icon';
import SafeAreaViewCustom from './SafeAreaViewCustom';

function FixedState() {
  return (
    <View
      style={{
        position: 'absolute',
        right: 25,
        width: 20,
        aspectRatio: 1,
        backgroundColor: 'red',
        zIndex: 1000,
      }}>
      <Image
        source={icon.history_30px}
        style={{width: 1, aspectRatio: 1, tintColor: 'white'}}
      />
    </View>
  );
}

export default FixedState;
