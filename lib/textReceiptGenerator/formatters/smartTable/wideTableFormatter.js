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
 *        ['Сирна паличка', '1 шт.', '200.00грн.', '200.00грн.'],
 *        ['Морозиво', '2 шт.', '92.13грн.', '184.26грн.'],
 *      ],
 *   },
 *];
 *
 * Receipt example:
 * '----------------------------------------',
 * 'Назва     Кількість Ціна      Сума      ',
 * '                                        ',
 * 'Сирна     1 шт.     200.00грн.200.00грн.',
 * 'паличка                                 ',
 * 'Морозиво  2 шт.     92.13грн. 184.26грн.',
 * '',
 *
 * Больше примеров в receipt.test.js
 */

const NEW_LINE = "\n";

const wideTableFormatter = (chunk, config, formatters) => {
  const data = prepareData(chunk);
  const tableOutput = table(data, getConfig(chunk, config));
  return `${formatters.ruler("")}${NEW_LINE}${tableOutput}`;
};

const prepareHeader = (chunk) => {
  if (!chunk.headers || chunk.headersHidden) return [];

  const rowHeader = chunk.headers.map(extractName);
  const filler = Array(chunk.headers.length).fill(" ");

  return [rowHeader, filler];
};

const prepareBody = (chunk) => chunk.items;

const prepareData = (chunk) => [...prepareHeader(chunk), ...prepareBody(chunk)];

const calculateAlignment = (index, length, header) =>
  header?.alignment || (index === length - 1 ? "right" : "left");

const extractName = (item) => item.name;

const accRelations = (sum, currentValue) => sum + currentValue.relation;

const getColumnsConfig = (chunk, width) => {
  const numberOfPieces =
    chunk.headers?.reduce(accRelations, 0) || chunk.items[0].length;
  const widthOfPiece = width / numberOfPieces;

  return chunk.items[0].map((_, index, arr) => {
    const header = chunk.headers?.[index];
    const length = header ? chunk.headers.length : arr.length;
    const alignment = calculateAlignment(index, length, header);
    const currentRelation = header ? header.relation : 1;

    return {
      alignment,
      width: Math.floor(widthOfPiece * currentRelation),
      wrapWord: true,
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
