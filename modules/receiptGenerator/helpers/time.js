import { LOCALE_UA, TIMEZONE_UA } from "../const/time.js";

const createDateWithUATimezone = () => {
  const UALocaleString = new Date().toLocaleString(LOCALE_UA, {
    timeZone: TIMEZONE_UA,
  });
  const [datePart, timePart] = UALocaleString.split(", ");
  const [day, month, year] = datePart.split(".");

  return new Date(`${year}-${month}-${day}T${timePart}`);
};

export default createDateWithUATimezone;
