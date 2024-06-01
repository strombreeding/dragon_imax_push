import {Pressable, StyleSheet} from 'react-native';
import useModalStore from '../../hooks/useModalStore';

function ModalBackground() {
  const {visible, hideModal} = useModalStore(state => state);

  if (!visible) return <></>;
  return <Pressable style={[styles.modalBg]} onPress={() => hideModal()} />;
}

export default ModalBackground;

const styles = StyleSheet.create({
  modalBg: {
    backgroundColor: 'black',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
    zIndex: 100,
  },
});
