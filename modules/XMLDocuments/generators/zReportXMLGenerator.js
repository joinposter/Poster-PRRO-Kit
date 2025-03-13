import { getHeader, getRowNum, rowsToMapper } from "./commonXMLTagGenerator.js";
import { formatToFixedDecimal } from "../../../helpers/round.js";
import {
  convertKopecksToGrivnas,
  getPaymentSum,
  getTaxSourceSum,
  getTaxSum,
  getTaxTurnover,
  getTaxTurnoverDiscount,
} from "../../../helpers/centsFormat.js";
import { sortByProgram, sortByPayFormCode } from "../../../helpers/common.js";
import { addVersionInEntities } from "../helpers/xmlGenerator.js";

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
  const TURNOVERDISCOUNT = formatToFixedDecimal(getTaxTurnoverDiscount(tax));
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

const getZReportPaymentsAndTaxes = (data) => {
  if (!data) {
    return null;
  }
  const { sum, receiptCount: ORDERSCNT, payments, taxes, version } = data;

  const sortedPayments = [...payments].sort(sortByPayFormCode);
  const paymentsWithVersion = addVersionInEntities(sortedPayments, version);
  const PAYFORMS = rowsToMapper(paymentsWithVersion, paymentMapper);

  const sortedTaxes = [...taxes].sort(sortByProgram);
  const taxesWithVersion = addVersionInEntities(sortedTaxes, version);
  const TAXES = taxesWithVersion.length
    ? { TAXES: rowsToMapper(taxesWithVersion, taxesMapper) }
    : {};

  const currentSum = convertKopecksToGrivnas(sum);
  const SUM = formatToFixedDecimal(currentSum);

  return {
    SUM,
    ORDERSCNT,
    PAYFORMS,
    ...TAXES,
  };
};

const getZReportBody = ({ serviceInput, serviceOutput, version }) => {
  const serviceInputData = serviceInput?.sum || 0;
  const serviceOutputData = serviceOutput?.sum || 0;

  return {
    SERVICEINPUT: formatToFixedDecimal(
      convertKopecksToGrivnas(serviceInputData),
    ),
    SERVICEOUTPUT: formatToFixedDecimal(
      convertKopecksToGrivnas(serviceOutputData),
    ),
  };
};

const getZReportDocument = (data) => {
  const { version = 0, ...rest } = data;
  const ZREPHEAD = getHeader(rest);
  const zRepRealiz = rest.realiz
    ? {
        ZREPREALIZ: getZReportPaymentsAndTaxes({
          ...rest.realiz,
          version,
        }),
      }
    : {};
  const zRepReturn = rest.return
    ? {
        ZREPRETURN: getZReportPaymentsAndTaxes({
          ...rest.return,
          version,
        }),
      }
    : {};
  const ZREPBODY = getZReportBody({ ...rest, version });

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
