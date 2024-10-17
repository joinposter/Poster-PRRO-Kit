import { pipe } from "../../helpers/functional.js";
import { defaultExciseTaxList, defaultVATTaxList } from "./config/taxes.js";
import {
  ERROR_IN_TAX_PROGRAM,
  MULTIPLE_APPLICATION_OF_VAT,
  EXCISE as EXCISE_KEY,
  VAT as VAT_KEY,
  ONE_HUNDRED_PERCENT,
} from "./const/taxes.js";
import { showError } from "./helpers/taxes.js";
import {
  getCalculatedSourceSum,
  getCalculatedTurnover,
} from "../../helpers/centsFormat.js";

export const getTaxPrograms = (data) => {
  return {
    VATTaxList: data?.VATTaxList || defaultVATTaxList,
    exciseTaxList: data?.exciseTaxList || defaultExciseTaxList,
  };
};

const createTaxProgramRegex = (program) => new RegExp(`[${program}]`, "g");

const taxProgramValidation = ({ taxPrograms, taxesConfig, ...rest }) => {
  const { VATTaxList, exciseTaxList } = taxesConfig;
  const excisePrograms = Object.keys(exciseTaxList).join("");
  const VATPrograms = Object.keys(VATTaxList).join("");

  const reProgramValidator = new RegExp(
    `^[${excisePrograms}${VATPrograms}]{0,2}$`,
    "g",
  );

  if (!reProgramValidator.test(taxPrograms)) {
    console.error(
      showError(ERROR_IN_TAX_PROGRAM, taxPrograms, {
        ...rest,
        taxPrograms,
      }),
    );
  }

  if (
    createTaxProgramRegex(VATPrograms).test(taxPrograms) &&
    taxPrograms.match(createTaxProgramRegex(VATPrograms)).length > 1
  ) {
    console.error(
      showError(MULTIPLE_APPLICATION_OF_VAT, taxPrograms, {
        ...rest,
        taxPrograms,
      }),
    );
  }

  return { ...rest, taxPrograms, taxesConfig };
};

// Taxes by receipt item calculation
const extractTax = (sum, taxPercent) =>
  (sum * taxPercent) / (ONE_HUNDRED_PERCENT + taxPercent);

const calculateTurnover = ({ count, price, isInCentsAndGrams, ...rest }) => {
  const isInCentsAndGramsData = isInCentsAndGrams ? { isInCentsAndGrams } : {};
  return {
    turnover: getCalculatedTurnover({ count, price }),
    ...isInCentsAndGramsData,
    ...rest,
  };
};

const calculateSourceSum = ({
  turnover,
  discount,
  isInCentsAndGrams,
  ...rest
}) => {
  const isInCentsAndGramsData = isInCentsAndGrams ? { isInCentsAndGrams } : {};
  return {
    turnover,
    sourceSum: getCalculatedSourceSum({
      discount,
      turnover,
    }),
    ...isInCentsAndGramsData,
    ...rest,
  };
};

const extractExciseProgram = ({ taxPrograms, taxesConfig, ...rest }) => {
  const excisePrograms = Object.keys(taxesConfig.exciseTaxList).join("");
  const reExcisePrograms = createTaxProgramRegex(excisePrograms);

  const [excise] = reExcisePrograms.test(taxPrograms)
    ? taxPrograms.match(reExcisePrograms)
    : [];

  return {
    ...rest,
    excise,
    taxesConfig,
    taxPrograms,
  };
};

const extractVATProgram = ({ taxPrograms, taxesConfig, ...rest }) => {
  const VATPrograms = Object.keys(taxesConfig.VATTaxList).join("");
  const reVATPrograms = createTaxProgramRegex(VATPrograms);

  const [VAT] = reVATPrograms.test(taxPrograms)
    ? taxPrograms.match(reVATPrograms)
    : [];

  return {
    ...rest,
    taxesConfig,
    VAT,
  };
};

const extractTaxByName = (taxName, taxList) => (item) => {
  if (!item[taxName]) {
    return item;
  }

  const { sourceSum, turnover, ...rest } = item;
  const program = item[taxName];
  const { percent } = taxList[program];
  const calcSum = sourceSum || turnover;

  // Це обов'язково потрібно для розрахунку ПДВ, коли ми разраховуємо акциз в нас ще нема exciseAmount,
  // і тому використовується цілий turnover. Це вказує на те що порядок розрахунку важливий. З початку
  // розраховуємо акциз, а потім ПДВ.
  const calcSumWithoutExcise = item.exciseAmount
    ? calcSum - item.exciseAmount
    : calcSum;

  return {
    ...rest,
    [taxName]: program,
    [`${taxName}Amount`]: extractTax(calcSumWithoutExcise, percent),
    turnover,
    sourceSum,
  };
};

const extractExcise = (item) =>
  extractTaxByName(EXCISE_KEY, item?.taxesConfig?.exciseTaxList)(item);

const extractVAT = (item) =>
  extractTaxByName(VAT_KEY, item?.taxesConfig?.VATTaxList)(item);

const summarize = (taxGroups) => (program) => (key, value) =>
  taxGroups?.[program]?.[key] ? taxGroups[program][key] + value : value;

const groupByTaxes = (
  acc,
  {
    excise,
    exciseAmount,
    turnover,
    sourceSum,
    VAT,
    VATAmount,
    taxesConfig,
    isInCentsAndGrams,
  },
) => {
  const summarizeTaxes = summarize(acc);
  const summarizeExcise = summarizeTaxes(excise);
  const summarizeVAT = summarizeTaxes(VAT);
  const isInCentsAndGramsData = isInCentsAndGrams ? { isInCentsAndGrams } : {};
  if (excise) {
    acc[excise] = {
      sum: Math.round(summarizeExcise("sum", exciseAmount)),
      turnover: Math.round(summarizeExcise("turnover", turnover)),
      sourceSum: Math.round(summarizeExcise("sourceSum", sourceSum)),
      program: excise,
      ...taxesConfig.exciseTaxList[excise],
      ...isInCentsAndGramsData,
      type: 1,
    };
  }

  if (VAT) {
    acc[VAT] = {
      sum: Math.round(summarizeVAT("sum", VATAmount)),
      turnover: Math.round(summarizeVAT("turnover", turnover)),
      sourceSum: Math.round(sourceSum - (exciseAmount || 0)),
      program: VAT,
      ...taxesConfig.VATTaxList[VAT],
      ...isInCentsAndGramsData,
      type: 0,
    };
  }
  return acc;
};

const addTaxesValue = (products, taxesConfig) =>
  products.map((product) => ({
    ...product,
    taxesConfig,
  }));

export const calcTaxesForProducts = (products) =>
  products.map(
    pipe(
      taxProgramValidation,
      calculateTurnover,
      calculateSourceSum,
      extractExciseProgram,
      extractVATProgram,
      extractExcise,
      extractVAT,
    ),
  );

const groupTaxes = (productsWithVATAndExcise) =>
  productsWithVATAndExcise.reduce(groupByTaxes, {});

const transformGroupedTaxes = (taxesGroups) => Object.values(taxesGroups);

export const getTaxesData = (taxesConfig) =>
  pipe(
    (products) => addTaxesValue(products, taxesConfig),
    calcTaxesForProducts,
    groupTaxes,
    transformGroupedTaxes,
  );
