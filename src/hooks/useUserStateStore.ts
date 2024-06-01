import {create} from 'zustand';

type UserStore = {
  chur: number;
  setChur: (chur: number) => void;
};

const useUserStateStore = create<UserStore>(set => ({
  chur: 0,
  setChur: chur => set({chur}),
}));

export default useUserStateStore;
