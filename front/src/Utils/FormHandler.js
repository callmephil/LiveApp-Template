import ReactDOM from "react-dom";
import { isEqual } from "lodash";

export const setFormDefaultValue = (ref, obj) => {
  // if (ref && !ref.current) return;
  if ((ref && !ref.current) || !obj || !(obj instanceof Object)) return;

  const nodes = [
    // @ts-ignore
    ...ReactDOM.findDOMNode(ref.current).getElementsByClassName("form-control")
  ];


  if (nodes.length > 0) {
    nodes.forEach(node => {
      if (node.name in obj) node.value = obj[node.name];
      else console.error(`Object value for ${node.name} is missing...`);
    });
  }
};

// this is for Activating / Desactivating Buttons
export const compareFormdata = (prevData, currData) => {
  // Implement empty value as well...
  return isEqual(prevData, currData);
};


export const formValidation = () => {
  return true;
}