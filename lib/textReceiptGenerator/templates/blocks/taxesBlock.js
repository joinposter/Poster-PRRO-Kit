import { priceFormat } from "../../../../helpers/receipt.js";

const getTaxesData = (data) => ({
  type: "summary",
  lines: [
    data.cash
      ? { name: "Готівкою", value: `${priceFormat(data.cash)}${data.currency}` }
      : null,
    data.card
      ? { name: "Карткою", value: `${priceFormat(data.card)}${data.currency}` }
      : null,
    { name: "Сума", value: `${priceFormat(data.total)}${data.currency}` },
    ...data.taxes.map((tax) => ({
      name: tax.name,
      value: `${priceFormat(tax.value)}${data.currency}`,
    })),
  ].filter(Boolean),
  delimeter: " ",
  withoutBorder: false,
});

export default getTaxesData;
