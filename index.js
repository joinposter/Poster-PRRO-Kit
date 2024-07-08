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

import {
  XMLToObject,
  getDocument,
  getDocumentHash,
  buildXMLDocument,
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
  getTaxesData,
  getTaxPrograms,
  getDateTime,
};
