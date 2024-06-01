import {memo} from 'react';
import {StyleSheet, View} from 'react-native';
interface IEmptyBoxProps {
  width?: number;
  height?: number;
}

function EmptyBox({width, height}: IEmptyBoxProps) {
  const dynamicStyle = {
    width: width || 0,
    height: height || 0,
  };
  return <View style={[dynamicStyle]} />;
}

export default memo(EmptyBox);
