import { table, getBorderCharacters } from "table";
import { pipe } from "../../../../helpers/functional.js";

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

function wideTableFormatter(chunk) {
  const data = [];
  prepareData({ chunk, data });

  const res = table(data, getConfig.call(this, chunk));
  return chunk.hideTopBorder ? res : `${this.formatters.ruler("")}\n${res}`;
}

const prepareHeader = ({ chunk, data }) => {
  if (chunk.headers && !chunk.headersHidden) {
    const rowHeader = chunk.headers.map(extractName);
    data.push(rowHeader);
    const filler = Array(chunk.headers.length).fill(" ");
    data.push(filler);
  }
  return { chunk, data };
};
const prepareBody = ({ chunk, data }) => {
  data.push(...chunk.items);
  return data;
};

const prepareData = pipe(prepareHeader, prepareBody);

const calculateAlignment = (index, length, header) => {
  if (header) {
    return header.alignment || (index === length - 1 ? "right" : "left");
  }
  return index === length - 1 ? "right" : "left";
};

const extractName = (item) => item.name;

const accRelations = (sum, currentValue) => sum + currentValue.relation;

function getColumnsConfig(chunk) {
  const width = chunk?.width || this.config.width;
  const numberOfPieces =
    chunk.headers?.reduce(accRelations, 0) || chunk.items[0].length;
  const widthOfPiece = width / numberOfPieces;

  return chunk.items[0].map((item, index, arr) => {
    const header = chunk.headers?.[index];
    const length = header ? chunk.headers.length : arr.length;
    const alignment = calculateAlignment(index, length, header);
    const currentRelation = header ? header.relation : 1;
    const result = {
      alignment,
      width: Math.floor(widthOfPiece * currentRelation),
      wrapWord: true,
      verticalAlignment: chunk.verticalAlignment || "top",
    };
    return result;
  });
}

function getConfig(chunk) {
  return {
    columns: getColumnsConfig.call(this, chunk),
    border: getBorderCharacters("void"),
    columnDefault: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    drawHorizontalLine: () => false,
  };
}

export default wideTableFormatter;
