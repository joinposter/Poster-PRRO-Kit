import { getHeader, getRowNum, rowsToMapper } from "./commonXMLTagGenerator.js";
import { formatToFixedDecimal } from "../../../helpers/round.js";

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
    type: TYPE,
    name: NAME,
    program: LETTER,
    percent,
    turnover,
    sourceSum,
  } = tax;

  const PRC = formatToFixedDecimal(percent);
  const TURNOVER = formatToFixedDecimal(turnover);
  const SUM = formatToFixedDecimal(sum);
  const SOURCESUM =
    turnover - sourceSum ? { SOURCESUM: formatToFixedDecimal(sourceSum) } : {};

  return {
    $: getRowNum(index),
    TYPE,
    NAME,
    LETTER,
    PRC,
    TURNOVER,
    ...SOURCESUM,
    SUM,
  };
};

const getZReportPaymentsAndTaxes = (data) => {
  if (!data) {
    return null;
  }
  const { sum, receiptCount: ORDERSCNT, payments, taxes } = data;
  const PAYFORMS = rowsToMapper(payments, paymentMapper);
  const TAXES = rowsToMapper(taxes, taxesMapper);
  const SUM = formatToFixedDecimal(sum);

  return {
    SUM,
    ORDERSCNT,
    PAYFORMS,
    TAXES,
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
