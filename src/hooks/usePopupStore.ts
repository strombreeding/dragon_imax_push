import {create} from 'zustand';
import {IPopupModalProps} from '../types/App';

type ModalStore = {
  visible: boolean;
  data: IPopupModalProps;
  showModal: () => void;
  hideModal: () => void;
  setPopupData: (data?: IPopupModalProps) => void;
};

const usePopupStore = create<ModalStore>(set => ({
  visible: false,
  data: {
    content: '',
    leftText: '',
    rightAction: () => {},
    rightText: '',
    title: '',
  },
  showModal: () => set({visible: true}),
  hideModal: () => set({visible: false}),
  setPopupData: data => set({data}),
}));

export default usePopupStore;
