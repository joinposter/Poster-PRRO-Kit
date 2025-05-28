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
} from "../../const/types.js";
import { getTaxesData } from "../taxes/index.js";
import { getDocument, getDocumentHash } from "../XMLDocuments/index.js";
import {
  createXZReportData,
  sumFieldAcc,
  realizReturnFieldAcc,
} from "./helpers/XZReportData.js";
import getDFSFiscalLink from "../dfs/index.js";
import { getDateTime } from "../../helpers/common.js";
import {
  convertKopecksToGrivnas,
  getReceiptTotal,
} from "../../helpers/centsFormat.js";

const getReceiptOfflineModeRequestData = async (data) => {
  if (
    data?.type !== DOCUMENT_TYPE_RECEIPT &&
    data?.type !== DOCUMENT_TYPE_RETURN_RECEIPT
  ) {
    return "Invalid data type";
  }

  const { taxesConfig, cashboxData, ...rest } = data;
  const taxes = getTaxesData(taxesConfig)(rest?.products);
  const XML = getDocument({
    ...rest,
    cashboxData: {
      ...cashboxData,
      isOffline: true,
    },
    taxes,
  });
  const documentHash = await getDocumentHash(XML);
  const { dateTime } = data;
  const fiscalId = XML?.CHECK?.CHECKHEAD?.ORDERTAXNUM;
  const fiscalLink = getDFSFiscalLink({
    fiscalId,
    cashbox: cashboxData.cashbox,
    sum: getReceiptTotal(data),
    date: getDateTime({ date: dateTime, format: "dateDfsLink" }),
    time: getDateTime({ date: dateTime, format: "timeDfsLink" }),
    previousDocumentHash: cashboxData.offlineSessionData.lastDocumentHash,
  });

  return {
    fiscalId,
    fiscalLink,
    isOffline: true,
    taxes,
    documentHash,
    cashboxData: {
      ...cashboxData,
      isOffline: true,
    },
    ...rest,
  };
};
const getTransactionOfflineModeRequestData = async (data) => {
  if (
    data?.type !== DOCUMENT_TYPE_SERVICE_ENTRY &&
    data?.type !== DOCUMENT_TYPE_SERVICE_DELIVERY
  )
    return "Invalid data type";

  const XML = getDocument({
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
  });
  const { dateTime } = data;
  const documentHash = await getDocumentHash(XML);
  const fiscalId = XML?.CHECK?.CHECKHEAD?.ORDERTAXNUM;
  const fiscalLink = getDFSFiscalLink({
    fiscalId,
    cashbox: data.cashboxData.cashbox,
    sum: convertKopecksToGrivnas(data.sum),
    date: getDateTime({ date: dateTime, format: "dateDfsLink" }),
    time: getDateTime({ date: dateTime, format: "timeDfsLink" }),
    previousDocumentHash: data.cashboxData.offlineSessionData.lastDocumentHash,
  });

  return {
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
    fiscalId,
    fiscalLink,
    isOffline: true,
    documentHash,
  };
};

const getOpenShiftOfflineModeRequestData = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_SHIFT_OPEN) return "Invalid data type";

  const XML = getDocument({
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
  });
  const documentHash = await getDocumentHash(XML);
  return {
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
    documentHash,
  };
};

const getCloseShiftOfflineModeRequestData = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_SHIFT_CLOSE) return "Invalid data type";

  const XML = getDocument({
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
  });
  const documentHash = await getDocumentHash(XML);
  return {
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
    documentHash,
  };
};

const getZReportOfflineModeRequestData = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_Z_REPORT) return "Invalid data type";

  const reportData = {
    ...data.reportData,
    type: data.type,
    cashboxData: { ...data.cashboxData, isOffline: true },
  };

  const XML = getDocument(reportData);
  const documentHash = await getDocumentHash(XML);
  const fiscalId = XML?.ZREP?.ZREPHEAD?.ORDERTAXNUM;
  return {
    ...reportData,
    fiscalId,
    isOffline: true,
    documentHash,
  };
};

const getStartOfflineModeRequestData = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_OFFLINE_START) return "Invalid data type";

  const XML = getDocument({
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
  });
  const documentHash = await getDocumentHash(XML);
  return {
    ...data,
    documentHash,
    cashboxData: { ...data.cashboxData, isOffline: true },
  };
};

const getFinishOfflineModeRequestData = async (data) => {
  if (data?.type !== DOCUMENT_TYPE_OFFLINE_FINISH) return "Invalid data type";

  const XML = getDocument({
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
  });
  const documentHash = await getDocumentHash(XML);
  return {
    ...data,
    cashboxData: { ...data.cashboxData, isOffline: true },
    documentHash,
  };
};

const mergeOperationsAndXReport = async ({
  taxesConfig,
  operations,
  xReport,
}) => {
  let operationsXReport;
  if (
    operations === null ||
    (Array.isArray(operations) && operations.length === 0)
  ) {
    operationsXReport = {
      ...xReport,
      realiz: null,
      return: null,
      serviceInput: null,
      serviceOutput: null,
    };
  } else {
    const data = operations.filter(
      (operation) =>
        operation.type === DOCUMENT_TYPE_RECEIPT ||
        operation.type === DOCUMENT_TYPE_RETURN_RECEIPT ||
        operation.type === DOCUMENT_TYPE_SERVICE_ENTRY ||
        operation.type === DOCUMENT_TYPE_SERVICE_DELIVERY,
    );

    operationsXReport = createXZReportData({
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
  }
  return {
    ...operationsXReport,
    realiz: realizReturnFieldAcc(xReport.realiz, operationsXReport.realiz),
    return: realizReturnFieldAcc(xReport.return, operationsXReport.return),
    serviceInput: {
      sum: sumFieldAcc(xReport.serviceInput, operationsXReport.serviceInput),
    },
    serviceOutput: {
      sum: sumFieldAcc(xReport.serviceOutput, operationsXReport.serviceOutput),
    },
    shiftOpenData: xReport.shiftOpenData,
  };
};

export {
  getReceiptOfflineModeRequestData,
  getTransactionOfflineModeRequestData,
  getZReportOfflineModeRequestData,
  getOpenShiftOfflineModeRequestData,
  getCloseShiftOfflineModeRequestData,
  getStartOfflineModeRequestData,
  getFinishOfflineModeRequestData,
  mergeOperationsAndXReport,
};
