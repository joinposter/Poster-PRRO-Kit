const getFiscalCompanyData = ({ name, unit, address, kodPdv, inn }) => [
  { type: "text", value: `СГ ${name || ""}`, align: "center" },
  { type: "text", value: unit || "", align: "center" },
  { type: "text", value: address || "", align: "center" },
  {
    type: "text",
    value: kodPdv ? `ПН ${kodPdv}` : `ІД ${inn}`,
    align: "center",
  },
];

export default getFiscalCompanyData;
