import { prepareDataForPrintReceipt } from "../../helpers/printReceiptData.js";
import getFiscalReceiptData from "../textReceiptGenerator/templates/getFiscalReceiptData.js";
import renderFiscalReceipt from "../htmlReceiptGenerator/formatters/fiscalReceipt.js";

const generateHtmlFiscalReceipt = (data) => {
  const receiptData = prepareDataForPrintReceipt(data);
  const fiscalReceiptData = getFiscalReceiptData(receiptData, true);
  return renderFiscalReceipt(fiscalReceiptData);
};

export default generateHtmlFiscalReceipt;
