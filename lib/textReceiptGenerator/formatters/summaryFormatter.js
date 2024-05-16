/* eslint-disable no-magic-numbers */
import { pipe } from "../../../helpers/functional.js";

/**
 * Data example:                                               Receipt example:
 * {                                                           '--------------------------------------------------',
 *   type: 'summary',                                          'Загальний обіг ............................. 12,20',
 *   lines: [                                                  'Готівка ..................................... 5,10',
 *     {name: 'Загальний обіг', value: priceFormat(12.20)},    'Картка ...................................... 7,10',
 *     {name: 'Готівка', value: priceFormat(5.10)},            'Кількість чеків  20',
 *     {name: 'Картка', value: priceFormat(7.10)},             '--------------------------------------------------',
 *     {name: 'Кількість чеків', value: 20},
 *   ],
 *   delimeter: '.',
 *   withoutBorder: false,
 * }
 */
function summaryFormatter(chunk) {
  return pipe(checkTopBorder, addData, checkBottomBorder, extractData).bind(
    this,
  )({ chunk, formattedLines: [] });
}

function checkTopBorder({ chunk, formattedLines }) {
  if (!chunk.withoutBorder) {
    formattedLines.push(this.formatters.ruler(""));
    formattedLines.push("\n");
  }
  return { chunk, formattedLines };
}

function addData({ chunk, formattedLines }) {
  chunk.lines.forEach((line) => {
    const delimeterLength =
      this.config.width - line.name.length - line.value.length - 2;
    const count = delimeterLength >= 0 ? delimeterLength : 0;
    formattedLines.push(
      `${line.name} ${chunk.delimeter.repeat(count)} ${line.value}\n`,
    );
  });
  return { chunk, formattedLines };
}

function checkBottomBorder({ chunk, formattedLines }) {
  if (!chunk.withoutBorder) {
    formattedLines.push(this.formatters.ruler(""));
  }
  return { chunk, formattedLines };
}

const extractData = ({ formattedLines }) => {
  return formattedLines.join("");
};

export default summaryFormatter;
