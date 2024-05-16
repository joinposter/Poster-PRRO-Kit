import receipt from "receipt";
import receiptData from "./textReceiptGenerator/templates/receipt.js";
import { addFormatter } from "../helpers/receipt.js";
import receiptConfig from "../config/receiptConfig.js";
import summaryFormatter from "./textReceiptGenerator/formatters/summaryFormatter.js";
import smartTableFormatter from "./textReceiptGenerator/formatters/smartTable/smartTableFormatter.js";
import smartPropertiesFormatter from "./textReceiptGenerator/formatters/smartPropertiesFormatter.js";

export const initReceipt = () => {
  receipt.config.currency = receiptConfig.currency;
  receipt.config.width = receiptConfig.width;
  receipt.config.ruler = receiptConfig.ruler;

  addFormatter(receipt, "smartTable", smartTableFormatter);
  addFormatter(receipt, "summary", summaryFormatter);
  addFormatter(receipt, "smartProperties", smartPropertiesFormatter);
};

const generateReceipt = async () => {
  initReceipt();
  const textReceipt = await receipt.create(receiptData);
  return textReceipt;
};

export default generateReceipt;
