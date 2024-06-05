import {
  DOCUMENT_TYPE_RECEIPT,
  DOCUMENT_TYPE_RETURN_RECEIPT,
  DOCUMENT_TYPE_SERVICE_DELIVERY,
  DOCUMENT_TYPE_SERVICE_ENTRY,
} from "../../receiptGenerator/const/receipt.js";
import {
  PAYMENT_CODE_CARD,
  PAYMENT_CODE_CASH,
  PAYMENT_TYPE_CARD,
  PAYMENT_TYPE_CASH,
  PAYMENT_TYPE_TITLE_CARD,
  PAYMENT_TYPE_TITLE_CASH,
} from "../../XMLDocuments/const/fiscal.js";
import { getTaxesData } from "../../taxes/index.js";
import { getRoundedDiff } from "../../XMLDocuments/helpers/xmlGenerator.js";

const isReceipt = (item) => item.type === DOCUMENT_TYPE_RECEIPT;
const isServiceEntry = (item) => item.type === DOCUMENT_TYPE_SERVICE_ENTRY;
const isServiceDelivery = (item) =>
  item.type === DOCUMENT_TYPE_SERVICE_DELIVERY;

const isReturnReceipt = (item) => item.type === DOCUMENT_TYPE_RETURN_RECEIPT;

const isPaymentByType = (type) => (payment) => payment.type === type;

const existPaymentByType = (type) => (item) =>
  item.payments.some(isPaymentByType(type));

const hasReceipts = (data) => data.some(isReceipt);

const hasReturnReceipts = (data) => data.some(isReturnReceipt);
const hasServiceEntries = (data) => data.some(isServiceEntry);
const hasServiceDeliveries = (data) => data.some(isServiceDelivery);

const hasPaymentByType = (data, type) => data.some(existPaymentByType(type));

const getPaymentSum = (item, type) =>
  item.payments.find(isPaymentByType(type)).sum - getRoundedDiff(item, type);

const accumulateTotalByType = (type) => (acc, item) =>
  (isReceipt(item) || isReturnReceipt(item)) && existPaymentByType(type)(item)
    ? acc + getPaymentSum(item, type)
    : acc;

const getPaymentsTotalByType = (data, type) =>
  data.reduce(accumulateTotalByType(type), 0);

const createCashPaymentsData = (data) =>
  hasPaymentByType(data, PAYMENT_TYPE_CASH)
    ? {
        payFormCode: PAYMENT_CODE_CASH,
        payFormName: PAYMENT_TYPE_TITLE_CASH,
        sum: getPaymentsTotalByType(data, PAYMENT_TYPE_CASH),
      }
    : null;

const createCardPaymentsData = (data) =>
  hasPaymentByType(data, PAYMENT_TYPE_CARD)
    ? {
        payFormCode: PAYMENT_CODE_CARD,
        payFormName: PAYMENT_TYPE_TITLE_CARD,
        sum: getPaymentsTotalByType(data, PAYMENT_TYPE_CARD),
      }
    : null;

const getReceiptCount = (data) => data.length;

const accumulateTotal = (acc, item) => acc + item.total - getRoundedDiff(item);

const getReceiptTotal = (data) => data.reduce(accumulateTotal, 0);

const accumulateSum = (acc, item) => acc + item.sum;

const getTransactionsSum = (data) => data.reduce(accumulateSum, 0);

const getRealizData = (data, taxesConfig) => {
  if (!hasReceipts(data)) return null;

  const receipts = data.filter(isReceipt);

  return {
    sum: getReceiptTotal(receipts),
    receiptCount: getReceiptCount(receipts),
    payments: [
      createCashPaymentsData(receipts),
      createCardPaymentsData(receipts),
    ].filter(Boolean),
    taxes: createTaxesData(receipts, taxesConfig),
  };
};

const getServiceEntryData = (data) => {
  if (!hasServiceEntries(data)) return null;

  const serviceEntries = data.filter(isServiceEntry);
  return getTransactionsSum(serviceEntries);
};

const getServiceDeliveryData = (data) => {
  if (!hasServiceDeliveries(data)) return null;

  const serviceDeliveries = data.filter(isServiceDelivery);
  return getTransactionsSum(serviceDeliveries);
};

const getReturnData = (data, taxesConfig) => {
  if (!hasReturnReceipts(data)) return null;

  const returnReceipts = data.filter(isReturnReceipt);

  return {
    sum: getReceiptTotal(returnReceipts),
    receiptCount: getReceiptCount(returnReceipts),
    payments: [
      createCashPaymentsData(returnReceipts),
      createCardPaymentsData(returnReceipts),
    ].filter(Boolean),
    taxes: createTaxesData(returnReceipts, taxesConfig),
  };
};

const getFlatProductsData = (acc, item) => [...acc, ...item.products];

const createTaxesData = (data, taxesConfig) => {
  const products = data.reduce(getFlatProductsData, []);
  const result = getTaxesData(taxesConfig)(products);
  return result;
};

const getShiftOpenData = ({ shiftOpenData }) => ({
  dateTime: shiftOpenData?.dateTime,
});

const getLastFiscalDocumentData = (document) => ({
  dateTime: document?.request?.dateTime,
  documentNumber: document?.documentNumber,
  fiscalId: document?.fiscalId,
});

const createXZReportData = ({
  data,
  type,
  uid,
  lastFiscalDocument,
  cashboxData,
  dateTime,
  taxesConfig,
}) => ({
  type,
  dateTime,
  uid,
  cashboxData,
  realiz: getRealizData(data, taxesConfig),
  return: getReturnData(data, taxesConfig),
  serviceInput: getServiceEntryData(data),
  serviceOutput: getServiceDeliveryData(data),
  shiftOpenData: getShiftOpenData(cashboxData),
  lastFiscalDocumentData: getLastFiscalDocumentData(lastFiscalDocument),
});

// eslint-disable-next-line import/prefer-default-export
export { createXZReportData };
