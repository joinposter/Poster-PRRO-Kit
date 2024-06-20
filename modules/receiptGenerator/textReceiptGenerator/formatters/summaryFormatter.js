/* eslint-disable no-magic-numbers */
import { pipe } from "../../../../helpers/functional.js";

/**
 * Data example:
 * {
 *   type: 'summary',
 *   lines: [
 *     {name: 'Загальний обіг', value: priceFormat(12.20)},
 *     {name: 'Готівка', value: priceFormat(5.10)},
 *     {name: 'Картка', value: priceFormat(7.10)},
 *     {name: 'Кількість чеків', value: 20},
 *   ],
 *   delimeter: '.',
 *   hideTopBorder: false,
 *   hideBottomBorder: false,
 * }
 *
 * Receipt example:
 * '--------------------------------------------------',
 * 'Загальний обіг ............................. 12,20',
 * 'Готівка ..................................... 5,10',
 * 'Картка ...................................... 7,10',
 * 'Кількість чеків  20',
 * '--------------------------------------------------',
 */

const NUMBER_OF_DELIMETERS = 2;
const NEW_LINE = "\n";

function summaryFormatter(chunk, config) {
  const { formatters } = this;
  return pipe(
    checkTopBorder,
    addData,
    trim,
    checkBottomBorder,
    extractData,
  )({ chunk, formattedLines: [], config, formatters });
}

const checkTopBorder = ({ chunk, formattedLines, config, formatters }) => {
  return {
    chunk,
    formattedLines: !chunk.hideTopBorder
      ? formattedLines.concat([formatters.ruler(), NEW_LINE])
      : formattedLines,
    config,
    formatters,
  };
};

const addData = ({ chunk, formattedLines, config, formatters }) => {
  const dataLines = chunk.lines
    .filter((line) => !line.hidden)
    .map((line) => {
      if (line.type === "ruler") {
        return [formatters.ruler(), NEW_LINE];
      }

      const delimeterLength =
        config.width -
        line.name.length -
        line.value.length -
        NUMBER_OF_DELIMETERS;
      const count = delimeterLength >= 0 ? delimeterLength : 0;

      return [
        `${line.name} ${chunk.delimeter.repeat(count)} ${line.value}`,
        NEW_LINE,
      ];
    });

  return {
    chunk,
    formattedLines: formattedLines.concat(...dataLines),
    config,
    formatters,
  };
};

const trim = ({ chunk, formattedLines, config, formatters }) => {
  // Remove trailing newline if it exists before adding the bottom border
  if (formattedLines[formattedLines.length - 1] === NEW_LINE) {
    formattedLines.pop();
  }
  return { chunk, formattedLines, config, formatters };
};

const checkBottomBorder = ({ chunk, formattedLines, config, formatters }) => {
  if (!chunk.hideBottomBorder) {
    formattedLines.push(NEW_LINE);
    formattedLines.push(formatters.ruler());
  }
  return { chunk, formattedLines, config, formatters };
};

const extractData = ({ formattedLines }) => {
  return formattedLines.join("");
};

export default summaryFormatter;
