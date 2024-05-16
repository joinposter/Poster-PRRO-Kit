const getFiscalCompanyData = (data) => [
  { type: "text", value: `СГ ${data.name || ""}`, align: "center" },
  { type: "text", value: data.unit || "", align: "center" },
  { type: "text", value: data.address || "", align: "center" },
  {
    type: "text",
    value: data.kodPdv ? `ПН ${data.kodPdv}` : `ІД ${data.inn}`,
    align: "center",
  },
];

// eslint-disable-next-line import/prefer-default-export
export { getFiscalCompanyData };
