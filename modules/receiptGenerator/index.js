import receipt from "receipt";
import defaultReceiptConfig from "./config/receipt.js";
import { prepareDataForPrintReceipt } from "./helpers/receiptData.js";
import { initReceipt } from "./helpers/receipt.js";
import getFiscalReceiptData from "./templateData/getFiscalReceiptData.js";
import renderFiscalReceipt from "./templateBlocks/htmlFiscalReceipt.js";
import getServiceTransactionReceiptData from "./templateData/getServiceTransactionReceiptData.js";
import getXZReportData from "./templateData/getXZReportData.js";

const generateHtmlFiscalReceipt = (data) => {
  const receiptData = prepareDataForPrintReceipt(data);
  const fiscalReceiptData = getFiscalReceiptData(receiptData, true);
  return renderFiscalReceipt(fiscalReceiptData);
};

const generateHtmlServiceTransactionReceipt = (data) => {
  const serviceTransactionReceiptData = getServiceTransactionReceiptData(data);
  return renderFiscalReceipt(serviceTransactionReceiptData);
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

const generateHTMLXZReport = (data) => {
  const xzReportData = getXZReportData(data);
  return renderFiscalReceipt(xzReportData);
};

export {
  generateTextFiscalReceipt,
  generateHtmlFiscalReceipt,
  generateTextServiceTransactionReceipt,
  generateHtmlServiceTransactionReceipt,
  generateXZReport,
  generateHTMLXZReport,
};
