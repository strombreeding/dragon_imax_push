export const sleep = (ms?: number): Promise<void> => {
  if (ms == null) {
    ms = 1000;
  }
  return new Promise(resolve => setTimeout(resolve, ms));
};
