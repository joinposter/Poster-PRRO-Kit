import receipt from "receipt";
import receiptConfig from "../../config/receiptConfig.js";
import { initReceipt } from "../../helpers/receipt.js";
import { prepareDataForPrintReceipt } from "../../helpers/printReceiptData.js";
import getFiscalReceiptData from "../textReceiptGenerator/templates/getFiscalReceiptData.js";

const generateTextFiscalReceipt = (data) => {
  initReceipt(data.receiptConfig || receiptConfig);
  const receiptData = prepareDataForPrintReceipt(data);
  const fiscalReceiptData = getFiscalReceiptData(receiptData);
  return receipt.create(fiscalReceiptData);
};

export default generateTextFiscalReceipt;
