import { DOC_TYPE_OFFLINE_MODE_START } from "../const/fiscal.js";
import {
  getCashboxFields,
  getCashierFields,
  getDateTimeFields,
  getDoctype,
  getDocumentNumberFields,
  getOfflineFields,
  getOrganizationFields,
  getUIDFields,
  getVersionFields,
} from "./commonXMLTagGenerator.js";

const getOfflineStartHeader = (operationData) => {
  const { cashboxData, dateTime } = operationData;

  return {
    ...getDoctype(DOC_TYPE_OFFLINE_MODE_START),
    ...getUIDFields(operationData),
    ...getOrganizationFields(cashboxData),
    ...getDateTimeFields(dateTime),
    ...getDocumentNumberFields(operationData),
    ...getCashboxFields(cashboxData),
    ...getCashierFields(),
    ...getVersionFields(),
    ...getOfflineFields({ operationData }),
  };
};

const getOfflineStartDocument = (data) => {
  const CHECKHEAD = getOfflineStartHeader(data);

  return {
    CHECK: {
      CHECKHEAD,
    },
  };
};

export default getOfflineStartDocument;
