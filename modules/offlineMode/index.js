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
import {
  createXZReportData,
  inpitOutputServiceFieldAcc,
  realizReturnFieldAcc,
} from "./helpers/XZReportData.js";

const generateOfflineReceiptDocument = async (data) => {
  if (
    data?.type !== DOCUMENT_TYPE_RECEIPT &&
    data?.type !== DOCUMENT_TYPE_RETURN_RECEIPT
  ) {
    return "Invalid data type";
  }

  const { taxesConfig, cashboxData, ...rest } = data;
  const taxes = getTaxesData(taxesConfig)(rest?.products);
  const XML = getDocument({
    ...expandDocumentData({
      ...rest,
      cashboxData: {
        ...cashboxData,
        isOffline: true,
      },
    }),
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
    cashboxData: {
      ...cashboxData,
      isOffline: true,
    },
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
    expandDocumentData({
      ...data,
      cashboxData: { ...data.cashboxData, isOffline: true },
    }),
  );
  const documentHash = await getDocumentHash(XML);
  const fiscalId = XML?.CHECK?.CHECKHEAD?.ORDERTAXNUM;
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
    fiscalId,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    documentHash,
  };
};

const generateOfflineOpenShiftDocument = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_SHIFT_OPEN) return "Invalid data type";

  const XML = getDocument(
    expandDocumentData({
      ...data,
      cashboxData: { ...data.cashboxData, isOffline: true },
    }),
  );
  const documentHash = await getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
    uid,
    dateTime: expandDocumentData(data).dateTime,
    documentHash,
  };
};

const generateOfflineCloseShiftDocument = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_SHIFT_CLOSE) return "Invalid data type";

  const XML = getDocument(
    expandDocumentData({
      ...data,
      cashboxData: { ...data.cashboxData, isOffline: true },
    }),
  );
  const documentHash = await getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
    uid,
    dateTime: expandDocumentData(data).dateTime,
    documentHash,
  };
};

const generateOfflineZReportDocument = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_Z_REPORT) return "Invalid data type";

  const XZReportData = createXZReportData(
    expandDocumentData({
      ...expandDocumentData(data),
      cashboxData: { ...data.cashboxData, isOffline: true },
    }),
  );

  const XML = getDocument(XZReportData);
  const documentHash = await getDocumentHash(XML);
  const fiscalId = XML?.ZREP?.ZREPHEAD?.ORDERTAXNUM;
  return {
    ...XZReportData,
    fiscalId,
    documentHash,
  };
};

const generateOfflineStartDocument = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_OFFLINE_START) return "Invalid data type";

  const XML = getDocument(
    expandDocumentData({
      ...data,
      cashboxData: { ...data.cashboxData, isOffline: true },
    }),
  );
  const documentHash = await getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    ...data,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    documentHash,
    cashboxData: { ...data.cashboxData, isOffline: true },
  };
};

const generateOfflineFinishDocument = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_OFFLINE_FINISH) return "Invalid data type";

  const XML = getDocument(
    expandDocumentData({
      ...data,
      cashboxData: { ...data.cashboxData, isOffline: true },
    }),
  );
  const documentHash = await getDocumentHash(XML);
  const uid = XML?.CHECK?.CHECKHEAD?.UID;
  return {
    ...data,
    uid,
    dateTime: expandDocumentData(data).dateTime,
    cashboxData: { ...data.cashboxData, isOffline: true },
    documentHash,
  };
};

const mergeOperationsAndXReport = async ({
  taxesConfig,
  operations,
  xReport,
}) => {
  const data = operations.filter(
    (operation) =>
      operation.type === DOCUMENT_TYPE_RECEIPT ||
      operation.type === DOCUMENT_TYPE_RETURN_RECEIPT ||
      operation.type === DOCUMENT_TYPE_SERVICE_ENTRY ||
      operation.type === DOCUMENT_TYPE_SERVICE_DELIVERY,
  );
  const operationsXReport = createXZReportData({
    taxesConfig,
    data,
    lastFiscalDocumentData: {
      dateTime: data[data.length - 1].dateTime,
      documentNumber: data[data.length - 1].cashboxData.nextDocumentNumber,
      fiscalId: data[data.length - 1].fiscalId,
    },
    cashboxData: data[data.length - 1].cashboxData,
    cashier: data[data.length - 1].cashier,
    shiftOpenData: data[data.length - 1].shiftOpenData,
  });

  return {
    ...operationsXReport,
    realiz: realizReturnFieldAcc(xReport.realiz, operationsXReport.realiz),
    return: realizReturnFieldAcc(xReport.return, operationsXReport.return),
    serviceInput: inpitOutputServiceFieldAcc(
      xReport.serviceInput,
      operationsXReport.serviceInput,
    ),
    serviceOutput: inpitOutputServiceFieldAcc(
      xReport.serviceOutput,
      operationsXReport.serviceOutput,
    ),
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
  mergeOperationsAndXReport,
};
