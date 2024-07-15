import receipt from "receipt";
import defaultReceiptConfig from "./config/receipt.js";
import { prepareDataForPrintReceipt } from "./helpers/receiptData.js";
import { initReceipt } from "./helpers/receipt.js";
import getFiscalReceiptData from "./textReceiptGenerator/templates/getFiscalReceiptData.js";
import renderFiscalReceipt from "./htmlReceiptGenerator/formatters/fiscalReceipt.js";
import getServiceTransactionReceiptData from "./textReceiptGenerator/templates/getServiceTransactionReceiptData.js";
import getXZReportData from "./textReceiptGenerator/templates/getXZReportData.js";

const generateHtmlFiscalReceipt = (data) => {
  const receiptData = prepareDataForPrintReceipt(data);
  const fiscalReceiptData = getFiscalReceiptData(receiptData, true);
  return renderFiscalReceipt(fiscalReceiptData);
};

const generateTextFiscalReceipt = (data) => {
  initReceipt(data.receiptConfig || defaultReceiptConfig);
  const receiptData = prepareDataForPrintReceipt(data);
  const fiscalReceiptData = getFiscalReceiptData(receiptData);
  return receipt.create(fiscalReceiptData);
};

const generateTextServiceTransactionReceipt = (data) => {
  initReceipt(data.receiptConfig || defaultReceiptConfig);
  const serviceTransactionReceiptData = getServiceTransactionReceiptData(data);
  return receipt.create(serviceTransactionReceiptData);
};

const generateXZReport = (data) => {
  initReceipt(data.receiptConfig || defaultReceiptConfig);
  const xzReportData = getXZReportData(data);
  return receipt.create(xzReportData);
};

export {
  generateHtmlFiscalReceipt,
  generateTextFiscalReceipt,
  generateTextServiceTransactionReceipt,
  generateXZReport,
};
