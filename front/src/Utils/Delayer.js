import { debounce } from "lodash";

export const debounceEvent = (ref, _fn, timer = 250, options = null) => {
  ref.current = debounce(_fn, timer, options);
  return e => {
    e.persist();
    return ref.current(e);
  };
};

export const setSleepState = (ref, setLoading, milliseconds = 1000) => {
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
