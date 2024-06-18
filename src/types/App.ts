export interface ILoginResult {
  result: boolean;
  user: {
    _id: string;
    deviceId: string;
    chur: number;
    create_at: string;
    fcmToken: string;
  };
}
export interface IPopupModalProps {
  title: string;
  content: string;
  leftText: string;
  rightText: string;
  rightAction: (something?: any) => any;
  data?: any;
}
