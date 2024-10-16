import receipt from "receipt";
import smartTableFormatter from "../formatters/text/smartTable/smartTableFormatter.js";
import summaryFormatter from "../formatters/text/summaryFormatter.js";
import smartPropertiesFormatter from "../formatters/text/smartPropertiesFormatter.js";

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
  if (
    typeof number !== "number" &&
    typeof number !== "string" &&
    Number.isNaN(number)
  ) {
    return "0,00";
  }

  let parsed = parseFloat(number);

  const FRACTION_DIGITS = 2;
  parsed = parsed.toFixed(FRACTION_DIGITS);

  return changeComa(parsed);
};
