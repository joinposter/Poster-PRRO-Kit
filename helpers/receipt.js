import receipt from "receipt";
import smartTableFormatter from "../lib/textReceiptGenerator/formatters/smartTable/smartTableFormatter.js";
import summaryFormatter from "../lib/textReceiptGenerator/formatters/summaryFormatter.js";
import smartPropertiesFormatter from "../lib/textReceiptGenerator/formatters/smartPropertiesFormatter.js";
import { FISCAL_RECEIPT_SERVER_ADDRESS } from "../const/receipt.js";

export const initReceipt = (receiptConfig) => {
  receipt.config.currency = receiptConfig.currency;
  receipt.config.width = receiptConfig.width;
  receipt.config.ruler = receiptConfig.ruler;

  addFormatter(receipt, "smartTable", smartTableFormatter);
  addFormatter(receipt, "summary", summaryFormatter);
  addFormatter(receipt, "smartProperties", smartPropertiesFormatter);
};

export const addFormatter = (rec, name, formatter) => {
  if (!rec.formatters[name]) {
    rec.addFormatter(name, formatter);
  }
};

export const changeComa = (value) => {
  if (typeof value === "number" || typeof value === "string") {
    return value.toString().replace(".", ",");
  }

  return "";
};

export const priceFormat = (number) => {
  if (typeof number !== "number" && typeof number !== "string") {
    return "0,00";
  }

  let parsed = parseFloat(number);

  const FRACTION_DIGITS = 2;
  parsed = parsed.toFixed(FRACTION_DIGITS);

  return changeComa(parsed);
};

export const getDFSReceiptLink = ({
  dfsDocumentFiscalId,
  cashbox,
  total,
  date,
  time,
}) =>
  `${FISCAL_RECEIPT_SERVER_ADDRESS}?id=${dfsDocumentFiscalId}&date=${date}&time=${time}&fn=${cashbox}&sm=${total}`;
