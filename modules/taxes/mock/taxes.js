// eslint-disable-next-line import/prefer-default-export
export const mockCustomTaxes = {
  VATTaxList: {
    А: { name: "ПДВ 0% + Акциз 5%", percent: 0 },
    Б: { name: "ПДВ 7%", percent: 7 },
    В: { name: "ПДВ 20%", percent: 20 },
    Г: { name: "ПДВ 0%", percent: 0 },
    Є: { name: "Без ПДВ", percent: 0, noTaxVat: true },
    Ж: { name: "Без ПДВ + Акциз 5%", percent: 0, noTaxVat: true },
  },
  exciseTaxList: {
    Д: { name: "Акциз", percent: 5 },
    Е: { name: "Акциз", percent: 5 },
    З: { name: "Акциз", percent: 5 },
  },
};
