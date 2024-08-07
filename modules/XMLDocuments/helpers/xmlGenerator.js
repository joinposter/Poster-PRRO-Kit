import { pipe } from "ramda";
import { Buffer } from "buffer";
import { crc32 } from "crc";
import { v4 as uuidv4 } from "uuid";
import { PAYMENT_TYPE_CARD, PAYMENT_TYPE_CASH } from "../const/fiscal.js";
import {
  cashSumDecimalRounding,
  roundWithPrecision,
} from "../../../helpers/round.js";

export const getFiscalNumberControlCode = (string) => {
  const HEX_RADIX = 16;
  const CRC32_LENGTH = 8;
  const DIVIDER_TO_GET_LAST_FOUR_DIGITS = 10000;
  const DEFAULT_CONTROL_CODE = 1;

  const crc32String = crc32(string).toString(HEX_RADIX);
  const fullCrc32String =
    "00000000".substring(0, CRC32_LENGTH - crc32String.length) + crc32String;
  const unsignedInt = Buffer.from(fullCrc32String, "hex").readUInt32LE();
  const lastFourDigits = unsignedInt % DIVIDER_TO_GET_LAST_FOUR_DIGITS;
  return lastFourDigits || DEFAULT_CONTROL_CODE;
};

export const sha256 = async (buffer) => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    // eslint-disable-next-line no-magic-numbers
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const fromBase64ToBuffer = (data) => Buffer.from(data, "base64");

// export const toBase64 = (data) => Buffer.from(data).toString("base64");

const accumulateDiscount = (acc, item) => acc + item.discount;

export const getDiscountTotal = (products) =>
  products.reduce(accumulateDiscount, 0);

export const getDiscount = (product) => {
  const { discount, roundSum } = product;
  // Якщо roundSum дорівнює значенню discount, але відʼємний, це означає, що ціна була нижчою за 10 копійок,
  // а оплата здійснювалася готівкою, де немає номіналу нижче 10 копійок, і discount повинен бути відʼємним.
  // В усіх інших випадках потрібно використовувати значення discount.
  return roundSum < 0 && roundSum + discount === 0 ? roundSum : discount;
};

export const findCashPayment = (payment) => payment.type === PAYMENT_TYPE_CASH;

export const findCardPayment = (payment) => payment.type === PAYMENT_TYPE_CARD;

export const getRoundedDiff = (item, type = PAYMENT_TYPE_CASH) => {
  let roundDiff = 0;
  if (type === PAYMENT_TYPE_CASH) {
    const cashSum = item.payments.find(findCashPayment)?.sum;
    const roundedCashSum = cashSum && cashSumDecimalRounding(cashSum);
    if (cashSum !== roundedCashSum) {
      roundDiff = cashSum - roundedCashSum;
    }
  }
  return roundDiff;
};

export const getProductSum = (price, amount) =>
  roundWithPrecision(price * amount);

const fillUid = (request) => {
  const uid = uuidv4();

  return { ...request, uid };
};

const fillDateTimeIfEmpty = (request) => {
  const { dateTime } = request;

  if (!dateTime) {
    return { ...request, dateTime: new Date() };
  }
  return request;
};

export const expandDocumentData = pipe(fillUid, fillDateTimeIfEmpty);

export const removeNoTaxVAT = (taxes) => taxes.filter((t) => !t.noTaxVat);

export const addNoTaxVATField = (products, taxes) => {
  if (taxes.some((t) => !!t.noTaxVat)) {
    return products.map((p) => ({ ...p, hasNoTaxVAT: true }));
  }
  return products;
};

export const removeNoVATPrograms = (taxPrograms, noVatProgram) => {
  if (!noVatProgram?.length) return taxPrograms;

  const setNoVatProgram = new Set(noVatProgram);
  const diff = [...taxPrograms].filter((char) => !setNoVatProgram.has(char));

  if (diff.length === 0) return undefined;

  return diff.join("");
};
