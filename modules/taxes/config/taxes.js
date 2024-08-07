export const defaultVATTaxList = {
  А: {
    type: 1,
    name: "Без ПДВ",
    percent: 0,
    noTaxVat: true,
  },
  Б: {
    type: 2,
    name: "ПДВ 0%",
    percent: 0,
  },
  В: {
    type: 3,
    name: "ПДВ 7%",
    percent: 7,
  },
  Г: {
    type: 4,
    name: "ПДВ 20%",
    percent: 20,
  },
};

export const defaultExciseTaxList = {
  Д: {
    type: 5,
    name: "Акциз 5%",
    percent: 5,
  },
};
