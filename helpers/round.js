import { DECIMAL_PLACES } from "../modules/XMLDocuments/const/fiscal.js";

export const formatToFixedDecimal = (sum) =>
  Number(sum).toFixed(DECIMAL_PLACES);

export const roundWithPrecision = (number, precision = 2) => {
  const NUMBER_OF_DECIMALS = 10;
  const FRAC_DIGITS = 3;
  const pow = NUMBER_OF_DECIMALS ** precision;
  const fixed = Number((number * pow).toFixed(FRAC_DIGITS));

  return Math.round(fixed) / pow;
};

export const decimalRoundingForCents = (number) => {
  const NUMBER_OF_DECIMALS = 10;
  const rounded = Math.round(number / NUMBER_OF_DECIMALS) * NUMBER_OF_DECIMALS;
  return rounded;
};

export const cashSumDecimalRounding = (cashSum) => {
  const MINIMAL_CASH_SUM = 10;
  const sum = decimalRoundingForCents(cashSum);
  return Math.max(sum, MINIMAL_CASH_SUM);
};
