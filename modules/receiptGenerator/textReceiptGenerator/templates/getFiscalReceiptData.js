import defaultReceiptConfig from "../../config/receipt.js";
import getFiscalCompanyData from "./blocks/fiscalCompanyBlock.js";
import getProductsData from "./blocks/productsBlock.js";
import getSummaryBlock from "./blocks/summaryBlock.js";
import getSstData from "./blocks/sstBlock.js";
import getSmartFooterBlock from "./blocks/smartFooterBlock/smartFooterBlock.js";
import getFiscalReceiptType from "./blocks/fiscalReceiptTypeBlock.js";
import headerServiceBlock from "./blocks/headerServiceBlock.js";
import footerServiceBlock from "./blocks/footerServiceBlock.js";

const fiscalCompanyData = ({ cashboxData, cashier }) =>
  getFiscalCompanyData({ ...cashboxData, cashier });

const headerServiceData = (data) => headerServiceBlock(data.headerServiceData);
const footerServiceData = (data) => footerServiceBlock(data.footerServiceData);

const operationType = (data) => getFiscalReceiptType(data.type);

const productsData = (data) => getProductsData(data.productsData);

const summaryData = (data) =>
  getSummaryBlock({
    taxesData: data.taxesData,
    roundData: data.roundData,
    currency: data.receiptConfig?.currency || defaultReceiptConfig.currency,
  });

const sstData = (data) => (data.sstData ? getSstData(data.sstData) : []);

const getFiscalReceiptData = (data, isHtml) =>
  [
    ...fiscalCompanyData(data),
    ...headerServiceData(data),
    operationType(data),
    ...productsData(data),
    ...summaryData(data),
    ...sstData(data),
    ...footerServiceData(data),
    ...getSmartFooterBlock(data, isHtml),
  ].filter(Boolean);

export default getFiscalReceiptData;
