import { DOC_TYPE_OFFLINE_MODE_FINISH } from "../const/fiscal.js";
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

const getOfflineFinishHeader = async (operationData) => {
  const { cashboxData, dateTime } = operationData;

  return {
    ...getDoctype(DOC_TYPE_OFFLINE_MODE_FINISH),
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

const getOfflineFinishDocument = async (data) => {
  const CHECKHEAD = await getOfflineFinishHeader(data);

  return {
    CHECK: {
      CHECKHEAD,
    },
  };
};

export default getOfflineFinishDocument;
