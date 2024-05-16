export const addFormatter = (receipt, name, formatter) => {
  if (!receipt.formatters[name]) {
    receipt.addFormatter(name, formatter);
  }
};

export const changeComa = (value) => {
  if (typeof value === "number" || typeof value === "string") {
    return value.toString().replace(".", ",");
  }

  return "";
};

export const priceFormat = (number) => {
  if (typeof number !== "number" && typeof number !== "string") {
    return "0,00";
  }

  let parsed = parseFloat(number);

  const FRACTION_DIGITS = 2;
  parsed = parsed.toFixed(FRACTION_DIGITS);

  return changeComa(parsed);
};
