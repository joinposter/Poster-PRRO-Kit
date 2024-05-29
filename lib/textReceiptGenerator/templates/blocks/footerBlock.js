const getStatus = (data) => (data.cashboxData.isOffline ? "ОФФЛАЙН" : "ОНЛАЙН");

const getFooterData = (data) =>
  [
    { type: "ruler" },
    data.fiscalId
      ? {
          type: "text",
          value: data.fiscalId.toString(),
          align: "center",
        }
      : null,
    data.dateTime
      ? { type: "text", value: data.dateTime, align: "center" }
      : null,
    { type: "text", value: getStatus(data), align: "center" },
    data?.cashboxData?.cashbox
      ? {
          type: "text",
          value: data.cashboxData.cashbox.toString(),
          align: "center",
        }
      : null,
    data?.footerData?.docType
      ? { type: "text", value: data.footerData.docType, align: "center" }
      : null,
    data?.footerData?.software
      ? { type: "text", value: data.footerData.software, align: "center" }
      : null,
  ].filter(Boolean);

export default getFooterData;
