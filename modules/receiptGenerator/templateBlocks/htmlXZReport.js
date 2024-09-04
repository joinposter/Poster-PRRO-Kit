import renderText from "../formatters/html/text.js";
import renderRuler from "../formatters/html/ruler.js";
import renderSmartTable from "../formatters/html/smartTable.js";
import renderSummary from "../formatters/html/summary.js";
import renderFooterWithoutQR from "../formatters/html/footerWithoutQR.js";

const templateMap = {
  text: renderText,
  ruler: renderRuler,
  smartTable: renderSmartTable,
  summary: renderSummary,
  smartProperties: renderSummary,
  footer: renderFooterWithoutQR,
};

const renderItem = (item) =>
  templateMap[item.type] ? templateMap[item.type](item) : "";

const renderXZReport = (data) =>
  `<div class="x-z-report">${data.map(renderItem).join("")}</div>`;

export default renderXZReport;
