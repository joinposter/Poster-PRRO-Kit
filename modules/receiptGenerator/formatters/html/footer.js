const createFooterQr = (line) =>
  line.type === "footer-qr" ? `<div class="mt-2">${line.value}</div>` : "";

const createFooterText = (line) =>
  line.type === "footer-text" || line.type === "footer-logo"
    ? `<p class="mb-1 text-start">${line.value}</p>`
    : "";

const renderFooterQrLines = (lines) => lines.map(createFooterQr).join("");

const renderFooterTextLines = (lines) => lines.map(createFooterText).join("");

const renderFooter = (item) => {
  const { lines } = item;

  const qrLinesHtml = renderFooterQrLines(lines);
  const textLinesHtml = renderFooterTextLines(lines);

  return `
    <div class="d-flex justify-content-center mt-2">
        ${qrLinesHtml}
        <div class="d-flex flex-column ms-5">
            ${textLinesHtml}
        </div>
    </div>
  `;
};

export default renderFooter;
