/* eslint-disable no-magic-numbers */
import narrowTableFormatter from "./narrowTableFormatter.js";
import wideTableFormatter from "./wideTableFormatter.js";

function smartTableFormatter(params, config) {
  const { formatters } = this;
  const { width } = config;
  return width < 38
    ? narrowTableFormatter(params, config, formatters)
    : wideTableFormatter(params, config, formatters);
}

export default smartTableFormatter;
