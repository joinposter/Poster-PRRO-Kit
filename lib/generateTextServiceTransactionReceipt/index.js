import receipt from "receipt";
import receiptConfig from "../../config/receiptConfig.js";
import { initReceipt } from "../../helpers/receipt.js";
import getServiceTransactionReceiptData from "../textReceiptGenerator/templates/getServiceTransactionReceiptData.js";

const generateTextServiceTransactionReceipt = (data) => {
  initReceipt(data.receiptConfig || receiptConfig);
  const serviceTransactionReceiptData = getServiceTransactionReceiptData(data);
  return receipt.create(serviceTransactionReceiptData);
};

export default generateTextServiceTransactionReceipt;
