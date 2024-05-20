const getFooterData = ({ message, printDate, fn, kodPdv, inn, status }) =>
  [
    { type: "ruler" },
    message ? { type: "empty" } : null,
    {
      type: "text",
      value: kodPdv ? `ПН ${kodPdv}` : `ІД ${inn}`,
      align: "center",
    },
    { type: "text", value: printDate, align: "center" },
    { type: "text", value: fn, align: "center" },
    { type: "text", value: status, align: "center" },
    { type: "text", value: " ФІСКАЛЬНИЙ ЧЕК", align: "center" },
    { type: "text", value: " Poster POS", align: "center" },
  ].filter(Boolean);

export default getFooterData;
