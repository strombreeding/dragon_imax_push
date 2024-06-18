import {SCREEN_WIDTH} from '../configs/device';

export const postImgSize = {
  nomal: {
    width: (230 / SCREEN_WIDTH) * SCREEN_WIDTH,
    height: (320 / SCREEN_WIDTH) * SCREEN_WIDTH,
  },
  small: {
    width: (((230 / SCREEN_WIDTH) * SCREEN_WIDTH) / 10) * 1.5,
    height: (((320 / SCREEN_WIDTH) * SCREEN_WIDTH) / 10) * 1.5,
  },
  middle: {
    width: ((230 / SCREEN_WIDTH) * SCREEN_WIDTH) / 2.5,
    height: ((320 / SCREEN_WIDTH) * SCREEN_WIDTH) / 2.5,
  },
};
