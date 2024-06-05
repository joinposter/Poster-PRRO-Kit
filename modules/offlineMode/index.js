import {
  DOCUMENT_TYPE_OFFLINE_FINISH,
  DOCUMENT_TYPE_OFFLINE_START,
  DOCUMENT_TYPE_RECEIPT,
  DOCUMENT_TYPE_RETURN_RECEIPT,
  DOCUMENT_TYPE_SERVICE_DELIVERY,
  DOCUMENT_TYPE_SERVICE_ENTRY,
  DOCUMENT_TYPE_SHIFT_CLOSE,
  DOCUMENT_TYPE_SHIFT_OPEN,
  DOCUMENT_TYPE_Z_REPORT,
} from "./const/types.js";
import { getTaxesData } from "../taxes/index.js";
import { getDocument, getDocumentHash } from "../XMLDocuments/index.js";
import { expandDocumentData } from "./helpers/offline.js";
import { createXZReportData } from "./helpers/XZReportData.js";

const generateOfflineReceiptDocument = (data) => {
  if (
    data?.type !== DOCUMENT_TYPE_RECEIPT &&
    data?.type !== DOCUMENT_TYPE_RETURN_RECEIPT
  )
    return "Invalid data type";

  const taxes = getTaxesData(data?.taxesConfig)(data?.products);
  const XML = getDocument({ ...expandDocumentData(data), taxes });
  const documentHash = getDocumentHash(XML);
  const fiscalId = XML?.CHECK?.CHECKHEAD?.ORDERTAXNUM;
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    type: data?.type,
    fiscalId,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    cashboxData: data?.cashboxData,
    total: data?.total,
    payments: data?.payments,
    products: data?.products,
    taxes,
    documentHash,
  };
};
const generateOfflineTransactionDocument = (data) => {
  if (
    data?.type !== DOCUMENT_TYPE_SERVICE_ENTRY &&
    data?.type !== DOCUMENT_TYPE_SERVICE_DELIVERY
  )
    return "Invalid data type";

  const XML = getDocument(expandDocumentData(data));
  const documentHash = getDocumentHash(XML);
  const fiscalId = XML?.CHECK?.CHECKHEAD?.ORDERTAXNUM;
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    type: data?.type,
    fiscalId,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    cashboxData: data?.cashboxData,
    sum: data?.sum,
    documentHash,
  };
};

const generateOfflineOpenShiftDocument = (data) => {
  if (data?.type !== DOCUMENT_TYPE_SHIFT_OPEN) return "Invalid data type";

  const XML = getDocument(expandDocumentData(data));
  const documentHash = getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    type: data?.type,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    cashboxData: data?.cashboxData,
    documentHash,
  };
};

const generateOfflineCloseShiftDocument = (data) => {
  if (data?.type !== DOCUMENT_TYPE_SHIFT_CLOSE) return "Invalid data type";

  const XML = getDocument(expandDocumentData(data));
  const documentHash = getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    type: data?.type,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    cashboxData: data?.cashboxData,
    documentHash,
  };
};

const generateOfflineZReportDocument = (data) => {
  if (data?.type !== DOCUMENT_TYPE_Z_REPORT) return "Invalid data type";

  const XML = getDocument({ ...createXZReportData(expandDocumentData(data)) });
  const documentHash = getDocumentHash(XML);
  const fiscalId = XML?.ZREP?.ZREPHEAD?.ORDERTAXNUM;
  return {
    ...createXZReportData(expandDocumentData(data)),
    fiscalId,
    documentHash,
  };
};

const generateOfflineStartDocument = (data) => {
  if (data?.type !== DOCUMENT_TYPE_OFFLINE_START) return "Invalid data type";

  const XML = getDocument(expandDocumentData(data));
  const documentHash = getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    type: data?.type,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    cashboxData: data?.cashboxData,
    documentHash,
  };
};

const generateOfflineFinishDocument = (data) => {
  if (data?.type !== DOCUMENT_TYPE_OFFLINE_FINISH) return "Invalid data type";

  const XML = getDocument(expandDocumentData(data));
  const documentHash = getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    type: data?.type,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    cashboxData: data?.cashboxData,
    documentHash,
  };
};

export {
  generateOfflineReceiptDocument,
  generateOfflineTransactionDocument,
  generateOfflineOpenShiftDocument,
  generateOfflineCloseShiftDocument,
  generateOfflineZReportDocument,
  generateOfflineStartDocument,
  generateOfflineFinishDocument,
};
