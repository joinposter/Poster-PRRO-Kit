const getFooterData = ({ idDFS, printDate, fn, status }) =>
  [
    { type: "ruler" },
    { type: "text", value: idDFS, align: "center" },
    { type: "text", value: printDate, align: "center" },
    { type: "text", value: fn, align: "center" },
    { type: "text", value: status, align: "center" },
    { type: "text", value: " ФІСКАЛЬНИЙ ЧЕК", align: "center" },
    { type: "text", value: " Poster POS", align: "center" },
  ].filter(Boolean);

export default getFooterData;
