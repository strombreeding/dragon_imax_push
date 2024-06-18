import {Image, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../styles/color';
import {SCREEN_WIDTH} from '../../configs/device';
import {postImgSize} from '../../styles/postImg';

function TitleContent({
  movieName,
  cinemaType,
  date,
  postImg,
}: {
  movieName: string;
  cinemaType: string;
  date: string;
  postImg: string;
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      <View>
        <Image source={{uri: postImg}} style={postImgSize.middle} />
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          marginHorizontal: 5,
        }}>
        <View style={[styles.titleView, {backgroundColor: colors.Accent}]}>
          <Text style={styles.titleText}>{movieName}</Text>
        </View>
        <View
          style={[
            {
              backgroundColor: cinemaType === '4DX' ? colors.Grey : 'skyblue',
            },
            styles.titleView,
          ]}>
          <Text style={styles.titleText}>{cinemaType}</Text>
        </View>
        <View
          style={[
            {
              backgroundColor: colors.BgColor,
              borderWidth: 1,
              borderColor: colors.Grey,
            },
            styles.titleView,
          ]}>
          <Text style={styles.titleText}>{date}</Text>
        </View>
        {/* <View style={[styles.titleView, {backgroundColor: colors.Grey}]}>
          <Text style={styles.titleText}>{date}</Text>
        </View> */}
      </View>
    </View>
  );
}

export default TitleContent;

const styles = StyleSheet.create({
  titleView: {
    alignItems: 'center',
    borderRadius: 100,
    marginBottom: 3,
    justifyContent: 'center',
    flex: 1,
  },
  titleText: {fontSize: 18, fontWeight: '900'},
});
