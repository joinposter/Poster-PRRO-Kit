import { priceFormat } from "../helpers/receipt.js";

const getSummaryBlock = ({ taxesAndPaymentsData, roundData, currency }) => [
  {
    type: "summary",
    lines: [
      ...taxesAndPaymentsBlock(taxesAndPaymentsData, currency),
      ...(roundData ? getRoundData(roundData, currency) : []),
    ].filter(Boolean),
    delimeter: " ",
    hideTopBorder: false,
    hideBottomBorder: true,
    withoutBorder: true,
  },
];

const taxesAndPaymentsBlock = (data, currency) =>
  [
    {
      name: "Готівка",
      value: `${priceFormat(data.cash)} ${currency}`,
      hidden: !data.cash,
    },
    {
      name: "Безготівкова",
      value: `${priceFormat(data.card)} ${currency}`,
      hidden: !data.card,
    },
    {
      name: "    Картка",
      value: " ",
      hidden: !data.card,
    },
    { type: "ruler" },
    {
      name: "Сума",
      value: `${priceFormat(data.productsSum)} ${currency}`,
      bold: true,
    },
    ...data.taxes.map((tax) => ({
      name: tax.name,
      value: priceFormat(tax.value),
    })),
    !data.taxes?.length && {
      name: "Без ПДВ",
      value: " ",
    },
  ].filter(Boolean);

const getRoundData = (data, currency) => [
  { type: "ruler" },
  ...data.map((item) => ({
    name: item.name,
    value: `${priceFormat(item.value)} ${currency}`,
    hidden: !item.value,
  })),
];

export default getSummaryBlock;
