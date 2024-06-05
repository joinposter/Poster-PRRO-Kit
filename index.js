import { Buffer } from "buffer";
import crypto from "crypto-browserify";

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
};

window.Buffer = Buffer;
window.crypto = window.crypto || crypto;
