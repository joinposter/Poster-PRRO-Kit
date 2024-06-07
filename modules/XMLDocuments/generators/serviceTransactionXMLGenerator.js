import {
  DOC_SUBTYPE_SERVICE_DELIVERY,
  DOC_SUBTYPE_SERVICE_ENTRY,
  DOC_TYPE_PRODUCT,
} from "../const/fiscal.js";
import { DOCUMENT_TYPE_SERVICE_ENTRY } from "../const/request.js";
import { formatToFixedDecimal } from "../../../helpers/round.js";
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

const isServiceEntry = (data) => data.type === DOCUMENT_TYPE_SERVICE_ENTRY;

const getServiceTransactionHeader = (operationData) => {
  const { cashboxData, dateTime } = operationData;
  const operationSum = getServiceTransactionTotal(operationData).SUM;

  return {
    ...getTypeFields(operationData),
    ...getUIDFields(operationData),
    ...getOrganizationFields(cashboxData),
    ...getDateTimeFields(dateTime),
    ...getDocumentNumberFields(operationData),
    ...getCashboxFields(cashboxData),
    ...getCashierFields(operationData),
    ...getVersionFields(),
    ...getOfflineFields({ operationData, operationSum }),
    ...getTestingModeFields(),
  };
};

const getTypeFields = (data) =>
  getDoctype(
    DOC_TYPE_PRODUCT,
    isServiceEntry(data)
      ? DOC_SUBTYPE_SERVICE_ENTRY
      : DOC_SUBTYPE_SERVICE_DELIVERY,
  );

const getServiceTransactionTotal = (data) => {
  return { SUM: formatToFixedDecimal(data.sum) };
};

const getServiceTransactionDocument = (data) => {
  const CHECKHEAD = getServiceTransactionHeader(data);
  const CHECKTOTAL = getServiceTransactionTotal(data);

  return {
    CHECK: {
      CHECKHEAD,
      CHECKTOTAL,
    },
  };
};

export default getServiceTransactionDocument;
