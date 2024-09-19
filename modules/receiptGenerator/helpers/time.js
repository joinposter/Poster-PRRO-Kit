import { LOCALE_UA, TIMEZONE_UA } from "../const/time.js";

const createDateWithUATimezone = (date) => {
  const UALocaleString = new Date(date).toLocaleString(LOCALE_UA, {
    timeZone: TIMEZONE_UA,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const [datePart, timePart] = UALocaleString.split(", ");
  const [day, month, year] = datePart.split(".");

  return new Date(`${year}-${month}-${day}T${timePart}`);
};

export default createDateWithUATimezone;
