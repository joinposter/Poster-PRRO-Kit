import getFiscalCompanyData from "./blocks/fiscalCompanyBlock.js";
import getOrderData from "./blocks/orderBlock.js";
import getProductsData from "./blocks/productsBlock.js";
import getTaxesData from "./blocks/taxesBlock.js";
import getPaymentData from "./blocks/paymentBlock.js";
import getBankData from "./blocks/bankBlock.js";
import getFooterData from "./blocks/footerBlock.js";

const fiscalCompanyData = (data) => getFiscalCompanyData(data.cashboxConfig);
const orderData = (data) => getOrderData(data.orderInfo);
const productsData = (data) => getProductsData(data.productsInfo);
const taxesData = (data) =>
  getTaxesData({ ...data.taxesInfo, currency: data.receiptConfig.currency });

const paymentData = (data) =>
  getPaymentData({
    data: data.paymentInfo,
    currency: data.receiptConfig.currency,
  });

const bankData = (data) => getBankData(data.bankInfo);

const footerData = (data) => getFooterData(data.footerInfo);

const getFiscalReceiptData = (data) => [
  ...fiscalCompanyData(data),
  orderData(data),
  productsData(data),
  taxesData(data),
  paymentData(data),
  bankData(data),
  ...footerData(data),
];

export default getFiscalReceiptData;
