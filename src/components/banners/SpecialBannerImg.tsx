import {Image, View} from 'react-native';
import {SCREEN_WIDTH} from '../../configs/device';
import {ItemData} from './SpecialBanner';

interface ISpecailBannerImgs {
  item: ItemData;
  i: number;
  currentIndex: number;
  x: number;
}
function SpecialBannerImgs({item, i, currentIndex, x}: ISpecailBannerImgs) {
  let width = 0;
  const current = i === currentIndex;
  const next = i === currentIndex + 1;
  const prev = i === currentIndex - 1;
  if (current) {
    width = SCREEN_WIDTH - x;
  } else if (next) {
    width = x;
  } else if (prev) {
    width = x * -1;
  }
  return (
    <View
      key={i}
      style={{
        backgroundColor: 'black',
        zIndex: -i,
      }}>
      <Image
        resizeMode="cover"
        source={{uri: item.imgUrl}}
        style={{
          width,
          height: SCREEN_WIDTH * 1.405,
        }}
      />
    </View>
  );
}

export default SpecialBannerImgs;
