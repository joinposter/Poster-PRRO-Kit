import { GRAMS_IN_KG } from "../../helpers/centsFormat.js";
import { PAYMENT_TYPE_CASH } from "../../const/types.js";

/**
 * Головний генератор валідатора
 * --------------------------------
 *  - supports:
 *  • wildcard-маркер [] → перевірити КОЖЕН елемент масиву
 *  • вкладені/композитні валідатори, що повертають {valid,errors}
 *
 *   const validate = createValidator(rules);
 *   const { valid, errors } = validate(data);
 */

const ANY_INDEX = "[]";
export const createValidator = (rules) => (data) => {
  /** Збираємо всі помилки плоским списком пар [path, message] */
  const errorEntries = Object.entries(rules).flatMap(([rawPath, validators]) =>
    validateRule({ rawPath, validators, data }),
  );

  /** Перетворюємо список → об’єкт { path: [msg,msg] } */
  const errors = errorEntries.reduce((acc, [path, msg]) => {
    if (!acc[path]) {
      acc[path] = [];
    }
    acc[path].push(msg);
    return acc;
  }, {});

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length ? errors : null,
  };
};

const validateRule = ({ rawPath, validators, data }) => {
  /**
   * =====  TARGETS  ==============================================
   * Масив обʼєктів  { value, path }
   *   • value — фактичне значення, витягнуте з data
   *   • path  — ПОВНИЙ шлях до цього значення (з підставленими
   *             індексами масиву, якщо були []).
   * Приклад для 'foo.bar[].baz':
   *   [
   *     { value: 20, path: 'foo.bar[0].baz' },
   *     { value: 30, path: 'foo.bar[1].baz' },
   *     { value: 10, path: 'foo.bar[2].baz' },
   *     { value: undefined, path: 'foo.bar[3].baz' }
   *   ]
   */
  const targets = findTargets(data, rawPath);

  return targets
    .filter(({ value }) => !(isWildcard(rawPath) && value === undefined))
    .flatMap(({ value, path }) => runValidators(validators, value, data, path));
};

const runValidators = (validators, value, rootData, path) => {
  let collectedErrors = [];

  /**
   * Array#some перебирає доти, доки колбек не поверне true.
   * Якщо помилок нема → повертає false й collectedErrors лишається порожнім.
   */
  validators.some((validate) => {
    const res = validate(value, rootData);

    if (res === false) {
      collectedErrors = [[path, makeMsg(path)]];
      return true;
    }

    /** res = { valid, errors } */
    if (res?.valid === false) {
      collectedErrors = Object.entries(res.errors || {}).map(([key, msgs]) => [
        addDomainPrefix(path, key),
        msgs[0],
      ]);
      return true;
    }

    return false;
  });

  return collectedErrors;
};

/**
 * Знаходимо targets
 * Якщо шлях без wildcard і targets порожній → повертаємо undefined-запис,
 * щоб валідатори могли зафіксувати «поля немає».
 */
function findTargets(obj, rawPath) {
  const targets = expandPath(obj, rawPath);
  return !isWildcard(rawPath) && targets.length === 0
    ? [{ value: undefined, path: rawPath }]
    : targets;
}

const isWildcard = (rawPath) => rawPath.includes(ANY_INDEX);

/** Формуємо стандартне повідомлення */
const makeMsg = (p) => `Invalid value for ${p || "input data"}`;

/**
 * Додаємо префікс parent до дочірнього ключа, якщо потрібно.
 *
 * @example addDomainPrefix('sstData', 'sum')        → 'sstData.sum'
 *          addDomainPrefix('sstData', 'sstData.sum')→ 'sstData.sum' (без змін)
 */
const addDomainPrefix = (parent, child) => `${parent}.${child}`;

/**
 * expandPath: Рекурсивний парсер шляху.
 *
 * TOKEN TYPES
 *   • ANY_INDEX ([])  — ітерує кожен елемент масиву
 *   • [3]             — конкретний індекс масиву
 *   • foo             — ключ об’єкта
 * */
