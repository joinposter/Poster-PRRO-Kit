const getFooterData = ({
  dfsDocumentFiscalId,
  dateTime,
  cashbox,
  status,
  docType,
  software,
}) =>
  [
    { type: "ruler" },
    { type: "text", value: dfsDocumentFiscalId, align: "center" },
    { type: "text", value: dateTime, align: "center" },
    { type: "text", value: cashbox, align: "center" },
    { type: "text", value: status, align: "center" },
    { type: "text", value: docType, align: "center" },
    { type: "text", value: software, align: "center" },
  ].filter(Boolean);

export default getFooterData;
