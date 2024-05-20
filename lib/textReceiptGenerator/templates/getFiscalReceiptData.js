import getFiscalCompanyData from "./blocks/fiscalCompanyBlock.js";
import getProductsData from "./blocks/productsBlock.js";
import getTaxesData from "./blocks/taxesBlock.js";
import getRoundData from "./blocks/roundBlock.js";
import getBankData from "./blocks/bankBlock.js";
import getFooterData from "./blocks/footerBlock.js";

const fiscalCompanyData = (data) => getFiscalCompanyData(data.cashboxConfig);
const productsData = (data) => getProductsData(data.productsInfo);

const taxesData = (data) =>
  getTaxesData({ ...data.taxesInfo, currency: data.receiptConfig.currency });

const roundData = (data) =>
  getRoundData({
    data: data.roundInfo,
    currency: data.receiptConfig.currency,
  });

const bankData = (data) => getBankData(data.bankInfo);

const footerData = (data) => getFooterData(data.footerInfo);

const getFiscalReceiptData = (data) => [
  ...fiscalCompanyData(data),
  ...productsData(data),
  taxesData(data),
  roundData(data),
  bankData(data),
  ...footerData(data),
];

export default getFiscalReceiptData;
