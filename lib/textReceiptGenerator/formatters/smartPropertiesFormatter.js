/* eslint-disable no-magic-numbers, no-control-regex */
import { table, getBorderCharacters } from "table";
import { pipe } from "../../../helpers/functional.js";

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

const RE_ASCII_CONTROL_CHARS = /[\x00-\x1F]+/g;
const RE_UNICODE_CONTROL_CHARS = /[\u0001-\u001A]+/g;

const replaceNonPrintableSymbolForValue = (line) => {
  if (typeof line.value === "string") {
    line.value
      .replace(RE_ASCII_CONTROL_CHARS, " ")
      .replace(RE_UNICODE_CONTROL_CHARS, " ");
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
