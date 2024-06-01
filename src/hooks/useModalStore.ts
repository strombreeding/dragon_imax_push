import {create} from 'zustand';
import {deviceId} from '../configs/device';

type Data = {
  cinemaType: string[];
  deviceId: string;
  movieName: string;
  payChur: number;
  postImg: string;
};
type ModalStore = {
  visible: boolean;
  title: string;
  content: string;
  data: Data;
  showModal: () => void;
  hideModal: () => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setData: (data: Data) => void;
};

const useModalStore = create<ModalStore>(set => ({
  visible: false,
  title: '',
  content: '',
  data: {
    cinemaType: [],
    deviceId: '',
    movieName: '',
    payChur: 0,
    postImg: '',
  },
  showModal: () => set({visible: true}),
  hideModal: () => set({visible: false}),
  setTitle: title => set({title}),
  setContent: content => set({content}),
  setData: data => set({data: {...data}}),
}));

export default useModalStore;
