import {create} from 'zustand';

type LoadingStore = {
  visible: boolean;
  showLoading: () => void;
  hideLoading: () => void;
};

const useLoadingStore = create<LoadingStore>(set => ({
  visible: false,
  showLoading: () => set({visible: true}),
  hideLoading: () => set({visible: false}),
}));

export default useLoadingStore;
