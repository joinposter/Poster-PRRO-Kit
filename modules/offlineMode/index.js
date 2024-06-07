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

const generateOfflineReceiptDocument = async (data) => {
  if (
    data?.type !== DOCUMENT_TYPE_RECEIPT &&
    data?.type !== DOCUMENT_TYPE_RETURN_RECEIPT
  )
    return "Invalid data type";
  const { taxesConfig, ...rest } = data;
  const taxes = getTaxesData(taxesConfig)(rest?.products);
  const XML = getDocument({
    ...expandDocumentData({ ...rest, isCashboxModeOffline: true }),
    taxes,
  });
  const documentHash = await getDocumentHash(XML);
  const fiscalId = XML?.CHECK?.CHECKHEAD?.ORDERTAXNUM;
  const uid = XML?.CHECK?.CHECKHEAD?.UID;

  return {
    fiscalId,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    taxes,
    documentHash,
    isCashboxModeOffline: true,
    ...rest,
  };
};
const generateOfflineTransactionDocument = async (data) => {
  if (
    data?.type !== DOCUMENT_TYPE_SERVICE_ENTRY &&
    data?.type !== DOCUMENT_TYPE_SERVICE_DELIVERY
  )
    return "Invalid data type";

  const XML = getDocument(
    expandDocumentData({ ...data, isCashboxModeOffline: true }),
  );
  const documentHash = await getDocumentHash(XML);
  const fiscalId = XML?.CHECK?.CHECKHEAD?.ORDERTAXNUM;
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    ...data,
    fiscalId,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    documentHash,
    isCashboxModeOffline: true,
  };
};

const generateOfflineOpenShiftDocument = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_SHIFT_OPEN) return "Invalid data type";

  const XML = getDocument(
    expandDocumentData({ ...data, isCashboxModeOffline: true }),
  );
  const documentHash = await getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    ...data,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    documentHash,
    isCashboxModeOffline: true,
  };
};

const generateOfflineCloseShiftDocument = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_SHIFT_CLOSE) return "Invalid data type";

  const XML = getDocument(
    expandDocumentData({ ...data, isCashboxModeOffline: true }),
  );
  const documentHash = await getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    ...data,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    cashboxData: data?.cashboxData,
    documentHash,
    isCashboxModeOffline: true,
  };
};

const generateOfflineZReportDocument = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_Z_REPORT) return "Invalid data type";

  const XML = getDocument({
    ...createXZReportData(
      expandDocumentData({ ...data, isCashboxModeOffline: true }),
    ),
  });
  const documentHash = await getDocumentHash(XML);
  const fiscalId = XML?.ZREP?.ZREPHEAD?.ORDERTAXNUM;
  return {
    ...createXZReportData(expandDocumentData(data)),
    fiscalId,
    documentHash,
    isCashboxModeOffline: true,
  };
};

const generateOfflineStartDocument = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_OFFLINE_START) return "Invalid data type";

  const XML = getDocument(
    expandDocumentData({ ...data, isCashboxModeOffline: true }),
  );
  const documentHash = await getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    ...data,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    documentHash,
    isCashboxModeOffline: true,
  };
};

const generateOfflineFinishDocument = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_OFFLINE_FINISH) return "Invalid data type";

  const XML = getDocument(
    expandDocumentData({ ...data, isCashboxModeOffline: true }),
  );
  const documentHash = await getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    ...data,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    cashboxData: data?.cashboxData,
    documentHash,
    isCashboxModeOffline: true,
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
