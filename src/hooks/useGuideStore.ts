import {create} from 'zustand';

type ModalStore = {
  visible: boolean;
  showModal: () => void;
  hideModal: () => void;
};

const useGuideStore = create<ModalStore>(set => ({
  visible: false,
  showModal: () => set({visible: true}),
  hideModal: () => set({visible: false}),
}));

export default useGuideStore;
