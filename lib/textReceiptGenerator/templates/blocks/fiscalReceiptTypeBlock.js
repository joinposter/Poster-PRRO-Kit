import { isFiscalReceiptReturnType } from "../../../../helpers/printReceiptData.js";

const getFiscalReceiptType = (type) =>
  isFiscalReceiptReturnType(type)
    ? { type: "text", value: "ПОВЕРНЕННЯ", align: "center" }
    : null;

export default getFiscalReceiptType;
