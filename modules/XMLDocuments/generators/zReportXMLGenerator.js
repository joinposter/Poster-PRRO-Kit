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
import {
  addVersionInArray,
  addVersionInObject,
  getVersion2SpecificFields,
} from "../../hook/turnoverDiscountSupporting.js";

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
  const { type: TYPE, name: NAME, program: LETTER, percent, version } = tax;

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
    ...getVersion2SpecificFields(version, { TURNOVERDISCOUNT, SOURCESUM }),
    SUM,
  };
};

const getZReportPaymentsAndTaxes = (data) => {
  if (!data) {
    return null;
  }
  const { sum, receiptCount: ORDERSCNT, payments, taxes, version } = data;

  const sortedPayments = [...payments].sort(sortByPayFormCode);
  const sortedTaxes = [...taxes].sort(sortByProgram);
  const PAYFORMS = rowsToMapper(sortedPayments, paymentMapper);

  const updatedTaxes = addVersionInArray(version, sortedTaxes);

  const TAXES = sortedTaxes.length
    ? { TAXES: rowsToMapper(updatedTaxes, taxesMapper) }
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

const getZReportBody = ({ serviceInput, serviceOutput }) => {
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
  const ZREPHEAD = getHeader(data);
  const zRepRealiz = data.realiz
    ? {
        ZREPREALIZ: getZReportPaymentsAndTaxes(
          addVersionInObject(data.shiftOpenData?.version, data.realiz),
        ),
      }
    : {};
  const zRepReturn = data.return
    ? {
        ZREPRETURN: getZReportPaymentsAndTaxes(
          addVersionInObject(data.shiftOpenData?.version, data.return),
        ),
      }
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
