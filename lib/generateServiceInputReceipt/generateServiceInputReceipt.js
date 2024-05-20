import receipt from "receipt";
import { initReceipt } from "../../helpers/receipt.js";
import getServiceInputReceiptData from "../textReceiptGenerator/templates/getServiceInputReceiptData.js";

const generateServiceInputReceipt = async (data) => {
  initReceipt(data.receiptConfig);
  const serviceInputReceiptData = getServiceInputReceiptData(data);
  return receipt.create(serviceInputReceiptData);
};

export default generateServiceInputReceipt;
