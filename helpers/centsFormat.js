import { roundWithPrecision } from "./round.js";

const CENTS_IN_UAH = 100;
const GRAMS_IN_KG = 1000;
export const getReceiptTotal = (data) =>
  data.total?.isInCents ? data.total.sum / CENTS_IN_UAH : data.total;

export const getProductCount = (product) =>
  product.count / (product.isInCentsAndGrams ? GRAMS_IN_KG : 1);

export const getProductPrice = (product) =>
  product.price / (product.isInCentsAndGrams ? CENTS_IN_UAH : 1);

export const getProductDiscount = (product) =>
  product.discount / (product.isInCentsAndGrams ? CENTS_IN_UAH : 1);

export const getProductRoundSum = (product) =>
  product.roundSum / (product.isInCentsAndGrams ? CENTS_IN_UAH : 1);

export const getCalculatedTurnover = (product) =>
  product.isInCentsAndGrams
    ? (product.count / GRAMS_IN_KG) * product.price
    : product.count * product.price;

export const getCalculatedSourceSum = (product) =>
  product.discount ? product.turnover - product.discount : product.turnover;

export const getAccumulatedTaxValue = (isInCentsAndGrams, value) =>
  isInCentsAndGrams ? Math.round(value) : roundWithPrecision(value);

export const getTotalDiscount = (isInCents, discount) =>
  discount / (isInCents ? CENTS_IN_UAH : 1);

export const getPaymentSum = (payment) =>
  payment?.isInCents ? payment.sum / CENTS_IN_UAH : payment?.sum;

export const getTaxTurnover = (tax) =>
  tax.isInCentsAndGrams ? tax.turnover / CENTS_IN_UAH : tax.turnover;

export const getTaxSum = (tax) =>
  tax.isInCentsAndGrams ? tax.sum / CENTS_IN_UAH : tax.sum;

export const getTaxSourceSum = (tax) =>
  tax.isInCentsAndGrams ? tax.sourceSum / CENTS_IN_UAH : tax.sourceSum;

export const getData = (isInCents, data) =>
  isInCents ? data / CENTS_IN_UAH : data;
