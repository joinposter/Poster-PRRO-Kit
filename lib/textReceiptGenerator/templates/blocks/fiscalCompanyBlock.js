const getFiscalCompanyData = ({ name, unit, address, kodPdv, inn }) =>
  [
    name ? { type: "text", value: name, align: "center" } : null,
    unit ? { type: "text", value: unit || "", align: "center" } : null,
    address ? { type: "text", value: address, align: "center" } : null,
    {
      type: "text",
      value: kodPdv ? `ПН ${kodPdv}` : `ІД ${inn}`,
      align: "center",
    },
    { type: "ruler" },
  ].filter((item) => item !== null);

export default getFiscalCompanyData;
