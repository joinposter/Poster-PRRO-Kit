import { DECIMAL_PLACES } from "../modules/receiptGenerator/const/receipt.js";

export const formatToFixedDecimal = (sum) =>
  Number(sum).toFixed(DECIMAL_PLACES);

export const formatNumber = (num, format) =>
  num.toString().padStart(format.length, "0");

export const getDateTime = ({ date, format }) => {
  if (!Date.parse(date)) return null;
  const localISOTime = new Date(date);
  const year = formatNumber(localISOTime.getFullYear(), "yyyy");
  const month = formatNumber(localISOTime.getMonth() + 1, "MM");
  const day = formatNumber(localISOTime.getDate(), "dd");
  const hours = formatNumber(localISOTime.getHours(), "HH");
  const minutes = formatNumber(localISOTime.getMinutes(), "mm");
  const seconds = formatNumber(localISOTime.getSeconds(), "ss");

  if (format === "date") {
    return `${day}.${month}.${year}`;
  }
  if (format === "time") {
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};

export const decimalRounding = (number) => {
  const NUMBER_OF_DECIMALS = 10;
  const rounded = Math.round(number * NUMBER_OF_DECIMALS) / NUMBER_OF_DECIMALS;

  return rounded;
};
