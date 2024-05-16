/* eslint-disable no-magic-numbers, no-control-regex */
import { table, getBorderCharacters } from "table";
import { pipe } from "../../../helpers/functional.js";

/**
 * Data example:                                              Receipt example:
 * [                                                          'Официан             Сергей                        ',
 *   {                                                        'Цех                 Кухня                         ',
 *     type: 'smartProperties',                               'Стіл №              1 (Основний зал)              ',
 *     lines: [                                               'Тип замовлення      У закладі                     ',
 *       { name: "Официан", value: "Сергей" },
 *       { name: "Цех", value: "Кухня" },
 *       { name: "Стіл №", value: "1 (Основний зал)" },
 *       { name: "Тип замовлення", value: "У закладі" },
 *       { name: "Комментарии", value: "", hide: true },
 *     ],
 *   },
 * ]
 */

function smartPropertiesFormatter(chunk) {
  const { lines } = chunk;
  const { width } = this.config;

  return table(prepareData(lines), propConfig(width));
}

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

const replaceNonPrintableSymbolForValue = (line) => {
  if (typeof line.value === "string") {
    line.value.replace(/[\x00-\x1F]+/g, " ").replace(/[\u0001-\u001A]+/g, " ");
  }
  return line;
};
const replaceNonPrintableSymbol = (data) =>
  data.map(replaceNonPrintableSymbolForValue);

const prepareTableRow = (line) => [line.name, line.value];

const prepareTableData = (data) => data.map(prepareTableRow);

const prepareData = pipe(
  filterHidden,
  replaceNonPrintableSymbol,
  prepareTableData,
);

export default smartPropertiesFormatter;
