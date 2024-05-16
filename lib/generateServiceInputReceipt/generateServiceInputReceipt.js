import receipt from "receipt";
import { addFormatter } from "../../helpers/receipt.js";
import summaryFormatter from "../textReceiptGenerator/formatters/summaryFormatter.js";
import smartTableFormatter from "../textReceiptGenerator/formatters/smartTable/smartTableFormatter.js";
import smartPropertiesFormatter from "../textReceiptGenerator/formatters/smartPropertiesFormatter.js";
import getServiceInputReceiptData from "../textReceiptGenerator/templates/getServiceInputReceiptData.js";

export const initReceipt = (receiptConfig) => {
  receipt.config.currency = receiptConfig.currency;
  receipt.config.width = receiptConfig.width;
  receipt.config.ruler = receiptConfig.ruler;

  addFormatter(receipt, "smartTable", smartTableFormatter);
  addFormatter(receipt, "summary", summaryFormatter);
  addFormatter(receipt, "smartProperties", smartPropertiesFormatter);
};

const generateServiceInputReceipt = async (data) => {
  initReceipt(data.receiptConfig);
  const serviceInputReceiptData = getServiceInputReceiptData(data);
  const textServiceInputReceipt = await receipt.create(serviceInputReceiptData);
  return textServiceInputReceipt;
};

export default generateServiceInputReceipt;
