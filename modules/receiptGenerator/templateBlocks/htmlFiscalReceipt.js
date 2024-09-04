import renderText from "../formatters/html/text.js";
import renderRuler from "../formatters/html/ruler.js";
import renderSmartTable from "../formatters/html/smartTable.js";
import renderSummary from "../formatters/html/summary.js";
import renderFooter from "../formatters/html/footer.js";

const templateMap = {
  text: renderText,
  ruler: renderRuler,
  smartTable: renderSmartTable,
  summary: renderSummary,
  smartProperties: renderSummary,
  footer: renderFooter,
};

const renderItem = (item) =>
  templateMap[item.type] ? templateMap[item.type](item) : "";

const renderFiscalReceipt = (data) =>
  `<div class="fiscal-receipt">${data.map(renderItem).join("")}</div>`;

export default renderFiscalReceipt;
