import receipt from "receipt";
import { initReceipt } from "../../helpers/receipt.js";
import getServiceOutputReceiptData from "../textReceiptGenerator/templates/getServiceOutputReceiptData.js";

const generateServiceOutputReceipt = async (data) => {
  initReceipt(data.receiptConfig);
  const serviceOutputReceiptData = getServiceOutputReceiptData(data);
  return receipt.create(serviceOutputReceiptData);
};

export default generateServiceOutputReceipt;
