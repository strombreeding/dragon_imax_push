import {Text, View} from 'react-native';

function StoreHeader() {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 25,
      }}>
      <Text style={{color: 'white', fontSize: 25, fontWeight: '900'}}>
        상점
      </Text>
    </View>
  );
}

export default StoreHeader;
