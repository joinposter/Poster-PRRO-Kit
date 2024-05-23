import receiptConfig from "../../../config/receiptConfig.js";
import getFiscalCompanyData from "./blocks/fiscalCompanyBlock.js";
import getProductsData from "./blocks/productsBlock.js";
import getTaxesData from "./blocks/taxesBlock.js";
import getRoundData from "./blocks/roundBlock.js";
import getSstData from "./blocks/sstBlock.js";
import getFooterData from "./blocks/footerBlock.js";

const fiscalCompanyData = (data) => getFiscalCompanyData(data.cashboxData);
const productsData = (data) => getProductsData(data.productsData);

const taxesData = (data) =>
  getTaxesData({
    ...data.taxesData,
    currency: data.receiptConfig?.currency || receiptConfig.currency,
  });

const roundData = (data) =>
  data.roundData
    ? getRoundData({
        data: data.roundData,
        currency: data.receiptConfig.currency || receiptConfig.currency,
      })
    : null;

const sstData = (data) => (data.sstData ? getSstData(data.sstData) : null);

const footerData = (data) => getFooterData(data.footerData);

const getFiscalReceiptData = (data) =>
  [
    ...fiscalCompanyData(data),
    ...productsData(data),
    ...taxesData(data),
    roundData(data),
    sstData(data),
    ...footerData(data),
  ].filter(Boolean);

export default getFiscalReceiptData;
