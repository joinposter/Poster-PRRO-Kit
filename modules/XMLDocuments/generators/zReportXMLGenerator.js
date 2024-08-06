import { getHeader, getRowNum, rowsToMapper } from "./commonXMLTagGenerator.js";
import { formatToFixedDecimal } from "../../../helpers/round.js";
import { removeNoTaxVAT } from "../helpers/xmlGenerator.js";

const paymentMapper = (payment, index) => {
  const PAYFORMCD = payment.payFormCode;
  const PAYFORMNM = payment.payFormName;
  const SUM = formatToFixedDecimal(payment.sum);

  return {
    $: getRowNum(index),
    PAYFORMCD,
    PAYFORMNM,
    SUM,
  };
};

const taxesMapper = (tax, index) => {
  const {
    sum,
    name: NAME,
    program: LETTER,
    percent,
    turnover,
    isExcise,
    // sourceSum,
  } = tax;

  const PRC = formatToFixedDecimal(percent);
  const TURNOVER = formatToFixedDecimal(turnover);
  const SUM = formatToFixedDecimal(sum);
  const TYPE = isExcise ? 1 : 0;
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

const getZReportPaymentsAndTaxes = (data) => {
  if (!data) {
    return null;
  }
  const { sum, receiptCount: ORDERSCNT, payments, taxes } = data;
  const PAYFORMS = rowsToMapper(payments, paymentMapper);
  const TAXES = removeNoTaxVAT(taxes).length
    ? { TAXES: rowsToMapper(removeNoTaxVAT(taxes), taxesMapper) }
    : {};
  const SUM = formatToFixedDecimal(sum);

  return {
    SUM,
    ORDERSCNT,
    PAYFORMS,
    ...TAXES,
  };
};

const getZReportBody = ({ serviceInput, serviceOutput }) => ({
  SERVICEINPUT: formatToFixedDecimal(serviceInput),
  SERVICEOUTPUT: formatToFixedDecimal(serviceOutput),
});

const getZReportDocument = (data) => {
  const ZREPHEAD = getHeader(data);
  const zRepRealiz = data.realiz
    ? { ZREPREALIZ: getZReportPaymentsAndTaxes(data.realiz) }
    : {};
  const zRepReturn = data.return
    ? { ZREPRETURN: getZReportPaymentsAndTaxes(data.return) }
    : {};
  const ZREPBODY = getZReportBody(data);

  return {
    ZREP: {
      ZREPHEAD,
      ...zRepRealiz,
      ...zRepReturn,
      ZREPBODY,
    },
  };
};

export default getZReportDocument;
