import { table, getBorderCharacters } from "table";

/**
 * Data example:
 * [
 *   {
 *      type: 'smartTable',
 *      headers: [
 *        {name: 'Назва', relation: 10},
 *        {name: 'Кількість', relation: 10},
 *        {name: 'Ціна', relation: 10},
 *        {name: 'Сума', relation: 10},
 *      ],
 *      items: [
 *        { row: ['Сирна паличка', '1 шт.', '200.00грн.', '200.00грн.'], additionalData: [123, 567, 123] },
 *        { row: ['Морозиво', '2 шт.', '92.13грн.', '184.26грн.'], additionalData: [55443, null, null] },
 *      ],
 *   },
 *];
 *
 * Receipt example:
 * '----------------------------------------',
 * 'Назва     Кількість Ціна      Сума      ',
 * '                                        ',
 * '123',
 * '567',
 * '123',
 * 'Сирна     1 шт.     200.00грн.200.00грн.',
 * 'паличка                                 ',
 * '',
 * '55443',
 * 'Морозиво  2 шт.     92.13грн. 184.26грн.',
 * '',
 *
 * Больше примеров в receipt.test.js
 */

const NEW_LINE = "\n";

const wideTableFormatter = (chunk, config, formatters) => {
  const data = prepareData(chunk);
  const tableOutput = table(data, getConfig(chunk, config));
  return chunk.hideTopBorder
    ? tableOutput
    : `${formatters.ruler()}${NEW_LINE}${tableOutput}`;
};

const prepareHeader = (chunk) =>
  chunk.headers && !chunk.headersHidden
    ? [chunk.headers.map(extractName), Array(chunk.headers.length).fill(" ")]
    : [];

const prepareBody = (chunk) => {
  return chunk.items.reduce((acc, item) => {
    return [...acc, ...prepareAdditionalData(item), item.row];
  }, []);
};

const prepareAdditionalData = (item) =>
  (item.additionalData || [])
    .filter(Boolean)
    .map((data) => [data, ...Array(item.row.length - 1).fill("")]);

const prepareData = (chunk) => [...prepareHeader(chunk), ...prepareBody(chunk)];

const calculateAlignment = (index, length, header) =>
  header?.alignment || (index === length - 1 ? "right" : "left");

const extractName = (item) => item.name;

const accRelations = (sum, currentValue) => sum + currentValue.relation;

const getColumnsConfig = (chunk, width) => {
  const numberOfPieces =
    chunk.headers?.reduce(accRelations, 0) || chunk.items[0].row.length;
  const widthOfPiece = width / numberOfPieces;

  return chunk.items[0].row.map((_, index) => {
    const header = chunk.headers?.[index];
    const length = header ? chunk.headers.length : chunk.items[0].row.length;
    const alignment = calculateAlignment(index, length, header);
    const currentRelation = header ? header.relation : 1;

    return {
      alignment,
      width: Math.floor(widthOfPiece * currentRelation),
      wrapWord: true,
      verticalAlignment: chunk.verticalAlignment || "top",
    };
  });
};

const getConfig = (chunk, config) => {
  const { width } = config;

  return {
    columns: getColumnsConfig(chunk, width),
    border: getBorderCharacters("void"),
    columnDefault: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    drawHorizontalLine: () => false,
  };
};

export default wideTableFormatter;
