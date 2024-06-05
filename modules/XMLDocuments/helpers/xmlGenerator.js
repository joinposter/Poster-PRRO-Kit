import { pipe } from "ramda";
import { createHash } from "crypto-browserify";
import { crc32 } from "crc";
import { Buffer } from "buffer";
import { PAYMENT_TYPE_CARD, PAYMENT_TYPE_CASH } from "../const/fiscal.js";
import { decimalRounding, roundWithPrecision } from "../../../helpers/round.js";

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

export const sha256 = (buffer) =>
  createHash("sha256").update(buffer).digest("hex");

export const fromBase64ToBuffer = (data) => Buffer.from(data, "base64");

export const toBase64 = (data) => Buffer.from(data).toString("base64");

const accumulateDiscount = (acc, item) => acc + item.discount;

export const getDiscountTotal = (products) =>
  products.reduce(accumulateDiscount, 0);

export const findCashPayment = (payment) => payment.type === PAYMENT_TYPE_CASH;

export const findCardPayment = (payment) => payment.type === PAYMENT_TYPE_CARD;

export const getRoundedDiff = (item, type = PAYMENT_TYPE_CASH) => {
  let roundDiff = 0;
  if (type === PAYMENT_TYPE_CASH) {
    const cashSum = item.payments.find(findCashPayment)?.sum;
    const roundedCashSum = cashSum && decimalRounding(cashSum);
    if (cashSum !== roundedCashSum) {
      roundDiff = cashSum - roundedCashSum;
    }
  }
  return roundDiff;
};

export const getProductSum = (price, amount) =>
  roundWithPrecision(price * amount);

const fillUid = (request) => {
  const uid = crypto.randomUUID();

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
