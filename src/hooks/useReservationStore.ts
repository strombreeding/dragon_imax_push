import {create} from 'zustand';

type ReservationStore = {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
};

const useReservationStore = create<ReservationStore>(set => ({
  currentIndex: 2,
  setCurrentIndex: index => set({currentIndex: index}),
}));

export default useReservationStore;
