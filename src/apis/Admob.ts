import axios from 'axios';
import {SERVER_URL} from '../configs/server';

export const rewardChur = async (deviceId: string): Promise<any> => {
  // 디바이스 Id로 로그인 시도
  console.log(SERVER_URL + `users/reward?deviceId=${deviceId}`);
  const res = await axios.get(SERVER_URL + `users/reward?deviceId=${deviceId}`);
  console.log(res);
  return res.data;
};
