import receipt from "receipt";
import receiptConfig from "../../config/receiptConfig.js";
import { initReceipt } from "../../helpers/receipt.js";
import getXReportData from "../textReceiptGenerator/templates/getXReportData.js";

const generateXReport = (data) => {
  initReceipt(data.receiptConfig || receiptConfig);
  const xReportData = getXReportData(data);
  return receipt.create(xReportData);
};

export default generateXReport;
