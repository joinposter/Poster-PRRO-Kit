import { priceFormat } from "../../../../helpers/receipt.js";

const getSummaryBlock = ({ taxesData, roundData, currency }) => [
  {
    type: "summary",
    lines: [
      ...taxesBlock(taxesData, currency),
      ...(roundData ? getRoundData(roundData, currency) : []),
    ].filter(Boolean),
    delimeter: " ",
    hideTopBorder: false,
    hideBottomBorder: true,
    withoutBorder: true,
  },
];

const taxesBlock = (data, currency) => [
  {
    name: "Готівкою",
    value: `${priceFormat(data.cash)}${currency}`,
    hidden: !data.cash,
  },
  {
    name: "Карткою",
    value: `${priceFormat(data.card)}${currency}`,
    hidden: !data.card,
  },
  { type: "ruler" },
  {
    name: "Сума",
    value: `${priceFormat(data.total)}${currency}`,
    bold: true,
  },
  ...data.taxes.map((tax) => ({
    name: tax.name,
    value: priceFormat(tax.value),
  })),
];

const getRoundData = (data, currency) => [
  { type: "ruler" },
  ...data.map((item) => ({
    name: item.name,
    value: `${priceFormat(item.value)}${currency}`,
    hidden: !item.value,
  })),
];

export default getSummaryBlock;
