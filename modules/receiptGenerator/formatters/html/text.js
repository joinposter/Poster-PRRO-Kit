const renderText = (item) => `
    <p class="${item.bold ? "fw-bold" : ""} ${item.align ? `text-${item.align}` : ""} ${item.extraCssClass || "mb-1"}">
        ${item.value}
    </p>
`;

export default renderText;
