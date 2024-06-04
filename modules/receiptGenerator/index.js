import receipt from "receipt";
import qrcode from "qrcode-generator";
import receiptConfig from "../../config/receiptConfig.js";
import { prepareDataForPrintReceipt } from "./helpers/receiptData.js";
import { getDFSReceiptLink, initReceipt } from "./helpers/receipt.js";
import { getDateTime } from "../../helpers/common.js";
import { DEFAULT_QR_MARGIN, DEFAULT_QR_SIZE } from "./const/receipt.js";
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
  initReceipt(data.receiptConfig || receiptConfig);
  const receiptData = prepareDataForPrintReceipt(data);
  const fiscalReceiptData = getFiscalReceiptData(receiptData);
  return receipt.create(fiscalReceiptData);
};

const generateTextServiceTransactionReceipt = (data) => {
  initReceipt(data.receiptConfig || receiptConfig);
  const serviceTransactionReceiptData = getServiceTransactionReceiptData(data);
  return receipt.create(serviceTransactionReceiptData);
};

const generateXZReport = (data) => {
  initReceipt(data.receiptConfig || receiptConfig);
  const xzReportData = getXZReportData(data);
  return receipt.create(xzReportData);
};

const generateQRCodeReceiptData = (data) => {
  const qrCodeString = getDFSReceiptLink({
    fiscalId: data.fiscalId,
    cashbox: data.cashboxData.cashbox,
    total: data.total,
    date: getDateTime({ data: data.dateTime, format: "date" }),
    time: getDateTime({ data: data.dateTime, format: "time" }),
  });
  const qrCode = qrcode(0, "L");
  qrCode.addData(qrCodeString);
  qrCode.make();
  const qrCodeSvgTag = qrCode.createSvgTag(
    data?.qrOptions?.size || DEFAULT_QR_SIZE,
    data?.qrOptions?.margin || DEFAULT_QR_MARGIN,
  );
  return { qrCodeSvgTag, qrCodeString };
};

export {
  generateHtmlFiscalReceipt,
  generateTextFiscalReceipt,
  generateTextServiceTransactionReceipt,
  generateXZReport,
  generateQRCodeReceiptData,
};
