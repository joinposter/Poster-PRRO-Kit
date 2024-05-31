import pug from "pug";
import { prepareDataForPrintReceipt } from "../../helpers/printReceiptData.js";
import getFiscalReceiptData from "../textReceiptGenerator/templates/getFiscalReceiptData.js";

const generateHtmlFiscalReceipt = (data) => {
  const receiptData = prepareDataForPrintReceipt(data);
  const fiscalReceiptData = getFiscalReceiptData(receiptData, true);
  const compiledFunction = pug.compileFile(
    "lib/htmlReceiptGenerator/formatters/fiscalReceipt.pug",
  );
  return compiledFunction({ fiscalReceiptData });
};

export default generateHtmlFiscalReceipt;
