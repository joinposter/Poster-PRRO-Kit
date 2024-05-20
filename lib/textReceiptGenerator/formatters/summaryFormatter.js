/* eslint-disable no-magic-numbers */
import { pipe } from "../../../helpers/functional.js";

function summaryFormatter(chunk, config) {
  const { formatters } = this;
  return pipe(
    checkTopBorder,
    addData,
    checkBottomBorder,
    extractData,
  )({ chunk, formattedLines: [], config, formatters });
}

const checkTopBorder = ({ chunk, formattedLines, config, formatters }) => {
  return {
    chunk,
    formattedLines: !chunk.hideTopBorder
      ? formattedLines.concat([formatters.ruler(), "\n"])
      : formattedLines,
    config,
    formatters,
  };
};

const addData = ({ chunk, formattedLines, config, formatters }) => {
  const dataLines = chunk.lines
    .filter((line) => !line.hidden)
    .map((line) => {
      const delimeterLength =
        config.width - line.name.length - line.value.length - 2;
      const count = delimeterLength >= 0 ? delimeterLength : 0;

      return `${line.name} ${chunk.delimeter.repeat(count)} ${line.value}\n`;
    });

  return {
    chunk,
    formattedLines: formattedLines.concat(dataLines),
    config,
    formatters,
  };
};

const checkBottomBorder = ({ chunk, formattedLines, config, formatters }) => {
  return {
    chunk,
    formattedLines: !chunk.hideBottomBorder
      ? formattedLines.concat([formatters.ruler()])
      : formattedLines,
    config,
    formatters,
  };
};

const extractData = ({ formattedLines }) => {
  return formattedLines.join("");
};

export default summaryFormatter;
