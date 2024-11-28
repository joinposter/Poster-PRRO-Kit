import { Buffer } from "buffer";
import { crc32 } from "crc";
import { PAYMENT_TYPE_CARD, PAYMENT_TYPE_CASH } from "../const/fiscal.js";
import { roundWithPrecision } from "../../../helpers/round.js";
import {
  convertKopecksToGrivnas,
  convertGramsToKg,
} from "../../../helpers/centsFormat.js";

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
  convertKopecksToGrivnas(products.reduce(accumulateDiscount, 0));

export const getDiscount = (product) =>
  convertKopecksToGrivnas(product.discount);

export const findCashPayment = (payment) => payment.type === PAYMENT_TYPE_CASH;

export const findCardPayment = (payment) => payment.type === PAYMENT_TYPE_CARD;

export const getProductSum = ({ price, count }) => {
  const sum = convertGramsToKg(count) * convertKopecksToGrivnas(price);
  return roundWithPrecision(sum);
};

export const hasProductMarking = ({ marking }) =>
  Array.isArray(marking) && marking.length;

export const hasProductBarcode = ({ barcodes }) =>
  Array.isArray(barcodes) && barcodes.length;

const isTaxValid = (tax, VATTaxList) => {
  const vatTax = VATTaxList[tax.program];
  return !(vatTax && vatTax.percent === null);
};

const isVATProgramValid = (letter, VATTaxList) => {
  const vatTax = VATTaxList[letter];
  return vatTax?.percent !== null;
};

const filterTaxPrograms = (taxPrograms, VATTaxList) => {
  if (!taxPrograms) return taxPrograms;
  return taxPrograms
    .split("")
    .filter((letter) => isVATProgramValid(letter, VATTaxList))
    .join("");
};

const filterProduct = (product, VATTaxList) => {
  const filteredTaxPrograms = filterTaxPrograms(
    product.taxPrograms,
    VATTaxList,
  );
  return {
    ...product,
    taxPrograms: filteredTaxPrograms,
  };
};

export const filterTaxesByVAT = (taxes, VATTaxList) =>
  taxes.filter((tax) => isTaxValid(tax, VATTaxList));

export const filterProducts = (products, VATTaxList) => {
  return products.map((product) => filterProduct(product, VATTaxList));
};
