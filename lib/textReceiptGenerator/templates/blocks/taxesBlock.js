import { priceFormat } from "../../../../helpers/receipt.js";

const getTaxesData = (data) => ({
  type: "summary",
  lines: [
    { name: "Сума", value: `${priceFormat(data.total)}${data.currency}` },
    ...data.taxes.map((tax) => ({
      name: tax.name,
      value: `${priceFormat(tax.value)}${data.currency}`,
    })),
  ],
  delimeter: ".",
  withoutBorder: false,
});

export default getTaxesData;
