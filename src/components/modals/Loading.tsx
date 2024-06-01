import {Pressable, StyleSheet, View} from 'react-native';
import useModalStore from '../../hooks/useModalStore';
import useLoadingStore from '../../hooks/useLoadingStore';
import LottieView from 'lottie-react-native';

function Loading() {
  const {visible, hideLoading} = useLoadingStore(state => state);

  if (!visible) return <></>;
  return (
    <Pressable style={[styles.modalBg]} onPress={() => hideLoading()}>
      <LottieView
        source={require('../../assets/lotties/loading_spinner.json')} // Lottie 파일의 경로
        autoPlay
        loop
        style={{width: 100, height: 100, borderColor: 'white'}}
      />
    </Pressable>
  );
}

export default Loading;

const styles = StyleSheet.create({
  modalBg: {
    backgroundColor: 'grey',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
