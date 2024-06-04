import renderText from "./text.js";
import renderRuler from "./ruler.js";
import renderSmartTable from "./smartTable.js";
import renderSummary from "./summary.js";
import renderFooter from "./footer.js";

const templateMap = {
  text: renderText,
  ruler: renderRuler,
  smartTable: renderSmartTable,
  summary: renderSummary,
  footer: renderFooter,
};

const renderItem = (item) =>
  templateMap[item.type] ? templateMap[item.type](item) : "";

const renderFiscalReceipt = (data) =>
  `<div class="fiscal-receipt">${data.map(renderItem).join("")}</div>`;

export default renderFiscalReceipt;
