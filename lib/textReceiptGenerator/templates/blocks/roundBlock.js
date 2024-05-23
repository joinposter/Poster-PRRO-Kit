import { priceFormat } from "../../../../helpers/receipt.js";

const getRoundData = ({ data, currency }) => ({
  type: "summary",
  lines: data.map((item) => ({
    name: item.name,
    value: `${priceFormat(item.value)}${currency}`,
    hidden: !item.value,
  })),
  delimeter: " ",
  hideTopBorder: false,
  hideBottomBorder: true,
});

export default getRoundData;
