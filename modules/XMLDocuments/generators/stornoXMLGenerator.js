import {
  getCashboxFields,
  getCashierFields,
  getDateTimeFields,
  getDoctype,
  getDocumentNumberFields,
  getOfflineFields,
  getOrganizationFields,
  getTestingModeFields,
  getUIDFields,
  getVersionFields,
} from "./commonXMLTagGenerator.js";
import { DOC_SUBTYPE_STORNO, DOC_TYPE_PRODUCT } from "../const/fiscal.js";

const getStornoHeader = (operationData) => {
  const { cashboxData, dateTime } = operationData;

  return {
    ...getTypeFields(),
    ...getUIDFields(operationData),
    ...getOrganizationFields(cashboxData),
    ...getDateTimeFields(dateTime),
    ...getDocumentNumberFields(cashboxData),
    ...getCashboxFields(cashboxData),
    ...getStornoDocumentNumberField(operationData),
    ...getCashierFields(operationData),
    ...getVersionFields(),
    ...getOfflineFields({ operationData }),
    ...getTestingModeFields(cashboxData),
  };
};

const getTypeFields = () => getDoctype(DOC_TYPE_PRODUCT, DOC_SUBTYPE_STORNO);

const getStornoDocumentNumberField = (data) => {
  return {
    ORDERSTORNUM: data.fiscalIdForStorno,
  };
};

const getStornoDocument = (data) => {
  const CHECKHEAD = getStornoHeader(data);
  return {
    CHECK: {
      CHECKHEAD,
    },
  };
};

export default getStornoDocument;
