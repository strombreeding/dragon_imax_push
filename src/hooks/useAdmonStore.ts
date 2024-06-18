import {create} from 'zustand';

type AdmobStore = {
  visible: boolean;
  show: () => void;
  hide: () => void;
};

const useAdmobStore = create<AdmobStore>(set => ({
  visible: false,
  show: () => set({visible: true}),
  hide: () => set({visible: false}),
}));

export default useAdmobStore;
