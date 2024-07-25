const footerServiceBlock = (text) =>
  text
    ? [{ type: "ruler" }, { type: "text", value: text, align: "center" }]
    : [];

export default footerServiceBlock;
