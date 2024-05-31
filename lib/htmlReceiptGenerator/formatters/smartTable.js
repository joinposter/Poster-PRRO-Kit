const createAdditionalDataRow = (value) =>
  `<tr><td class="text-secondary border-0 pt-0 pb-0 p-1">${value}</td></tr>`;

const renderAdditionalData = (additionalData) =>
  additionalData.filter(Boolean).map(createAdditionalDataRow).join("");

const createRowCell = (val, style) =>
  `<td class="border-0 p-1 ${style?.color || ""}">${val}</td>`;

const mapRowCell = (styles) => (val, index) =>
  createRowCell(val, styles?.[index]);

const renderRow = (row, styles) => row.map(mapRowCell(styles)).join("");

const renderRowItem = (rowItem) => {
  const { additionalData, row, styles } = rowItem;
  const additionalDataHtml = additionalData
    ? renderAdditionalData(additionalData)
    : "";
  const rowHtml = `<tr>${renderRow(row, styles)}</tr>`;
  return additionalDataHtml + rowHtml;
};

const renderSmartTable = (item) => {
  const rowItemsHtml = item.items.map(renderRowItem).join("");
  return `
    <div class="mb-3 mt-3">
        <table class="table">
            <tbody>
                ${rowItemsHtml}
            </tbody>
        </table>
    </div>
  `;
};

export default renderSmartTable;
