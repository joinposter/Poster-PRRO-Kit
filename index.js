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
} from "./modules/offlineMode/index.js";

import {
  XMLToObject,
  getDocument,
  getDocumentHash,
  buildXMLDocument,
} from "./modules/XMLDocuments/index.js";

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
  XMLToObject,
  getDocument,
  getDocumentHash,
  buildXMLDocument,
};
