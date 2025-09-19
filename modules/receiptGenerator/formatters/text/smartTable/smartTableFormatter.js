/* eslint-disable no-magic-numbers */
import narrowTableFormatter from "./narrowTableFormatter.js";
import wideTableFormatter from "./wideTableFormatter.js";

const RE_ASCII_CONTROL_CHARS = /[\x00-\x1F]+/g;
const RE_UNICODE_CONTROL_CHARS = /[\u0001-\u001A]+/g;

const cleanControlChars = (value) => {
  if (typeof value === "string") {
    return value
      .replace(RE_ASCII_CONTROL_CHARS, " ")
      .replace(RE_UNICODE_CONTROL_CHARS, " ")
  }

  return value;
};

const cleanTableParams = (params) => {
  return {
    ...params,
    items: params.items.map(item => ({
      ...item,
      row: item.row.map(cleanControlChars)
    }))
  };
};

function smartTableFormatter(params, config) {
  const cleanedParams = cleanTableParams(params);
  const { formatters } = this;
  const { width } = config;
  return width < 38
    ? narrowTableFormatter(cleanedParams, config, formatters)
    : wideTableFormatter(cleanedParams, config, formatters);
}

export default smartTableFormatter;
