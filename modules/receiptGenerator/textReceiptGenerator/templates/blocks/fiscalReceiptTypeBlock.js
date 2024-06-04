import { isFiscalReceiptReturnType } from "../../../helpers/receiptData.js";

const getFiscalReceiptType = (type) =>
  isFiscalReceiptReturnType(type)
    ? { type: "text", value: "ПОВЕРНЕННЯ", align: "center" }
    : null;

export default getFiscalReceiptType;
