import {
  DOCUMENT_TYPE_RECEIPT,
  DOCUMENT_TYPE_RETURN_RECEIPT,
  PAYMENT_TYPE_CARD,
  PAYMENT_TYPE_CASH,
  RECEIPT_RETURN_TYPE,
  RECEIPT_TYPE,
} from "../const/receipt.js";
import {
  decimalRounding,
  formatToFixedDecimal,
  getDateTime,
} from "../../../helpers/common.js";
import defaultReceiptConfig from "../config/receipt.js";

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
    const roundedCashSum = cashSum && decimalRounding(cashSum);
    if (cashSum !== roundedCashSum) {
      roundDiff = cashSum - roundedCashSum;
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

  return {
    total: data.total,
    card: card ? formatToFixedDecimal(card) : null,
    cash: cash ? formatToFixedDecimal(cash) : null,
    taxes: data.taxes
      .sort((a, b) => a.type - b.type)
      .map((tax) => ({
        name: expandedTaxesName(tax),
        value: tax.sum,
        program: tax.program,
      })),
  };
};

export const isFiscalReceiptReturnType = (type) =>
  type === DOCUMENT_TYPE_RETURN_RECEIPT;

const getRoundReceiptData = (data) => {
  const isReturnType = isFiscalReceiptReturnType(data.type);
  const roundDiff = getRoundedDiff(data);
  return roundDiff
    ? [
        {
          name: isReturnType ? "До повернення" : "До сплати",
          value: formatToFixedDecimal(data.total - roundDiff),
        },
        {
          name: "Заокруглення",
          value: formatToFixedDecimal(Math.abs(roundDiff)),
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
  cashbox,
  isCashboxModeOffline,
  docType,
  software,
}) => ({
  fiscalId,
  dateTime: getDateTime({ date: dateTime }),
  cashbox,
  isCashboxModeOffline,
  docType,
  software,
});

const getSstData = ({ sstData, type }) => {
  if (!sstData) return null;
  return {
    bank: sstData.bankAcquirer,
    terminal: sstData.terminalId,
    actionType: getReceiptType(type),
    paymentSystem: sstData.paymentSystemName,
    cardNumber: sstData.pan,
    authCode: sstData.authCode,
    rrn: sstData.rrn,
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
  productsData: data.products.map((product) => ({
    uktzed: getProductUktzed(product.name),
    barcodes: product.barcodes?.join(" ") || null,
    exciseStamp: product.marking?.join(" ") || null,
    name: getProductName(product.name),
    count: product.count,
    price: product.price,
    taxPrograms: product.taxPrograms,
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
  }),
  receiptConfig: data.receiptConfig || defaultReceiptConfig,
});

export const getCashboxStatus = ({ footerData: { isCashboxModeOffline } }) =>
  isCashboxModeOffline ? "ОФФЛАЙН" : "ОНЛАЙН";

export const getControlSum = ({ isCashboxModeOffline, fiscalId }) => {
  if (isCashboxModeOffline && fiscalId) {
    return fiscalId?.toString()?.split(".")?.pop();
  }
  return null;
};