function expandPath(obj, rawPath) {
  if (rawPath === "") return [{ value: obj, path: "" }];

  const tokens = rawPath.match(/([^[.\]]+|\[\d*])/g) || [];
  const results = [];

  /** walk — рекурсивний обхід за токенами
   *
   *  Крок рекурсії:
   *    1) Якщо token === [], викликаємо walk(...) для КОЖНОГО
   *       елемента масиву і додаємо [index] до accPath.
   *    2) Якщо token === [n], переходимо тільки до одного елемента
   *       з індексом n (або undefined, якщо його немає).
   *    3) Інакше token — звичайний ключ об’єкта: оновлюємо accPath
   *       і рекурсуємо глибше.
   *    4) Коли токени закінчились — пушимо { value, path }.
   * */
  const walk = (current, i, accPath) => {
    if (i === tokens.length) {
      // базовий випадок: більше токенів нема
      results.push({ value: current, path: accPath });
      return;
    }

    const token = tokens[i];

    /** wildcard: [] */
    if (token === ANY_INDEX && Array.isArray(current)) {
      current.forEach((item, idx) => walk(item, i + 1, `${accPath}[${idx}]`));
      return;
    }

    /** конкретний індекс [n] */
    if (/^\[\d+]$/.test(token) && Array.isArray(current)) {
      // eslint-disable-next-line no-magic-numbers
      const idx = +token.slice(1, -1);
      walk(
        idx in current ? current[idx] : undefined,
        i + 1,
        `${accPath}[${idx}]`,
      );
      return;
    }

    /** звичайний ключ */
    const nextPath = accPath ? `${accPath}.${token}` : token;
    const nextVal =
      current && typeof current === "object" ? current[token] : undefined;

    walk(nextVal, i + 1, nextPath);
  };

  walk(obj, 0, "");
  return results;
}

/** примітиви */
export const isNumber = (v) => typeof v === "number" && !Number.isNaN(v);
export const isString = (v) => typeof v === "string";
export const isOptionalString = (v) =>
  v === undefined || v === null || isString(v);

export const isNotZero = (v) => v !== 0;
// eslint-disable-next-line no-magic-numbers
export const isMultiplesOf10 = (v) => isNumber(v) && v % 10 === 0;

export const { isArray } = Array;
export const isNonEmptyArray = (v) => isArray(v) && v.length > 0;
export const isNonEmptyObject = (v) =>
  v && typeof v === "object" && !isArray(v) && Object.keys(v).length > 0;

export const optionalMatch = (re) => (v) =>
  v === undefined || v === null || re.test(v);

export const optionalObject = (nestedRules) => {
  const validateNested = createValidator(nestedRules);
  return (value) => {
    if (value === undefined || value === null) return true;
    if (typeof value !== "object" || Array.isArray(value)) return false;

    const res = validateNested(value);
    return res.valid ? true : res;
  };
};

/** доменні валідатори */
export const isPaymentByCashMultipleOf10 = (payments) => {
  if (!isArray(payments)) return false;
  return payments
    .filter((p) => p.type === PAYMENT_TYPE_CASH)
    .every((p) => isMultiplesOf10(p.sum));
};

export const isReceiptTotalValid = ({ products = [], payments = [] } = {}) => {
  if (!isArray(products) || !isArray(payments)) return false;

  const productsTotal = products.reduce((acc, p) => {
    const price = isNumber(p.price) ? p.price : 0;
    const discount = isNumber(p.discount) ? p.discount : 0;
    return acc + (p.count || 0) * (price - discount);
  }, 0);

  const paymentsTotal = payments.reduce(
    (acc, p) => acc + (isNumber(p.sum) ? p.sum : 0),
    0,
  );

  return productsTotal === paymentsTotal * GRAMS_IN_KG;
};
