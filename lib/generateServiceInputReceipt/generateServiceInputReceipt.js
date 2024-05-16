import receipt from "receipt";
import receiptConfig from "../../config/receiptConfig.js";
import { addFormatter } from "../../helpers/receipt.js";
import summaryFormatter from "../textReceiptGenerator/formatters/summaryFormatter.js";
import smartTableFormatter from "../textReceiptGenerator/formatters/smartTable/smartTableFormatter.js";
import smartPropertiesFormatter from "../textReceiptGenerator/formatters/smartPropertiesFormatter.js";
import serviceInputReceiptData from "../textReceiptGenerator/templates/serviceInputReceipt.js";

export const initReceipt = () => {
  receipt.config.currency = receiptConfig.currency;
  receipt.config.width = receiptConfig.width;
  receipt.config.ruler = receiptConfig.ruler;

  addFormatter(receipt, "smartTable", smartTableFormatter);
  addFormatter(receipt, "summary", summaryFormatter);
  addFormatter(receipt, "smartProperties", smartPropertiesFormatter);
};

const generateServiceInputReceipt = async () => {
  initReceipt();
  const textServiceInputReceipt = await receipt.create(serviceInputReceiptData);
  return textServiceInputReceipt;
};

export default generateServiceInputReceipt;
