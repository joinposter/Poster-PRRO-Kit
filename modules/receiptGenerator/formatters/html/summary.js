const createRuler = (line) => (line.type === "ruler" ? "<hr>" : "");

const createSummaryLine = (line) =>
  line.name && line.value
    ? `<div class="d-flex justify-content-between mb-2">
        <div class="${line.bold ? "fw-bold" : ""}">${line.name}</div>
        <div class="${line.bold ? "fw-bold" : ""}">${line.value}</div>
    </div>`
    : "";

const renderLine = (line) =>
  line && !line.hidden ? createRuler(line) + createSummaryLine(line) : "";

const renderSummaryLines = (lines) => lines.map(renderLine).join("");

const renderSummary = (item) => `
  <div class="bg-light p-2 rounded">
    ${renderSummaryLines(item.lines)}
  </div>
`;

export default renderSummary;
