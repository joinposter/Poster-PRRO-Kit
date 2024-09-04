const createFooterText = (line) =>
  line.type === "footer-text" || line.type === "footer-logo"
    ? `<p class="mb-1 text-center">${line.value}</p>`
    : "";

const renderFooterTextLines = (lines) => lines.map(createFooterText).join("");

const renderFooterWithoutQR = (item) => {
  const { lines } = item;
  const textLinesHtml = renderFooterTextLines(lines);

  return `
    <div class="d-flex justify-content-center mt-2">
        <div class="d-flex flex-column">
            ${textLinesHtml}
        </div>
    </div>
  `;
};

export default renderFooterWithoutQR;
