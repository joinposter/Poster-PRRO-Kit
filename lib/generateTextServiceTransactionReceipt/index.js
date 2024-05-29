import receipt from "receipt";
import receiptConfig from "../../config/receiptConfig.js";
import { initReceipt } from "../../helpers/receipt.js";
import getServiceTransactionReceiptData from "../textReceiptGenerator/templates/getServiceTransactionReceiptData.js";

const generateTextServiceInputReceipt = async (data) => {
  initReceipt(data.receiptConfig || receiptConfig);
  const serviceInputReceiptData = getServiceTransactionReceiptData(data);
  return receipt.create(serviceInputReceiptData);
};

export default generateTextServiceInputReceipt;
