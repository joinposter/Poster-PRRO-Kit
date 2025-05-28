import {
  DOC_SUBTYPE_RETURN_SELL,
  DOC_SUBTYPE_SELL,
  DOC_TYPE_PRODUCT,
  PAYMENT_CODE_CARD,
  PAYMENT_CODE_CASH,
  PAYMENT_TYPE_CARD,
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
  addVersionInEntities,
  getDiscount,
  getDiscountTotal,
  getProductSum,
  hasProductBarcode,
  hasProductMarking,
  updateProductsWithValidTaxes,
  updateTaxesWithValidVAT,
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
  convertKopecksToGrivnas,
  convertGramsToKg,
  getPaymentSum,
  getReceiptTotal,
  getTaxSum,
  getTaxTurnover,
  getTaxSourceSum,
  getTaxTurnoverDiscount,
  getRoundSum,
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

const getBarcodeBlock = (product) => {
  if (hasProductBarcode(product)) {
    const { barcodes } = product;
    return { BARCODE: barcodes.join(" ") };
  }
  return {};
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

const sumField = (sstData) =>
  sstData?.amount || sstData?.sum ? { SUM: sstData.amount || sstData.sum } : {};

const getPosTransDateField = ({ dateTime }) => {
  return dateTime ? { POSTRANSDATE: dateTime } : {};
};

const paySysMapper = (sstData, index) => {
  return {
    $: getRowNum(index),
    NAME: sstData.paymentSystem || sstData.paymentSystemName,
    ACQUIRENM: sstData.merchant || sstData.merchantId,
    ACQUIRETRANSID: sstData.rrn,
    ...getPosTransDateField(sstData),
    DEVICEID: sstData.terminalId || sstData.terminal,
    EPZDETAILS: sstData.pan || sstData.cardNumber,
    AUTHCD: sstData.authCode,
    ...sumField(sstData),
  };
};

const getPaySysBlock = (payment) => {
  if (!payment.sstData) {
    return {};
  }
  const sstData = Array.isArray(payment.sstData)
    ? payment.sstData
    : [payment.sstData];
  return { PAYSYS: rowsToMapper(sstData, paySysMapper) };
};

const paymentMapper = (payment, index) => {
  const { PAYFORMCD, PAYFORMNM } = getPaymentDetails(payment.type);
  const SUM =
    PAYFORMNM === PAYMENT_TYPE_TITLE_CASH
      ? formatToFixedDecimal(
          getPaymentSum({
            ...payment,
            sum: cashSumDecimalRounding(payment.sum),
          }),
        )
      : formatToFixedDecimal(getPaymentSum(payment));

  const PAYSYSBLOCK = getPaySysBlock(payment);

  // eslint-disable-next-line no-magic-numbers
  const PROVIDEDBLOCK = payment.version >= 3 ? {} : { PROVIDED: SUM };

  return {
    $: getRowNum(index),
    PAYFORMCD,
    PAYFORMNM,
    SUM,
    ...PROVIDEDBLOCK,
    ...PAYSYSBLOCK,
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
    unit,
    deleteEmptyTags,
  } = product;

  const LETTERS = taxPrograms ? { LETTERS: taxPrograms } : {};
  const PRICE = formatToFixedDecimal(convertKopecksToGrivnas(price));
  const AMOUNT = convertGramsToKg(count);
  const COST = formatToFixedDecimal(getProductSum(product));
  const BARCODEBLOCK = getBarcodeBlock(product);
  const UKTZED = uktzed ? { UKTZED: uktzed } : {};
  const UNITNM = !unit && deleteEmptyTags ? {} : { UNITNM: unit };
  const DISCOUNTBLOCK = getDiscountBlock(product);
  const EXCISELABELSBLOCK = getExciseLabelsBlock(product);

  return {
    $: getRowNum(index),
    CODE,
    ...BARCODEBLOCK,
    ...UKTZED,
    NAME,
    ...UNITNM,
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
  const TURNOVERDISCOUNT = formatToFixedDecimal(getTaxTurnoverDiscount(tax));
  const SUM = formatToFixedDecimal(getTaxSum(tax));
  const SOURCESUM = formatToFixedDecimal(getTaxSourceSum(tax));

  return {
    $: getRowNum(index),
    TYPE,
    NAME,
    LETTER,
    PRC,
    TURNOVER,
    TURNOVERDISCOUNT,
    SOURCESUM,
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
  const total = getReceiptTotal(orderData);
  const roundSum = getRoundSum(orderData);
  const discountTotal = getDiscountTotal(orderData.products);
  const DISCOUNTSUM = discountTotal
    ? { DISCOUNTSUM: formatToFixedDecimal(discountTotal) }
    : {};
  // Не використовуємо поки roundSum є складником discount поля, треба будет ПЕРЕРОБИТИ коли виправлять discount
  // Переробити - це не розраховувати самим, а акумулювати з полів продуктів
  // if (roundDiff) {
  //   return {
  //     SUM: formatToFixedDecimal(total),
  //     RNDSUM: formatToFixedDecimal(roundDiff),
  //     NORNDSUM: formatToFixedDecimal(total - roundDiff),
  //     ...DISCOUNTSUM,
  //   };
  // }
  const negativeMultiplier = -1;
  const ROUNDSUMBLOCK = roundSum
    ? {
        SUM: formatToFixedDecimal(total),
        RNDSUM: formatToFixedDecimal(negativeMultiplier * roundSum),
        NORNDSUM: formatToFixedDecimal(total - roundSum),
      }
    : {};

  return {
    SUM: formatToFixedDecimal(total),
    ...ROUNDSUMBLOCK,
    ...DISCOUNTSUM,
  };
};

const mixinSstDataToPayments = (payments, sstData) => {
  return payments.map((payment) => ({
    ...payment,
    ...(sstData && payment.type === PAYMENT_TYPE_CARD ? { sstData } : {}),
  }));
};

const getReceiptDocument = (data) => {
  const {
    products,
    payments,
    taxes,
    sstData,
    cashboxData,
    deleteEmptyTags,
    version = 0,
  } = data;
  const { VATTaxList } = cashboxData;
  const updatedTaxes = updateTaxesWithValidVAT(taxes, VATTaxList);
  const taxesWithVersion = addVersionInEntities(updatedTaxes, version);

  const productsWithTaxPrograms = updateProductsWithValidTaxes(
    products,
    VATTaxList,
  );
  const productsWithVersion = addVersionInEntities(
    productsWithTaxPrograms,
    version,
  );

  const paymentsWithSstData = mixinSstDataToPayments(payments, sstData);
  const paymentsWithVersion = addVersionInEntities(
    paymentsWithSstData,
    version,
  );

  const CHECKHEAD = getReceiptHeader(data);
  const CHECKTOTAL = getTotal(data);
  const CHECKPAY = rowsToMapper(paymentsWithVersion, paymentMapper);
  const CHECKBODY = rowsToMapper(productsWithVersion, productMapper);
  const CHECKTAX =
    deleteEmptyTags && taxesWithVersion.length === 0
      ? {}
      : { CHECKTAX: rowsToMapper(taxesWithVersion, taxesMapper) };

  return {
    CHECK: {
      CHECKHEAD,
      CHECKTOTAL,
      CHECKPAY,
      ...CHECKTAX,
      CHECKBODY,
    },
  };
};

export default getReceiptDocument;
