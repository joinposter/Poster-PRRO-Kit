import receipt from "receipt";
import receiptConfig from "../../config/receiptConfig.js";
import { initReceipt } from "../../helpers/receipt.js";
import { prepareDataForTextPrintReceipt } from "../../helpers/printReceiptData.js";
import getFiscalReceiptData from "../textReceiptGenerator/templates/getFiscalReceiptData.js";

const generateTextFiscalReceipt = (data) => {
  initReceipt(data.receiptConfig || receiptConfig);
  const receiptData = prepareDataForTextPrintReceipt(data);
  const fiscalReceiptData = getFiscalReceiptData(receiptData);
  return receipt.create(fiscalReceiptData);
};

export default generateTextFiscalReceipt;
