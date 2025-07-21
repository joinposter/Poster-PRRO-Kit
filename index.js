import {
  generateTextFiscalReceipt,
  generateTextServiceTransactionReceipt,
  generateXZReport,
  generateHtmlServiceTransactionReceipt,
  generateHtmlFiscalReceipt,
  generateHTMLXZReport,
  getPreparedDataForPrintReceipt,
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
import { getDateTime, combineSstDateTime } from "./helpers/common.js";
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
} from "./modules/XMLDocuments/index.js";

import {
  getTaxesData,
  getTaxPrograms,
  taxProgramValidation,
} from "./modules/taxes/index.js";
import {
  getReceiptTotal,
  getPaymentSum,
  convertKopecksToGrivnas,
  convertGramsToKg,
} from "./helpers/centsFormat.js";

export {
  generateTextFiscalReceipt,
  generateTextServiceTransactionReceipt,
  generateXZReport,
  getDFSFiscalLink,
  generateHtmlServiceTransactionReceipt,
  generateHtmlFiscalReceipt,
  generateHTMLXZReport,
  getPreparedDataForPrintReceipt,
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
  taxProgramValidation,
  getTaxesData,
  getTaxPrograms,
  getDateTime,
  combineSstDateTime,
  roundWithPrecision,
  cashSumDecimalRounding,
  getBalanceDiffByRequest,
  getReceiptTotal,
  getPaymentSum,
  convertKopecksToGrivnas,
  convertGramsToKg,
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
