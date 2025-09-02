import { getRowNum } from "./commonXMLTagGenerator.js";

// eslint-disable-next-line no-magic-numbers
const getRegionCode = (dpiCode) => dpiCode?.toString().slice(0, -2);

// eslint-disable-next-line no-magic-numbers
const getDistrictCode = (dpiCode) => dpiCode?.toString().slice(-2);

const getDocumentCode = (isLLC) => (isLLC ? "J13" : "F13");

const getCurrentDate = () => {
  const date = new Date();
  // eslint-disable-next-line no-magic-numbers
  const day = String(date.getDate()).padStart(2, "0");
  // eslint-disable-next-line no-magic-numbers
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}${month}${year}`;
};

const getCashierRegistrationDocument = (data) => {
  const {
    isLLC,
    documentNumber,
    taxCodeDPI,
    reportingMonth,
    reportingYear,
    // Тіло декларації
    organizationTin,
    organizationName,

    // Дані касира
    cashierFullName,
    cashierTin,
    cashierKeyId,
    cashierPosition,

    // Дані керівника
    chiefTin,
    chiefName,
  } = data;

  const DECLAR = {
    DECLARHEAD: {
      TIN: organizationTin,
      C_DOC: getDocumentCode(isLLC),
      C_DOC_SUB: "918",
      C_DOC_VER: 2,
      C_DOC_TYPE: 0,
      C_DOC_CNT: documentNumber,
      C_REG: getRegionCode(taxCodeDPI),
      C_RAJ: getDistrictCode(taxCodeDPI),
      PERIOD_MONTH: reportingMonth,
      PERIOD_TYPE: 1,
      PERIOD_YEAR: reportingYear,
      C_STI_ORIG: taxCodeDPI,
      C_DOC_STAN: 1,
      LINKED_DOCS: { $: { "xsi:nil": "true" } },
      D_FILL: getCurrentDate(),
      SOFTWARE: "Poster",
    },
    DECLARBODY: {
      HDATE: getCurrentDate(),
      HNUM: documentNumber,
      HTIN: organizationTin,
      HNAME: organizationName,
      T1RXXXXG1S: [{ _: cashierFullName, $: getRowNum(0) }],
      T1RXXXXG2S: [{ _: cashierTin, $: getRowNum(0) }],
      T1RXXXXG3S: [{ _: cashierKeyId, $: getRowNum(0) }],
      T1RXXXXG4S: [{ _: cashierPosition, $: getRowNum(0) }],
      M01: 1,
      HKBOS: chiefTin,
      HBOS: chiefName,
      HFILL: getCurrentDate(),
    },
  };

  return {
    DECLAR: {
      $: {
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsi:noNamespaceSchemaLocation": `${isLLC ? "J1391802.xsd" : "F1391802.xsd"}`,
      },
      ...DECLAR,
    },
  };
};

export default getCashierRegistrationDocument;
