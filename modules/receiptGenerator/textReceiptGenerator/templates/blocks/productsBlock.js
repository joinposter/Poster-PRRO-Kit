import { priceFormat } from "../../../helpers/receipt.js";

const createProductRow = (product) => ({
  row: [
    product.name.trim(),
    `${product.count} x ${priceFormat(product.price)}`,
    priceFormat(product.count * product.price),
    product.taxPrograms,
  ],
  styles: {
    1: {
      color: "text-secondary",
    },
  },
  additionalData: [
    product.uktzed || null,
    product.barcodes || null,
    product.exciseStamp || null,
  ],
});

const isVisibleProduct = (product) => !product.hidden;

const addEmptySpaces = (products) => {
  return products.reduce((acc, product, index) => {
    if (index === 0) {
      return [...acc, product];
    }
    const emptyArrows = new Array(product.row.length).fill("");
    return [...acc, { row: emptyArrows }, product];
  }, []);
};

const getProductsData = (data) => {
  const visibleProducts = data.filter(isVisibleProduct).map(createProductRow);
  const itemsWithSpaces = addEmptySpaces(visibleProducts);

  return [
    { type: "ruler" },
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
      items: itemsWithSpaces,
    },
  ].filter(Boolean);
};

export default getProductsData;
