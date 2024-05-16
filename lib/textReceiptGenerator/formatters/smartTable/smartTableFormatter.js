/* eslint-disable no-magic-numbers */
import narrowTableFormatter from "./narrowTableFormatter.js";
import wideTableFormatter from "./wideTableFormatter.js";

function smartTableFormatter(params) {
  const { width } = this.config;
  return width < 40
    ? narrowTableFormatter.call(this, params)
    : wideTableFormatter.call(this, params);
}

export default smartTableFormatter;
