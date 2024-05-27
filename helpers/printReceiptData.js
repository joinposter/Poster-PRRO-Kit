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
} from "./common.js";
import receiptConfig from "../config/receiptConfig.js";

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

  const rowCash = data.payments.find(findCashPayment)?.sum;
  const cash = rowCash ? rowCash - getRoundedDiff(data) : null;

  return {
    total: data.total,
    card: card ? formatToFixedDecimal(card) : null,
    cash: cash ? formatToFixedDecimal(cash) : null,
    taxes: data.taxes.map((tax) => ({
      name: expandedTaxesName(tax),
      value: tax.sum,
      program: tax.program,
    })),
  };
};

const getRoundReceiptData = (data) => {
  const roundDiff = getRoundedDiff(data);
  return roundDiff
    ? [
        {
          name: "До сплати",
          value: formatToFixedDecimal(data.total - roundDiff),
        },
        { name: "Заокруглення", value: formatToFixedDecimal(roundDiff) },
      ]
    : null;
};

const getReceiptType = (type) => {
  if (type === DOCUMENT_TYPE_RECEIPT) return RECEIPT_TYPE;
  if (type === DOCUMENT_TYPE_RETURN_RECEIPT) return RECEIPT_RETURN_TYPE;
  return null;
};

const getFooterData = ({
  dfsDocumentFiscalId,
  dateTime,
  cashbox,
  status,
  docType,
  software,
}) => ({
  dfsDocumentFiscalId,
  dateTime: getDateTime({ date: dateTime }),
  cashbox,
  status,
  docType,
  software,
});

const getQrCodeData = ({ dfsDocumentFiscalId, cashbox, total, dateTime }) => ({
  dfsDocumentFiscalId,
  cashbox,
  total,
  date: getDateTime({ date: dateTime, format: "date" }),
  time: getDateTime({ date: dateTime, format: "time" }),
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

export const prepareDataForTextPrintReceipt = (data) => ({
  dfsDocumentFiscalId: data.dfsDocumentFiscalId,
  dateTime: getDateTime({ data: data.dateTime }),
  cashboxData: data.cashboxData,
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
    status: "ОНЛАЙН",
    docType: "ФІСКАЛЬНИЙ ЧЕК",
    software: "Poster POS",
  }),
  qrCodeData: getQrCodeData(data),
  receiptConfig: data.receiptConfig || receiptConfig,
});
