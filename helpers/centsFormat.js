export const CENTS_IN_UAH = 100;
export const GRAMS_IN_KG = 1000;
export const getReceiptTotal = (data) => data.total / CENTS_IN_UAH;
export const getRoundSum = (data) =>
  data.roundSum ? data.roundSum / CENTS_IN_UAH : 0;

export const getProductCount = (product) => product.count / GRAMS_IN_KG;

export const getProductPrice = (product) => product.price / CENTS_IN_UAH;

export const getProductDiscount = (product) => product.discount / CENTS_IN_UAH;

export const getCalculatedTurnover = (product) =>
  Math.round((product.count * product.price) / GRAMS_IN_KG);

export const getCalculatedTurnoverDiscount = (product) =>
  product.turnover - product.discount;

// Дефолтне значення sourceSum є turnoverDiscount, далі для VAT воно буде перерозраховано
export const getCalculatedSourceSum = (product) => product.turnoverDiscount;

export const getPaymentSum = (payment) => payment.sum / CENTS_IN_UAH;

export const getPaymentReceiptCount = (payment) => payment?.receiptCount;

export const getTaxTurnover = (tax) => tax.turnover / CENTS_IN_UAH;
export const getTaxTurnoverDiscount = (tax) =>
  tax.turnoverDiscount / CENTS_IN_UAH;

export const getTaxSum = (tax) => tax.sum / CENTS_IN_UAH;

export const getTaxSourceSum = (tax) => tax.sourceSum / CENTS_IN_UAH;
export const convertKopecksToGrivnas = (data) => data / CENTS_IN_UAH;

export const convertGramsToKg = (data) => data / GRAMS_IN_KG;
