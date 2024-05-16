import receipt from "receipt";
import getFiscalReceiptData from "../textReceiptGenerator/templates/getFiscalReceiptData.js";
import { addFormatter } from "../../helpers/receipt.js";
import summaryFormatter from "../textReceiptGenerator/formatters/summaryFormatter.js";
import smartTableFormatter from "../textReceiptGenerator/formatters/smartTable/smartTableFormatter.js";
import smartPropertiesFormatter from "../textReceiptGenerator/formatters/smartPropertiesFormatter.js";

export const initReceipt = (receiptConfig) => {
  receipt.config.currency = receiptConfig.currency;
  receipt.config.width = receiptConfig.width;
  receipt.config.ruler = receiptConfig.ruler;

  addFormatter(receipt, "smartTable", smartTableFormatter);
  addFormatter(receipt, "summary", summaryFormatter);
  addFormatter(receipt, "smartProperties", smartPropertiesFormatter);
};

const generateFiscalReceipt = async (data) => {
  initReceipt(data.receiptConfig);

  const fiscalReceiptData = getFiscalReceiptData(data);
  const textFiscalReceipt = await receipt.create(fiscalReceiptData);
  return textFiscalReceipt;
};

export default generateFiscalReceipt;
