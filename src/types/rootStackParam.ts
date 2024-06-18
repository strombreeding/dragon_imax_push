export type RootStackParamList = {
  Intro: undefined;
  HomeScreen: undefined;
  BottomStack: undefined;
  Reservation: {
    movieName: string;
    cinemaTypes: string[];
    postImg: string;
    subscription?: string[];
  };
  HistoryDetail: {
    _id: string;
  };
};
