const getFiscalReceiptType = (type) =>
  type === "returnReceipt"
    ? { type: "text", value: "ПОВЕРНЕННЯ", align: "center" }
    : null;

export default getFiscalReceiptType;
