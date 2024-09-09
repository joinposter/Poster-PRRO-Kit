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
  hasProductMarking,
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
import {
  getData,
  getPaymentSum,
  getProductCount,
  getProductPrice,
  getReceiptTotal,
  getTaxSum,
  getTaxTurnover,
  getTotalDiscount,
} from "../../../helpers/centsFormat.js";

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

const getExciseLabelsBlock = (product) => {
  if (hasProductMarking(product)) {
    const { marking } = product;
    return { EXCISELABELS: rowsToMapper(marking, exciseLabelMapper) };
  }
  return {};
};

const exciseLabelMapper = (exciseLabel, index) => {
  return {
    $: getRowNum(index),
    EXCISELABEL: exciseLabel,
  };
};

const paymentMapper = (payment, index) => {
  const { PAYFORMCD, PAYFORMNM } = getPaymentDetails(payment.type);
  const SUM =
    PAYFORMNM === PAYMENT_TYPE_TITLE_CASH
      ? formatToFixedDecimal(
          getPaymentSum({
            ...payment,
            sum: cashSumDecimalRounding(payment.sum, payment.isInCents),
          }),
        )
      : formatToFixedDecimal(getPaymentSum(payment));

  return {
    $: getRowNum(index),
    PAYFORMCD,
    PAYFORMNM,
    SUM,
    PROVIDED: SUM,
  };
};

const productMapper = (product, index) => {
  const {
    id: CODE,
    taxPrograms,
    price,
    count,
    uktzed,
    name: NAME,
    unit: UNITNM,
    isInCentsAndGrams,
  } = product;

  const LETTERS = taxPrograms?.length ? { LETTERS: taxPrograms } : {};
  const PRICE = formatToFixedDecimal(
    getProductPrice({ isInCentsAndGrams, price }),
  );
  const AMOUNT = getProductCount({ isInCentsAndGrams, count });
  const COST = formatToFixedDecimal(getProductSum(product));
  const UKTZED = uktzed ? { UKTZED: uktzed } : {};
  const DISCOUNTBLOCK = getDiscountBlock(product);
  const EXCISELABELSBLOCK = getExciseLabelsBlock(product);

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
    ...EXCISELABELSBLOCK,
  };
};

const taxesMapper = (tax, index) => {
  const { type: TYPE, name: NAME, program: LETTER, percent } = tax;

  const PRC = formatToFixedDecimal(percent);
  const TURNOVER = formatToFixedDecimal(getTaxTurnover(tax));

  const SUM = formatToFixedDecimal(getTaxSum(tax));
  // const SOURCESUM = formatToFixedDecimal(getTaxSourceSum(tax));

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
  const operationSum = getTotal(operationData).SUM;

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

const getTotal = (orderData) => {
  const isInCents = !!orderData.total?.isInCents;
  const total = getReceiptTotal(orderData);
  const roundDiff = getData(isInCents, getRoundedDiff(orderData));
  const discountTotal = getTotalDiscount(
    isInCents,
    getDiscountTotal(orderData.products),
  );
  const DISCOUNTSUM = discountTotal
    ? { DISCOUNTSUM: formatToFixedDecimal(discountTotal) }
    : {};
  if (roundDiff) {
    return {
      SUM: formatToFixedDecimal(total),
      RNDSUM: formatToFixedDecimal(roundDiff),
      NORNDSUM: formatToFixedDecimal(total),
      ...DISCOUNTSUM,
    };
  }
  return {
    SUM: formatToFixedDecimal(total),
    ...DISCOUNTSUM,
  };
};

const getReceiptDocument = (data) => {
  const { products, payments, taxes } = data;
  const CHECKHEAD = getReceiptHeader(data);
  const CHECKTOTAL = getTotal(data);
  const CHECKPAY = rowsToMapper(payments, paymentMapper);
  const CHECKTAX = rowsToMapper(taxes, taxesMapper);
  const CHECKBODY = rowsToMapper(products, productMapper);

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
