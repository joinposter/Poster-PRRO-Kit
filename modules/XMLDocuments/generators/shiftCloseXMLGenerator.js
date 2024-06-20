import { DOC_TYPE_SHIFT_CLOSE } from "../const/fiscal.js";
import { getHeader, getDoctype } from "./commonXMLTagGenerator.js";

const getShiftCloseHeader = (orderData) =>
  getHeader(orderData, () => getDoctype(DOC_TYPE_SHIFT_CLOSE));

const getShiftCloseDocument = (data) => {
  const CHECKHEAD = getShiftCloseHeader(data);

  return {
    CHECK: {
      CHECKHEAD,
    },
  };
};

export default getShiftCloseDocument;
