import { priceFormat } from "../../../../helpers/receipt.js";

const getProductsData = (data) => ({
  type: "smartTable",
  headers: [
    { name: "Назва", relation: 12 },
    { name: "К-сть", relation: 5 },
    { name: "Ціна", relation: 7 },
    { name: "К-сть гостей", relation: 5 },
    { name: "Прог.", relation: 2 },
  ],
  headersHidden: true,
  items: data
    .filter((p) => !p.hidden)
    .map(({ hidden, ...rest }) => rest)
    .map((product) => [
      `${product.uktzed || ""} ${product.barcode || ""} ${product.exciseStamp || ""} ${product.name || ""} `,
      `${product.amount} x`,
      priceFormat(product.price),
      product.guestAmount,
      product.taxPrograms,
    ]),
});

export default getProductsData;
