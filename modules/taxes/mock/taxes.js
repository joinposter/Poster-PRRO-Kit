// eslint-disable-next-line import/prefer-default-export
export const mockCustomTaxes = {
  VATTaxList: {
    А: { type: 1, name: "ПДВ 0% + Акциз 5%", percent: 0 },
    Б: { type: 2, name: "ПДВ 7%", percent: 7 },
    В: { type: 3, name: "ПДВ 20%", percent: 20 },
    Г: { type: 4, name: "ПДВ 0%", percent: 0 },
    Є: { type: 5, name: "Без ПДВ", percent: 0, noTaxVat: true },
    Ж: { type: 6, name: "Без ПДВ + Акциз 5%", percent: 0, noTaxVat: true },
  },
  exciseTaxList: {
    Д: { type: 7, name: "Акциз", percent: 5 },
    Е: { type: 8, name: "Акциз", percent: 5 },
    З: { type: 9, name: "Акциз", percent: 5 },
  },
};
