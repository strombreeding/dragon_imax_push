import {create} from 'zustand';

type LoginStore = {
  login: boolean;
  setLogin: (state: boolean) => void;
};

const useLoginStore = create<LoginStore>(set => ({
  login: false,
  setLogin: state => set({login: state}),
}));

export default useLoginStore;
