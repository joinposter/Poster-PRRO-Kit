import {
  DOC_SUBTYPE_RETURN_SELL,
  DOC_SUBTYPE_SELL,
  DOC_TYPE_PRODUCT,
  PAYMENT_CODE_CARD,
  PAYMENT_CODE_CASH,
  PAYMENT_TYPE_TITLE_CARD,
  PAYMENT_TYPE_TITLE_CASH,
} from "../const/fiscal.js";
import {
  DOCUMENT_TYPE_RECEIPT,
  DOCUMENT_TYPE_RETURN_RECEIPT,
} from "../const/request.js";
import {
  cashSumDecimalRounding,
  formatToFixedDecimal,
} from "../../../helpers/round.js";
import {
  getDiscount,
  getDiscountTotal,
  getProductSum,
  getRoundedDiff,
  addNoTaxVATField,
  removeNoTaxVAT,
  removeNoVATPrograms,
} from "../helpers/xmlGenerator.js";
import {
  getCashboxFields,
  getCashierFields,
  getDateTimeFields,
  getDoctype,
  getDocumentNumberFields,
  getOfflineFields,
  getOrganizationFields,
  getRowNum,
  getTestingModeFields,
  getUIDFields,
  getVersionFields,
  rowsToMapper,
} from "./commonXMLTagGenerator.js";

const getPaymentDetails = (type) => {
  const paymentType = {
    cash: {
      PAYFORMCD: PAYMENT_CODE_CASH,
      PAYFORMNM: PAYMENT_TYPE_TITLE_CASH,
    },
    card: {
      PAYFORMCD: PAYMENT_CODE_CARD,
      PAYFORMNM: PAYMENT_TYPE_TITLE_CARD,
    },
  };
  return paymentType[type];
};

const getDiscountBlock = (product) => {
  const { discount } = product;
  if (discount) {
    return {
      DISCOUNTTYPE: 0,
      DISCOUNTSUM: formatToFixedDecimal(getDiscount(product)),
    };
  }
  return {};
};

const paymentMapper = (payment, index) => {
  const { PAYFORMCD, PAYFORMNM } = getPaymentDetails(payment.type);
  const SUM =
    PAYFORMNM === PAYMENT_TYPE_TITLE_CASH
      ? formatToFixedDecimal(cashSumDecimalRounding(payment.sum))
      : formatToFixedDecimal(payment.sum);

  return {
    $: getRowNum(index),
    PAYFORMCD,
    PAYFORMNM,
    SUM,
    PROVIDED: SUM,
  };
};

const productMapper = (products, index) => {
  const {
    id: CODE,
    taxPrograms,
    price,
    count: AMOUNT,
    uktzed,
    name: NAME,
    unit: UNITNM,
    noVatProgram,
    hasNoTaxVAT,
  } = products;

  let LETTERS = { LETTERS: taxPrograms };
  if (hasNoTaxVAT) {
    const letters = removeNoVATPrograms(taxPrograms, noVatProgram);
    LETTERS = letters?.length ? { LETTERS: letters } : {};
  }
  const PRICE = formatToFixedDecimal(price);
  const COST = formatToFixedDecimal(getProductSum(PRICE, AMOUNT));
  const UKTZED = uktzed ? { UKTZED: uktzed } : {};
  const DISCOUNTBLOCK = getDiscountBlock(products);

  return {
    $: getRowNum(index),
    CODE,
    ...UKTZED,
    NAME,
    UNITNM,
    AMOUNT,
    PRICE,
    ...LETTERS,
    COST,
    ...DISCOUNTBLOCK,
  };
};

const taxesMapper = (tax, index) => {
  const {
    sum,
    type: TYPE,
    name: NAME,
    program: LETTER,
    percent,
    turnover,
    // isExcise,
    // sourceSum,
  } = tax;

  // const TYPE = isExcise ? 1 : 0;
  const PRC = formatToFixedDecimal(percent);
  const TURNOVER = formatToFixedDecimal(turnover);
  const SUM = formatToFixedDecimal(sum);
  // const SOURCESUM = formatToFixedDecimal(sourceSum);

  return {
    $: getRowNum(index),
    TYPE,
    NAME,
    LETTER,
    PRC,
    TURNOVER,
    // SOURCESUM є не обов'язковим полем і ми вирішили його поки що не додавати
    // SOURCESUM,
    SUM,
  };
};

const isReceipt = (orderData) => orderData.type === DOCUMENT_TYPE_RECEIPT;
const isReturnReceipt = (item) => item.type === DOCUMENT_TYPE_RETURN_RECEIPT;

const getReceiptHeader = (operationData) => {
  const { cashboxData, dateTime } = operationData;
  const operationSum = getReceiptTotal(operationData).SUM;

  return {
    ...getTypeFields(operationData),
    ...getUIDFields(operationData),
    ...getOrganizationFields(cashboxData),
    ...getDateTimeFields(dateTime),
    ...getDocumentNumberFields(cashboxData),
    ...getCashboxFields(cashboxData),
    ...getReturnReceiptFields(operationData),
    ...getCashierFields(operationData),
    ...getVersionFields(),
    ...getOfflineFields({ operationData, operationSum }),
    ...getTestingModeFields(cashboxData),
  };
};

const getTypeFields = (orderData) =>
  getDoctype(
    DOC_TYPE_PRODUCT,
    isReceipt(orderData) ? DOC_SUBTYPE_SELL : DOC_SUBTYPE_RETURN_SELL,
  );

const getReturnReceiptFields = (orderData) => {
  const { documentFiscalId } = orderData;

  return documentFiscalId && isReturnReceipt(orderData)
    ? { ORDERRETNUM: documentFiscalId }
    : {};
};

const getReceiptTotal = (orderData) => {
  const roundDiff = getRoundedDiff(orderData);
  const discountTotal = getDiscountTotal(orderData.products);
  const DISCOUNTSUM = discountTotal
    ? { DISCOUNTSUM: formatToFixedDecimal(discountTotal) }
    : {};
  if (roundDiff) {
    return {
      SUM: formatToFixedDecimal(orderData.total - roundDiff),
      RNDSUM: formatToFixedDecimal(roundDiff),
      NORNDSUM: formatToFixedDecimal(orderData.total),
      ...DISCOUNTSUM,
    };
  }
  return {
    SUM: formatToFixedDecimal(orderData.total),
    ...DISCOUNTSUM,
  };
};

const getReceiptDocument = (data) => {
  const { products, payments, taxes } = data;
  const CHECKHEAD = getReceiptHeader(data);
  const CHECKTOTAL = getReceiptTotal(data);
  const CHECKPAY = rowsToMapper(payments, paymentMapper);
  const CHECKTAX = rowsToMapper(removeNoTaxVAT(taxes), taxesMapper);
  const CHECKBODY = rowsToMapper(
    addNoTaxVATField(products, taxes),
    productMapper,
  );

  return {
    CHECK: {
      CHECKHEAD,
      CHECKTOTAL,
      CHECKPAY,
      CHECKTAX,
      CHECKBODY,
    },
  };
};

export default getReceiptDocument;
