import {create} from 'zustand';

type Data = {
  src: any;
  cnt: number;
  price: number;
};
type ModalStore = {
  visible: boolean;
  data: Data;
  setData: (data: Data) => void;
  showModal: () => void;
  hideModal: () => void;
};

const usePayModalStore = create<ModalStore>(set => ({
  visible: false,
  data: {cnt: 0, price: 0, src: ''},
  setData: data => set({data}),
  showModal: () => set({visible: true}),
  hideModal: () => set({visible: false}),
}));

export default usePayModalStore;
