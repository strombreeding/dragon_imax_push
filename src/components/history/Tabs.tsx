import {Dispatch, SetStateAction, memo} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../styles/color';

const tabTypes = ['추적중', '추적완료'];

function HistoryTabs({
  tabName,
  setTabName,
}: {
  tabName: string;
  setTabName: Dispatch<SetStateAction<string>>;
}) {
  const onPress = (name: string) => () => {
    setTabName(name);
  };

  return (
    <View style={[styles.mainView]}>
      {tabTypes.map(name => (
        <Pressable
          key={name}
          onPress={onPress(name)}
          style={[styles.tabBtn, tabName === name ? styles.activeBtn : {}]}>
          <Text
            style={[
              styles.tabText,
              {color: tabName === name ? colors.Accent : colors.White},
            ]}>
            {name}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default memo(HistoryTabs);

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  tabBtn: {
    flex: 1,

    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 15,
  },
  tabText: {
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
  },
  activeBtn: {
    borderBottomWidth: 1,
    borderColor: colors.Accent,
  },
});
