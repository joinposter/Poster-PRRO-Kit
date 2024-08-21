import {
  DOCUMENT_TYPE_RECEIPT,
  DOCUMENT_TYPE_RETURN_RECEIPT,
  PAYMENT_TYPE_CARD,
  PAYMENT_TYPE_CASH,
  PAYMENT_TYPE_TITLE_CASH,
  RECEIPT_RETURN_TYPE,
  RECEIPT_TYPE,
} from "../const/receipt.js";
import { formatToFixedDecimal, getDateTime } from "../../../helpers/common.js";
import { cashSumDecimalRounding } from "../../../helpers/round.js";
import defaultReceiptConfig from "../config/receipt.js";
import {
  getData,
  getReceiptTotal,
  getTaxSum,
} from "../../../helpers/centsFormat.js";

const getProductUktzed = (name) =>
  name.includes("#") ? `${name.split("#")[0]}#` : null;

const getProductName = (name) =>
  name.includes("#") ? name.split("#")[1] : name;

export const findCashPayment = (payment) => payment.type === PAYMENT_TYPE_CASH;

export const findCardPayment = (payment) => payment.type === PAYMENT_TYPE_CARD;

const getRoundedDiff = (item, type = PAYMENT_TYPE_CASH) => {
  let roundDiff = 0;
  if (type === PAYMENT_TYPE_CASH) {
    const cashSum = item.payments.find(findCashPayment)?.sum;
    const isInCents = item.payments.find(findCashPayment)?.isInCents;
    const roundedCashSum =
      cashSum && cashSumDecimalRounding(cashSum, isInCents);
    if (cashSum !== roundedCashSum) {
      roundDiff = getData(isInCents, cashSum - roundedCashSum);
    }
  }
  return roundDiff;
};

const expandedTaxesName = (tax) => {
  return `${tax.name} ${tax.program} ${tax.percent}%`;
};

const getTaxesData = (data) => {
  const card = data.payments.find(findCardPayment)?.sum;
  const cash = data.payments.find(findCashPayment)?.sum;
  const isInCents =
    data.payments.find(findCardPayment)?.isInCents ||
    data.payments.find(findCashPayment)?.isInCents;

  return {
    total: getReceiptTotal(data),
    card: card ? formatToFixedDecimal(getData(isInCents, card)) : null,
    cash: cash ? formatToFixedDecimal(getData(isInCents, cash)) : null,
    taxes: data.taxes
      .sort((a, b) => a.type - b.type)
      .map((tax) => ({
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
  const roundDiff = getRoundedDiff(data);
  const total = getReceiptTotal(data);
  return roundDiff
    ? [
        {
          name: isReturnType ? "До повернення" : "До сплати",
          value: formatToFixedDecimal(total - roundDiff),
        },
        {
          name: "Заокруглення",
          value: formatToFixedDecimal(roundDiff),
        },
      ]
    : null;
};

const getReceiptType = (type) => {
  if (type === DOCUMENT_TYPE_RECEIPT) return RECEIPT_TYPE;
  if (type === DOCUMENT_TYPE_RETURN_RECEIPT) return RECEIPT_RETURN_TYPE;
  return null;
};

const getFooterData = ({
  fiscalId,
  dateTime,
  cashboxData: { isOffline, cashbox },
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
    cashier: ".............",
    holder: ".............",
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
    isInCentsAndGrams: product.isInCentsAndGrams,
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

export const getCashboxStatus = ({ footerData: { isOffline } }) =>
  isOffline ? "ОФЛАЙН" : "ОНЛАЙН";

export const getControlSum = ({ isOffline, fiscalId }) => {
  if (isOffline && fiscalId) {
    return fiscalId?.toString()?.split(".")?.pop();
  }
  return null;
};

export const findCashPaymentData = (p) =>
  p.payFormName === PAYMENT_TYPE_TITLE_CASH;
