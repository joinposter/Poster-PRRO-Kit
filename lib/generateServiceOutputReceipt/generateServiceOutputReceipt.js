import receipt from "receipt";
import { addFormatter } from "../../helpers/receipt.js";
import summaryFormatter from "../textReceiptGenerator/formatters/summaryFormatter.js";
import smartTableFormatter from "../textReceiptGenerator/formatters/smartTable/smartTableFormatter.js";
import smartPropertiesFormatter from "../textReceiptGenerator/formatters/smartPropertiesFormatter.js";
import getServiceOutputReceiptData from "../textReceiptGenerator/templates/getServiceOutputReceiptData.js";

export const initReceipt = (receiptConfig) => {
  receipt.config.currency = receiptConfig.currency;
  receipt.config.width = receiptConfig.width;
  receipt.config.ruler = receiptConfig.ruler;

  addFormatter(receipt, "smartTable", smartTableFormatter);
  addFormatter(receipt, "summary", summaryFormatter);
  addFormatter(receipt, "smartProperties", smartPropertiesFormatter);
};

const generateServiceOutputReceipt = async (data) => {
  initReceipt(data.receiptConfig);
  const serviceOutputReceiptData = getServiceOutputReceiptData(data);
  const textServiceInputReceipt = await receipt.create(
    serviceOutputReceiptData,
  );
  return textServiceInputReceipt;
};

export default generateServiceOutputReceipt;
