import { DOC_TYPE_SHIFT_OPEN } from "../const/fiscal.js";
import { getDoctype, getHeader } from "./commonXMLTagGenerator.js";

const getShiftOpenHeader = (orderData) =>
  getHeader(orderData, () => getDoctype(DOC_TYPE_SHIFT_OPEN));

const getShiftOpenDocument = (data) => {
  const CHECKHEAD = getShiftOpenHeader(data);

  return {
    CHECK: {
      CHECKHEAD,
    },
  };
};

// eslint-disable-next-line import/prefer-default-export
export { getShiftOpenDocument };
