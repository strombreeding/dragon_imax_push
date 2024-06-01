import {Text, View} from 'react-native';

function MypageHeader() {
  return (
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text style={{color: 'white', backgroundColor: 'blue'}}>마이페이지</Text>
      <Text style={{color: 'white', backgroundColor: 'blue'}}>토큰</Text>
    </View>
  );
}

export default MypageHeader;
