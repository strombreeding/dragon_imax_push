import {StyleSheet, View} from 'react-native';
import {colors} from '../../styles/color';
import {ItemData} from './SpecialBanner';

function Indicator({arr, index}: {arr: ItemData[]; index: number}) {
  const removeIndexList = [0, 1, arr.length - 1, arr.length - 2];
  const itemList = arr.filter(
    (item, index) => !removeIndexList.includes(index),
  );
  const Dots = ({i, index}: {i: number; index: number}) => {
    return (
      <View style={[index - 2 === i ? styles.activeDot : styles.unDot]}></View>
    );
  };
  return (
    <View style={styles.dotView}>
      {itemList.map((x, i) => (
        <Dots key={i} i={i} index={index} />
      ))}
    </View>
  );
}

export default Indicator;

const styles = StyleSheet.create({
  activeDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.Accent,
    borderRadius: 100,
    marginHorizontal: 3,
  },
  unDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.Grey,
    borderRadius: 100,
    marginHorizontal: 3,
  },
  dotView: {
    flexDirection: 'row',
  },
});
