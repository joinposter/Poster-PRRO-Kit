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
import { roundWithPrecision } from "../../../helpers/round.js";

export { createXZReportData, realizReturnFieldAcc, sumFieldAcc };

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

const getPaymentSumData = (item, type) => {
  const CENTS_IN_UAH = 100;
  const currentPayment = item.payments.find(isPaymentByType(type));
  return currentPayment.isInCents
    ? currentPayment.sum
    : currentPayment.sum * CENTS_IN_UAH;
};

const accumulateTotalByType = (type) => (acc, item) =>
  (isReceipt(item) || isReturnReceipt(item)) && existPaymentByType(type)(item)
    ? roundWithPrecision(acc + getPaymentSumData(item, type))
    : acc;

const getPaymentsTotalByType = (data, type) =>
  data.reduce(accumulateTotalByType(type), 0);

const getIsInCents = (data) => data.some((item) => item.total.isInCents);

const createCashPaymentsData = (data) =>
  hasPaymentByType(data, PAYMENT_TYPE_CASH)
    ? {
        payFormCode: PAYMENT_CODE_CASH,
        payFormName: PAYMENT_TYPE_TITLE_CASH,
        sum: getPaymentsTotalByType(data, PAYMENT_TYPE_CASH),
        isInCents: getIsInCents(data),
      }
    : null;

const createCardPaymentsData = (data) =>
  hasPaymentByType(data, PAYMENT_TYPE_CARD)
    ? {
        payFormCode: PAYMENT_CODE_CARD,
        payFormName: PAYMENT_TYPE_TITLE_CARD,
        sum: getPaymentsTotalByType(data, PAYMENT_TYPE_CARD),
        isInCents: getIsInCents(data),
      }
    : null;

const getReceiptCount = (data) => data.length;

const accumulateTotal = (acc, item) => roundWithPrecision(acc + item.total);

const getTotal = (data) => data.reduce(accumulateTotal, 0);

const accumulateTotalInCents = (acc, item) => {
  const CENTS_IN_UAH = 100;
  const multiplier = item.total?.isInCents ? 1 : CENTS_IN_UAH;
  const total = item.total?.isInCents ? item.total.sum : item.total;
  return Math.round(acc + multiplier * total);
};
const getTotalInCents = (data) => data.reduce(accumulateTotalInCents, 0);

const accumulateSum = (acc, item) => roundWithPrecision(acc + item.sum);

const getTransactionsSum = (data) => data.reduce(accumulateSum, 0);

const accumulateSumInCents = (acc, item) => {
  const CENTS_IN_UAH = 100;
  const multiplier = item?.isInCents ? 1 : CENTS_IN_UAH;
  return Math.round(acc + multiplier * item.sum);
};
const getTransactionsSumInCents = (data) =>
  data.reduce(accumulateSumInCents, 0);

const getRealizData = (data, taxesConfig) => {
  if (!hasReceipts(data)) return null;

  const receipts = data.filter(isReceipt);

  const isInCents = receipts.some((receipt) => receipt.total.isInCents);
  const sum = isInCents
    ? { value: getTotalInCents(receipts), isInCents }
    : getTotal(receipts);

  return {
    sum,
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
  const isInCents = serviceEntries.some((entry) => entry.isInCents);
  return isInCents
    ? { value: getTransactionsSumInCents(serviceEntries), isInCents }
    : getTransactionsSum(serviceEntries);
};

const getServiceDeliveryData = (data) => {
  if (!hasServiceDeliveries(data)) return null;

  const serviceDeliveries = data.filter(isServiceDelivery);
  const isInCents = serviceDeliveries.some((delivery) => delivery.isInCents);
  return isInCents
    ? { value: getTransactionsSumInCents(serviceDeliveries), isInCents }
    : getTransactionsSum(serviceDeliveries);
};

const getReturnData = (data, taxesConfig) => {
  if (!hasReturnReceipts(data)) return null;

  const returnReceipts = data.filter(isReturnReceipt);
  const isInCents = returnReceipts.some((receipt) => receipt.total.isInCents);
  const sum = isInCents
    ? { value: getTotalInCents(returnReceipts), isInCents }
    : getTotal(returnReceipts);

  return {
    sum,
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
  taxesConfig,
  data,
  lastFiscalDocument,
  lastFiscalDocumentData,
  ...rest
}) => ({
  realiz: getRealizData(data, taxesConfig),
  return: getReturnData(data, taxesConfig),
  serviceInput: getServiceEntryData(data),
  serviceOutput: getServiceDeliveryData(data),
  shiftOpenData: getShiftOpenData(rest),
  lastFiscalDocumentData:
    lastFiscalDocumentData || getLastFiscalDocumentData(lastFiscalDocument),
});

const aggregatePayments = (arr) =>
  arr.reduce((acc, payment) => {
    if (acc[payment.payFormName]) {
      acc[payment.payFormName].sum += payment.sum;
    } else {
      acc[payment.payFormName] = payment;
    }
    return acc;
  }, {});

const aggregateTaxes = (arr) =>
  arr.reduce((acc, tax) => {
    if (acc[tax.program]) {
      acc[tax.program].sourceSum += tax.sourceSum || 0;
      acc[tax.program].sum += tax.sum || 0;
      acc[tax.program].turnover += tax.turnover || 0;
    } else {
      acc[tax.program] = tax;
    }
    return acc;
  }, {});

const sumFieldAcc = (xReportData, operationData) => {
  const isOperationInCents = operationData?.isInCents;
  const isXReportInCents = xReportData?.isInCents;
  const CENTS_IN_UAH = 100;
  switch (true) {
    case isXReportInCents && isOperationInCents: {
      return {
        isInCents: true,
        value: Math.round(xReportData.value + operationData.value),
      };
    }
    case !isXReportInCents && !isOperationInCents: {
      return roundWithPrecision((xReportData || 0) + operationData);
    }
    case isXReportInCents && !isOperationInCents: {
      return {
        isInCents: true,
        value: Math.round(xReportData.value + operationData * CENTS_IN_UAH),
      };
    }
    case !isXReportInCents && isOperationInCents: {
      return {
        isInCents: true,
        value: Math.round(
          (xReportData || 0) * CENTS_IN_UAH + operationData.value,
        ),
      };
    }
    default:
      console.error("Invalid xReportData or operationData ");
  }
  return xReportData ? xReportData + operationData : operationData;
};

const realizReturnFieldAcc = (xReportData, operationData) => {
  if (!operationData) return xReportData;
  if (!xReportData) return operationData;

  const totalReceiptCount =
    (xReportData.receiptCount || 0) + (operationData.receiptCount || 0);

  const paymentsMap = aggregatePayments([
    ...operationData.payments,
    ...xReportData.payments,
  ]);
  const taxesMap = aggregateTaxes([
    ...operationData.taxes,
    ...xReportData.taxes,
  ]);

  return {
    payments: Object.values(paymentsMap),
    receiptCount: totalReceiptCount,
    sum: sumFieldAcc(xReportData.sum || 0, operationData.sum || 0),
    taxes: Object.values(taxesMap),
  };
};
