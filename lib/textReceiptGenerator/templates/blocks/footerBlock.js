const getFooterData = ({
  dfsDocumentFiscalId,
  dateTime,
  cashbox,
  status,
  docType,
  software,
}) =>
  [
    dfsDocumentFiscalId
      ? { type: "text", value: dfsDocumentFiscalId.toString(), align: "center" }
      : null,
    dateTime ? { type: "text", value: dateTime, align: "center" } : null,
    cashbox
      ? { type: "text", value: cashbox.toString(), align: "center" }
      : null,
    status ? { type: "text", value: status, align: "center" } : null,
    docType ? { type: "text", value: docType, align: "center" } : null,
    software ? { type: "text", value: software, align: "center" } : null,
  ].filter(Boolean);

export default getFooterData;
