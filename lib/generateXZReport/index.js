import receipt from "receipt";
import receiptConfig from "../../config/receiptConfig.js";
import { initReceipt } from "../../helpers/receipt.js";
import getXZReportData from "../textReceiptGenerator/templates/getXZReportData.js";

const generateXZReport = (data) => {
  initReceipt(data.receiptConfig || receiptConfig);
  const xzReportData = getXZReportData(data);
  return receipt.create(xzReportData);
};

export default generateXZReport;
