/* eslint-disable no-magic-numbers */
import narrowTableFormatter from "./narrowTableFormatter.js";
import wideTableFormatter from "./wideTableFormatter.js";
import cleanUpReceiptText from "../../../helpers/cleanUpReceiptText.js";

const cleanRow = (row) => row.map(cleanUpReceiptText);

const cleanTableParams = (params) => ({
  ...params,
  items: params.items.map((item) => ({
    ...item,
    row: cleanRow(item.row),
  })),
});

function smartTableFormatter(params, config) {
  const cleanedParams = cleanTableParams(params);
  const { formatters } = this;
  const { width } = config;
  return width < 38
    ? narrowTableFormatter(cleanedParams, config, formatters)
    : wideTableFormatter(cleanedParams, config, formatters);
}

export default smartTableFormatter;
