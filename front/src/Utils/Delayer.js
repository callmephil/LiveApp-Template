export const setSleepState = (ref, setLoading, milliseconds = 3000) => {
  setLoading(true);
  return new Promise(
    resolve => (ref.current = setTimeout(resolve, milliseconds))
  ).then(() => setLoading(false));
};

export const setCancelTimeout = ref => {
  if (ref.current) {
    clearTimeout(ref.current);
  }
};
