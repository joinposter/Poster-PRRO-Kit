import defaultReceiptConfig from "../../config/receipt.js";
import getFiscalCompanyData from "./blocks/fiscalCompanyBlock.js";
import getProductsData from "./blocks/productsBlock.js";
import getSummaryBlock from "./blocks/summaryBlock.js";
import getSstData from "./blocks/sstBlock.js";
import getSmartFooterBlock from "./blocks/smartFooterBlock/smartFooterBlock.js";
import getFiscalReceiptType from "./blocks/fiscalReceiptTypeBlock.js";

const fiscalCompanyData = (data) => getFiscalCompanyData(data.cashboxData);

const operationType = (data) => getFiscalReceiptType(data.type);

const productsData = (data) => getProductsData(data.productsData);

const summaryData = (data) =>
  getSummaryBlock({
    taxesData: data.taxesData,
    roundData: data.roundData,
    currency: data.receiptConfig?.currency || defaultReceiptConfig.currency,
  });

const sstData = (data) => (data.sstData ? getSstData(data.sstData) : null);

const getFiscalReceiptData = (data, isHtml) =>
  [
    ...fiscalCompanyData(data),
    operationType(data),
    ...productsData(data),
    ...summaryData(data),
    ...sstData(data),
    ...getSmartFooterBlock(data, isHtml),
  ].filter(Boolean);

export default getFiscalReceiptData;
