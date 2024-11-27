import { DECIMAL_PLACES } from "../modules/receiptGenerator/const/receipt.js";

export const formatToFixedDecimal = (sum) =>
  Number(sum).toFixed(DECIMAL_PLACES);

export const formatNumber = (num, format) =>
  num.toString().padStart(format.length, "0");

export const convertSstDateTimeToISO = (date, time) => {
  if (!date || !time) return null;
  const [day, month, year] = date.split(".").map(Number);
  const [hours, minutes, seconds] = time.split(":").map(Number);

  const isoDate = new Date(
    Date.UTC(year, month - 1, day, hours, minutes, seconds),
  );

  return isoDate.toISOString();
};

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
  if (format === "dateDfsLink") {
    return `${year}${month}${day}`;
  }
  if (format === "time") {
    return `${hours}:${minutes}:${seconds}`;
  }
  if (format === "timeDfsLink") {
    return `${hours}${minutes}${seconds}`;
  }

  if (format === "DDMMYYYYHHMMSS") {
    return `${day}${month}${year}${hours}${minutes}${seconds}`;
  }

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};

const SORT_GREATER = 1;
const SORT_LESS = -1;
export const sortByPayFormCode = (a, b) =>
  a.payFormCode > b.payFormCode ? SORT_GREATER : SORT_LESS;
export const sortByProgram = (a, b) =>
  a.program > b.program ? SORT_GREATER : SORT_LESS;
