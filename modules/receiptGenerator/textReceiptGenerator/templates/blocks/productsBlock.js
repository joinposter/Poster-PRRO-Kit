import { priceFormat } from "../../../helpers/receipt.js";

const createProductRow = (product) => ({
  row: [
    product.name.trim(),
    priceFormat(product.count * product.price),
    product.taxPrograms,
  ],
  styles: {
    1: {
      color: "text-secondary",
    },
  },
  additionalData: [
    Number(product.count) !== 1
      ? `${product.count} x ${priceFormat(product.price)}`
      : null,
    product.uktzed || null,
    product.barcodes || null,
    product.exciseStamp || null,
  ].filter(Boolean),
  hasSpaceBefore: true,
});

const createDiscountRow = (product) =>
  product.discount > 0
    ? {
        row: ["Знижка", priceFormat(product.discount), product.taxPrograms],
        styles: {
          1: {
            color: "text-secondary",
          },
        },
        hasSpaceBefore: false,
      }
    : null;

const createDiffWithDiscountRow = (product) =>
  product.discount > 0
    ? {
        row: [
          "Ціна зі знижкою",
          priceFormat(product.count * product.price - product.discount),
          product.taxPrograms,
        ],
        styles: {
          1: {
            color: "text-secondary",
          },
        },
        hasSpaceBefore: false,
      }
    : null;

const createProductData = (product) => {
  const productRow = createProductRow(product);
  const discountRow = createDiscountRow(product);
  const diffWithDiscountRow = createDiffWithDiscountRow(product);

  return [productRow, discountRow, diffWithDiscountRow].filter(Boolean);
};

const isVisibleProduct = (product) => !product.hidden;

const addEmptySpaces = (rows) => {
  return rows.reduce((acc, rowsData, index) => {
    if (index === 0 || !rowsData.hasSpaceBefore) {
      return [...acc, rowsData];
    }
    const emptyArrows = new Array(rowsData.row.length).fill("");
    return [...acc, { row: emptyArrows }, rowsData];
  }, []);
};

const getFlatData = (acc, item) => [...acc, ...createProductData(item)];

const getProductsData = (data) => {
  const visibleProducts = data.filter(isVisibleProduct).reduce(getFlatData, []);
  const itemsWithSpaces = addEmptySpaces(visibleProducts);
  return [
    { type: "ruler" },
    {
      type: "smartTable",
      headers: [
        { name: "Назва", relation: 6 },
        { name: "Вартість", relation: 3, alignment: "right" },
        { name: "Прог.", relation: 1, alignment: "right" },
      ],
      hideTopBorder: true,
      headersHidden: true,
      items: itemsWithSpaces,
    },
  ].filter(Boolean);
};

export default getProductsData;
