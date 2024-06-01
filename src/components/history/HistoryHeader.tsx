import {Text, View} from 'react-native';

function HistoryHeader() {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 25,
      }}>
      <Text style={{color: 'white', fontSize: 25, fontWeight: '900'}}>
        추적내역
      </Text>
    </View>
  );
}

export default HistoryHeader;
