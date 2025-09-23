/* eslint-disable no-magic-numbers */
import { table, getBorderCharacters } from "table";
import { pipe } from "../../../../helpers/functional.js";
import cleanUpReceiptText from "../../helpers/cleanUpReceiptText.js";

/**
 * Data example:
 * [
 *   {
 *     type: 'smartProperties',
 *     lines: [
 *       { name: "Официан", value: "Сергей" },
 *       { name: "Цех", value: "Кухня" },
 *       { name: "Стіл №", value: "1 (Основний зал)" },
 *       { name: "Тип замовлення", value: "У закладі" },
 *       { name: "Комментарии", value: "", hide: true },
 *     ],
 *   },
 * ]
 *
 * Receipt example:
 * 'Официан             Сергей                        ',
 * 'Цех                 Кухня                         ',
 * 'Стіл №              1 (Основний зал)              ',
 * 'Тип замовлення      У закладі                     ',
 */

const smartPropertiesFormatter = (chunk, config) => {
  const { lines } = chunk;
  const { width } = config;

  return table(prepareData(lines), propConfig(width));
};

const propConfig = (width) => ({
  columns: [
    {
      alignment: "left",
      width: Math.floor(width * 0.4),
      wrapWord: true,
    },
    {
      alignment: "left",
      width: Math.floor(width * 0.6),
      wrapWord: true,
    },
  ],
  border: getBorderCharacters("void"),
  columnDefault: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  drawHorizontalLine: () => false,
});

const filterByHideField = (line) => !line.hide;

const filterHidden = (data) => data.filter(filterByHideField);

const replaceNonPrintableSymbol = (data) =>
  data.map((line) => ({
    ...line,
    name: cleanUpReceiptText(line.name),
    value: cleanUpReceiptText(line.value),
  }));

const prepareTableRow = (line) => [line.name, line.value];

const prepareTableData = (data) => data.map(prepareTableRow);

const prepareData = pipe(
  filterHidden,
  replaceNonPrintableSymbol,
  prepareTableData,
);

export default smartPropertiesFormatter;
