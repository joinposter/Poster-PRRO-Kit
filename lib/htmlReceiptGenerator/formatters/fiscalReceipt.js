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

const renderItems = (data) => data.map(renderItem).join("");

const renderFiscalReceipt = (data) => `
  <div class="container p-5">
    <div class="row">
      <div class="col">
        ${renderItems(data)}
      </div>
    </div>
  </div>
`;

export default renderFiscalReceipt;
