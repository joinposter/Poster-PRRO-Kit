import receipt from "receipt";
import receiptConfig from "../../config/receiptConfig.js";
import getFiscalReceiptData from "../textReceiptGenerator/templates/getFiscalReceiptData.js";
import { initReceipt } from "../../helpers/receipt.js";

const generateTextFiscalReceipt = (data) => {
  initReceipt(data.receiptConfig || receiptConfig);
  const fiscalReceiptData = getFiscalReceiptData(data);
  return receipt.create(fiscalReceiptData);
};

export default generateTextFiscalReceipt;
