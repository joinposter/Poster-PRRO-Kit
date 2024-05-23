import receipt from "receipt";
import receiptConfig from "../../config/receiptConfig.js";
import { initReceipt } from "../../helpers/receipt.js";
import getServiceInputReceiptData from "../textReceiptGenerator/templates/getServiceInputReceiptData.js";

const generateTextServiceInputReceipt = async (data) => {
  initReceipt(data.receiptConfig || receiptConfig);
  const serviceInputReceiptData = getServiceInputReceiptData(data);
  return receipt.create(serviceInputReceiptData);
};

export default generateTextServiceInputReceipt;
