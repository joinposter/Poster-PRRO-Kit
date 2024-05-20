import { priceFormat } from "../../../../helpers/receipt.js";

const getTaxesData = (data) => [
  {
    type: "summary",
    lines: [
      {
        name: "Готівкою",
        value: `${priceFormat(data.cash)}${data.currency}`,
        hidden: !data.cash,
      },
      {
        name: "Карткою",
        value: `${priceFormat(data.card)}${data.currency}`,
        hidden: !data.card,
      },
    ],
    delimeter: " ",
    withoutBorder: true,
  },
  {
    type: "summary",
    lines: [
      { name: "Сума", value: `${priceFormat(data.total)}${data.currency}` },
      ...data.taxes.map((tax) => ({
        name: tax.name,
        value: `${priceFormat(tax.value)}${data.currency}`,
      })),
    ],
    delimeter: " ",
    hideTopBorder: true,
    withoutBorder: true,
  },
];

export default getTaxesData;
