import defaultReceiptConfig from "../config/receipt.js";
import getFiscalCompanyData from "../templateBlocks/fiscalCompanyBlock.js";
import getProductsData from "../templateBlocks/productsBlock.js";
import getSummaryBlock from "../templateBlocks/summaryBlock.js";
import getSstData from "../templateBlocks/sstBlock.js";
import getFiscalReceiptType from "../templateBlocks/fiscalReceiptTypeBlock.js";
import headerServiceBlock from "../templateBlocks/headerServiceBlock.js";
import footerServiceBlock from "../templateBlocks/footerServiceBlock.js";
import getSmartReceiptFooterBlock from "../templateBlocks/smartReceiptFooterBlock.js";

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
    ...getSmartReceiptFooterBlock(data, isHtml),
  ].filter(Boolean);

export default getFiscalReceiptData;
