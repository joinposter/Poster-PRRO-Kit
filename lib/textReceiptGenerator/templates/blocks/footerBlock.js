const getFooterData = ({
  dfsDocumentFiscalId,
  dateTime,
  cashbox,
  status,
  docType,
}) =>
  [
    { type: "ruler" },
    { type: "text", value: dfsDocumentFiscalId, align: "center" },
    { type: "text", value: dateTime, align: "center" },
    { type: "text", value: cashbox, align: "center" },
    { type: "text", value: status, align: "center" },
    { type: "text", value: docType, align: "center" },
    { type: "text", value: " ФІСКАЛЬНИЙ ЧЕК", align: "center" },
    { type: "text", value: " Poster POS", align: "center" },
  ].filter(Boolean);

export default getFooterData;
