import { DECIMAL_PLACES } from "../modules/receiptGenerator/const/receipt.js";

export const formatToFixedDecimal = (sum) =>
  Number(sum).toFixed(DECIMAL_PLACES);

export const formatNumber = (num, format) =>
  num.toString().padStart(format.length, "0");

export const getDateTime = ({ date, format }) => {
  if (!Date.parse(date)) return null;
  const utcDate = new Date(date);
  const options = {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formattedTime = new Intl.DateTimeFormat(
    "default",
    options,
  ).formatToParts(utcDate);
  const timeParts = Object.fromEntries(
    formattedTime.map(({ type, value }) => [type, value]),
  );

  const year = formatNumber(timeParts.year, "yyyy");
  const month = formatNumber(timeParts.month, "MM");
  const day = formatNumber(timeParts.day, "dd");
  const hours = formatNumber(timeParts.hour, "HH");
  const minutes = formatNumber(timeParts.minute, "mm");
  const seconds = formatNumber(timeParts.second, "ss");

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

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};
