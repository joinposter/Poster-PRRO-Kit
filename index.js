import {
  generateTextFiscalReceipt,
  generateTextServiceTransactionReceipt,
  generateXZReport,
  generateHtmlFiscalReceipt,
} from "./modules/receiptGenerator/index.js";
import {
  getReceiptOfflineModeRequestData,
  getTransactionOfflineModeRequestData,
  getZReportOfflineModeRequestData,
  getOpenShiftOfflineModeRequestData,
  getCloseShiftOfflineModeRequestData,
  getStartOfflineModeRequestData,
  getFinishOfflineModeRequestData,
  mergeOperationsAndXReport,
} from "./modules/offlineMode/index.js";
import getDFSFiscalLink from "./modules/dfs/index.js";
import { getDateTime } from "./helpers/common.js";
import { roundWithPrecision, cashSumDecimalRounding } from "./helpers/round.js";
import { getBalanceDiffByRequest } from "./helpers/balance.js";
import {
  DOCUMENT_TYPE_RECEIPT,
  DOCUMENT_TYPE_RETURN_RECEIPT,
  DOCUMENT_TYPE_SERVICE_ENTRY,
  DOCUMENT_TYPE_SERVICE_DELIVERY,
  DOCUMENT_TYPE_SHIFT_OPEN,
  DOCUMENT_TYPE_SHIFT_CLOSE,
  DOCUMENT_TYPE_Z_REPORT,
  DOCUMENT_TYPE_X_REPORT,
  DOCUMENT_TYPE_OFFLINE_START,
  DOCUMENT_TYPE_OFFLINE_FINISH,
} from "./const/types.js";

import {
  XMLToObject,
  getDocument,
  getDocumentHash,
  buildXMLDocument,
  getRoundedDiff,
} from "./modules/XMLDocuments/index.js";

import { getTaxesData, getTaxPrograms } from "./modules/taxes/index.js";

export {
  generateTextFiscalReceipt,
  generateTextServiceTransactionReceipt,
  generateXZReport,
  getDFSFiscalLink,
  generateHtmlFiscalReceipt,
  getReceiptOfflineModeRequestData,
  getTransactionOfflineModeRequestData,
  getZReportOfflineModeRequestData,
  getOpenShiftOfflineModeRequestData,
  getCloseShiftOfflineModeRequestData,
  getStartOfflineModeRequestData,
  getFinishOfflineModeRequestData,
  mergeOperationsAndXReport,
  XMLToObject,
  getDocument,
  getDocumentHash,
  buildXMLDocument,
  getRoundedDiff,
  getTaxesData,
  getTaxPrograms,
  getDateTime,
  roundWithPrecision,
  cashSumDecimalRounding,
  getBalanceDiffByRequest,
  DOCUMENT_TYPE_RECEIPT,
  DOCUMENT_TYPE_RETURN_RECEIPT,
  DOCUMENT_TYPE_SERVICE_ENTRY,
  DOCUMENT_TYPE_SERVICE_DELIVERY,
  DOCUMENT_TYPE_SHIFT_OPEN,
  DOCUMENT_TYPE_SHIFT_CLOSE,
  DOCUMENT_TYPE_Z_REPORT,
  DOCUMENT_TYPE_X_REPORT,
  DOCUMENT_TYPE_OFFLINE_START,
  DOCUMENT_TYPE_OFFLINE_FINISH,
};
