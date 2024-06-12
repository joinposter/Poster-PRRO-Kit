import {
  generateTextFiscalReceipt,
  generateTextServiceTransactionReceipt,
  generateXZReport,
  generateQRCodeReceiptData,
  generateHtmlFiscalReceipt,
} from "./modules/receiptGenerator/index.js";
import {
  generateOfflineReceiptDocument,
  generateOfflineTransactionDocument,
  generateOfflineOpenShiftDocument,
  generateOfflineCloseShiftDocument,
  generateOfflineZReportDocument,
  generateOfflineStartDocument,
  generateOfflineFinishDocument,
  mergeOperationsAndXReport,
} from "./modules/offlineMode/index.js";

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
  generateQRCodeReceiptData,
  generateHtmlFiscalReceipt,
  generateOfflineReceiptDocument,
  generateOfflineTransactionDocument,
  generateOfflineOpenShiftDocument,
  generateOfflineCloseShiftDocument,
  generateOfflineZReportDocument,
  generateOfflineStartDocument,
  generateOfflineFinishDocument,
  mergeOperationsAndXReport,
  XMLToObject,
  getDocument,
  getDocumentHash,
  buildXMLDocument,
  getTaxesData,
  getTaxPrograms,
};
