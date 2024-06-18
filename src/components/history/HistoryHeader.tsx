import {AppState, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {icon} from '../../styles/icon';
import {colors} from '../../styles/color';
import {IAlarmProps} from '../../types/History';
import {useEffect, useState} from 'react';

function HistoryHeader({
  alarmData,
  text,
  handlePress,
}: {
  handlePress?: () => void;
  alarmData?: IAlarmProps[];
  text?: string;
}) {
  const [redDotVisible, setRedDotVisible] = useState(false);
  useEffect(() => {
    if (alarmData == null) {
      return;
    }
    if (alarmData.find(item => item.checkout === false)) {
      setRedDotVisible(true);
    } else {
      setRedDotVisible(false);
    }
  }, [alarmData]);

  return (
    <View style={styles.momView}>
      <View style={{padding: 10}}>
        <Text style={{color: 'white', fontSize: 25, fontWeight: '900'}}>
          {text == null ? '추적내역' : text}
        </Text>
      </View>
      <Pressable
        style={{
          padding: 10,
          width: 100,
          alignItems: 'flex-end',
        }}
        onPress={handlePress}>
        {alarmData != null && (
          <View>
            <Image
              source={icon.bell_26px}
              style={{
                width: 26,
                height: 26,
                tintColor: colors.White,
                marginRight: 10,
              }}
            />
            {redDotVisible && (
              <View
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 100,
                  backgroundColor: colors.Accent,
                  position: 'absolute',
                  right: 5,
                }}
              />
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
}

export default HistoryHeader;

const styles = StyleSheet.create({
  momView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 25,
  },
});
