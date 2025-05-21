import {
  DOCUMENT_TYPE_RECEIPT,
  DOCUMENT_TYPE_RETURN_RECEIPT,
  PAYMENT_TYPE_CARD,
  PAYMENT_TYPE_CASH,
  PAYMENT_TYPE_TITLE_CASH,
  RECEIPT_RETURN_TYPE,
  RECEIPT_TYPE,
} from "../const/receipt.js";
import {
  formatToFixedDecimal,
  getDateTime,
  sortByProgram,
} from "../../../helpers/common.js";
import defaultReceiptConfig from "../config/receipt.js";
import {
  convertKopecksToGrivnas,
  getReceiptTotal,
  getTaxSum,
} from "../../../helpers/centsFormat.js";

const getProductUktzed = (name) =>
  name.includes("#") ? `${name.split("#")[0]}` : null;

const getProductName = (name) =>
  name.includes("#") ? name.split("#")[1] : name;

export const findCashPayment = (payment) => payment.type === PAYMENT_TYPE_CASH;

export const findCardPayment = (payment) => payment.type === PAYMENT_TYPE_CARD;

const expandedTaxesName = (tax) =>
  tax.percent === null
    ? `Без ПДВ ${tax.program}`
    : `${tax.name} ${tax.program} ${tax.percent}%`;

const getTaxesData = (data) => {
  const cardSum = data.payments.find(findCardPayment)?.sum;
  const cashSum = data.payments.find(findCashPayment)?.sum;

  return {
    total: getReceiptTotal(data),
    card: cardSum
      ? formatToFixedDecimal(convertKopecksToGrivnas(cardSum))
      : null,
    cash: cashSum
      ? formatToFixedDecimal(convertKopecksToGrivnas(cashSum))
      : null,
    taxes: [...data.taxes].sort(sortByProgram).map((tax) => ({
      name: expandedTaxesName(tax),
      value: getTaxSum(tax),
      program: tax.program,
    })),
  };
};

export const isFiscalReceiptReturnType = (type) =>
  type === DOCUMENT_TYPE_RETURN_RECEIPT;

const getRoundReceiptData = (data) => {
  const isReturnType = isFiscalReceiptReturnType(data.type);
  const total = getReceiptTotal(data);
  return [
    {
      name: isReturnType ? "До повернення" : "До сплати",
      value: formatToFixedDecimal(total),
    },
    !isReturnType && !!data.payments.find(findCashPayment)
      ? {
          name: "Решта",
          value: formatToFixedDecimal(0),
        }
      : null,
  ].filter(Boolean);
};

const getReceiptType = (type) => {
  if (type === DOCUMENT_TYPE_RECEIPT) return RECEIPT_TYPE;
  if (type === DOCUMENT_TYPE_RETURN_RECEIPT) return RECEIPT_RETURN_TYPE;
  return null;
};

const getFooterData = ({
  fiscalId,
  dateTime,
  cashboxData: { cashbox },
  isOffline,
  docType,
  software,
  dFSReceiptLink,
}) => ({
  fiscalId,
  dateTime: getDateTime({ date: dateTime }),
  cashbox,
  isOffline,
  docType,
  software,
  dFSReceiptLink,
});

const getSstData = ({ sstData, type }) => {
  if (!sstData) return null;
  return {
    bank: sstData?.bankAcquirer,
    terminal: sstData?.terminalId,
    actionType: getReceiptType(type),
    paymentSystem: sstData?.paymentSystemName,
    cardNumber: sstData?.pan,
    authCode: sstData?.authCode,
    rrn: sstData?.rrn,
  };
};

export const prepareDataForPrintReceipt = (data) => ({
  qrOptions: data.qrOptions,
  fiscalId: data.fiscalId,
  dateTime: getDateTime({ date: data.dateTime }),
  cashboxData: data.cashboxData,
  cashier: data.cashier,
  type: data.type,
  headerServiceData: data.headerServiceData,
  productsData: data.products.map((product) => ({
    uktzed: getProductUktzed(product.name),
    barcodes: product.barcodes?.join(" ") || null,
    exciseStamp: product.marking?.join(" ") || null,
    name: getProductName(product.name),
    count: product.count,
    price: product.price,
    taxPrograms: product.taxPrograms,
    discount: product.discount,
  })),
  taxesData: getTaxesData(data),
  roundData: getRoundReceiptData(data),
  sstData: getSstData(data),
  footerData: getFooterData({
    ...data,
    docType: isFiscalReceiptReturnType(data.type)
      ? "ВИДАТКОВИЙ ЧЕК"
      : "ФІСКАЛЬНИЙ ЧЕК",
    software: "Poster POS",
    dFSReceiptLink: data.fiscalLink,
  }),
  footerServiceData: data.footerServiceData,
  receiptConfig: data.receiptConfig || defaultReceiptConfig,
});

export const getCashboxStatus = (data) =>
  data.footerData.isOffline ? "ОФЛАЙН" : "ОНЛАЙН";

export const getCashboxInfo = (data) => `ФН ПРРО ${data.cashboxData.cashbox}`;

export const getControlSum = ({ isOffline, fiscalId }) => {
  if (isOffline && fiscalId) {
    return fiscalId?.toString()?.split(".")?.pop();
  }
  return null;
};

export const findCashPaymentData = (p) =>
  p.payFormName === PAYMENT_TYPE_TITLE_CASH;
