import ReactDOM from "react-dom";
import { isEqual } from "lodash";

export const setFormDefaultValue = (obj, ref) => {
  if (ref && !ref.current) return;

  if (!obj || !obj instanceof Object) return;

  const _this = [
    ...ReactDOM.findDOMNode(ref.current).getElementsByClassName("form-control")
  ];

  if (_this.length > 0) {
    _this.forEach(el => {
      if (el.name in obj) el.value = obj[el.name];
      else console.error(`Object value for ${el.name} is missing...`);
    });
  }
};

// this is for Activating / Desactivating Buttons
export const compareFormdata = (prevData, currData) => {
  // Implement empty value as well...
  return isEqual(prevData, currData);
};
