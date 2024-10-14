import { CENTS_IN_UAH, GRAMS_IN_KG } from "../../helpers/centsFormat.js";
import { PAYMENT_TYPE_CASH } from "../../const/types.js";

const getRules = (validationRules, path) => {
  let rulePath = path;
  const arrayIndexPattern = /\[\d+\]/g;
  const isArrayIndexPath = arrayIndexPattern.test(path);

  if (!validationRules[path] && isArrayIndexPath) {
    rulePath = path.replace(arrayIndexPattern, "[]");
  }

  // Якщо такого правила по шляху не існує і шлях містить індекси масиву (наприклад, foo.bar[2]),
  // замінюємо на foo.bar[] для використання загального правила
  if (!validationRules[path] && isArrayIndexPath) {
    rulePath = path.replace(arrayIndexPattern, "[]");
  }

  return validationRules[rulePath];
};

const checkValue = (value, currentPath, rules) =>
  rules.reduce((acc, rule) => {
    const isValid = rule(value);
    if (!isValid) {
      return {
        ...acc,
        [currentPath]: [
          ...(acc[currentPath] || []),
          `Invalid value for ${currentPath}`,
        ],
      };
    }
    return acc;
  }, {});

const checkArrayOfValues = (value, currentPath, validationRules) =>
  value.reduce(
    (acc, item, index) => ({
      ...acc,
      ...createValidator(validationRules)(item, `${currentPath}[${index}]`)
        .errors,
    }),
    {},
  );

const checkObjectOfValues = (value, currentPath, validationRules) =>
  createValidator(validationRules)(value, currentPath).errors;

export const createValidator =
  (validationRules) =>
  (data, path = "") => {
    // Якщо є ключ з порожнім рядком, застосовуємо перевірки до всього об'єкта data
    if (validationRules[""] && path === "") {
      const hasInvalidRule = validationRules[""].some((rule) => !rule(data));
      if (hasInvalidRule) {
        return { valid: false, errors: { "": ["Invalid input data"] } };
      }
    }

    const errors = Object.entries(data).reduce((acc, [key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      const rules = getRules(validationRules, currentPath);
      let currentErrors = {};
      if (rules) {
        currentErrors = checkValue(value, currentPath, rules);
        return { ...acc, ...currentErrors };
      }

      if (Array.isArray(value)) {
        currentErrors = checkArrayOfValues(value, currentPath, validationRules);
      } else if (typeof value === "object" && value !== null) {
        currentErrors = checkObjectOfValues(
          value,
          currentPath,
          validationRules,
        );
      }
      return { ...acc, ...currentErrors };
    }, {});

    return Object.keys(errors).length
      ? { valid: false, errors }
      : { valid: true, errors: null };
  };

export const isNumber = (value) =>
  typeof value === "number" && !Number.isNaN(value);
export const isNotZero = (value) => value !== 0;
// eslint-disable-next-line no-magic-numbers
export const isMultiplesOf10 = (value) => value % 10 === 0;
export const isArray = (value) => Array.isArray(value);
export const isNonEmptyArray = (value) =>
  Array.isArray(value) && value.length > 0;
export const isNonEmptyObject = (value) =>
  typeof value === "object" && value !== null && Object.keys(value).length > 0;

export const equals = (value1, value2) => value1 === value2;

export const isPaymentByCashMultipleOf10 = (payments) =>
  isMultiplesOf10(
    Math.round(
      payments.find((p) => p.type === PAYMENT_TYPE_CASH)
        ? payments.find((p) => p.type === PAYMENT_TYPE_CASH).sum * CENTS_IN_UAH
        : 0,
    ),
  );

const getTotalByProducts = ({ products }) =>
  products?.reduce(
    (acc, product) =>
      acc +
      Math.round(
        (product.price * CENTS_IN_UAH * (product.count * GRAMS_IN_KG)) /
          GRAMS_IN_KG,
      ) +
      Math.round(product.discount * CENTS_IN_UAH || 0),
    0,
  );

const getTotalByPayments = ({ payments }) =>
  payments?.reduce(
    (acc, payment) => acc + Math.round(payment.sum * CENTS_IN_UAH),
    0,
  );

export const isReceiptTotalValid = (receiptData) => {
  const totalByProducts = getTotalByProducts(receiptData);
  const totalByPayments = getTotalByPayments(receiptData);
  return equals(totalByProducts, totalByPayments);
};
