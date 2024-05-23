import receipt from "receipt";
import receiptConfig from "../../config/receiptConfig.js";
import { initReceipt } from "../../helpers/receipt.js";
import getServiceOutputReceiptData from "../textReceiptGenerator/templates/getServiceOutputReceiptData.js";

const generateTextServiceOutputReceipt = async (data) => {
  initReceipt(data.receiptConfig || receiptConfig);
  const serviceOutputReceiptData = getServiceOutputReceiptData(data);
  return receipt.create(serviceOutputReceiptData);
};

export default generateTextServiceOutputReceipt;
