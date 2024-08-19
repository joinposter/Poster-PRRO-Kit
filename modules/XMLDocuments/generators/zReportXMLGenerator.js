import { getHeader, getRowNum, rowsToMapper } from "./commonXMLTagGenerator.js";
import { formatToFixedDecimal } from "../../../helpers/round.js";
import {
  getData,
  getPaymentSum,
  getTaxSum,
  getTaxTurnover,
} from "../../../helpers/centsFormat.js";

const paymentMapper = (payment, index) => {
  const PAYFORMCD = payment.payFormCode;
  const PAYFORMNM = payment.payFormName;
  const SUM = formatToFixedDecimal(getPaymentSum(payment));

  return {
    $: getRowNum(index),
    PAYFORMCD,
    PAYFORMNM,
    SUM,
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

const getZReportPaymentsAndTaxes = (data) => {
  if (!data) {
    return null;
  }
  const { sum, receiptCount: ORDERSCNT, payments, taxes } = data;
  const PAYFORMS = rowsToMapper(payments, paymentMapper);
  const TAXES = taxes.length ? { TAXES: rowsToMapper(taxes, taxesMapper) } : {};
  const currentSum = getData(sum?.isInCents, sum?.isInCents ? sum.value : sum);
  const SUM = formatToFixedDecimal(currentSum);

  return {
    SUM,
    ORDERSCNT,
    PAYFORMS,
    ...TAXES,
  };
};

const getZReportBody = ({ serviceInput, serviceOutput }) => ({
  SERVICEINPUT: formatToFixedDecimal(
    getData(
      serviceInput?.isInCents,
      serviceInput?.isInCents ? serviceInput.value : serviceInput,
    ),
  ),
  SERVICEOUTPUT: formatToFixedDecimal(
    getData(
      serviceOutput?.isInCents,
      serviceOutput?.isInCents ? serviceOutput.value : serviceOutput,
    ),
  ),
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
