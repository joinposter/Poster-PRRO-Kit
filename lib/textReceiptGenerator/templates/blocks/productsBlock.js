import { priceFormat } from "../../../../helpers/receipt.js";

const getProductsData = (data) =>
  data
    .filter((p) => !p.hidden)
    .map(({ hidden, ...rest }) => rest)
    .flatMap((product) =>
      [
        product.uktzed ? { type: "text", value: product.uktzed } : null,
        product.barcode ? { type: "text", value: product.barcode } : null,
        product.exciseStamp
          ? { type: "text", value: product.exciseStamp }
          : null,
        {
          type: "smartTable",
          headers: [
            { name: "Назва", relation: 3 },
            { name: "К-сть та ціна", relation: 3, alignment: "center" },
            { name: "Вартість", relation: 2, alignment: "center" },
            { name: "Прог.", relation: 1, alignment: "right" },
          ],
          hideTopBorder: true,
          headersHidden: true,
          items: [
            [
              product.name,
              `${product.amount} x ${priceFormat(product.price)}`,
              priceFormat(product.amount * product.price),
              product.taxPrograms,
            ],
          ],
        },
      ].filter(Boolean),
    );

export default getProductsData;
