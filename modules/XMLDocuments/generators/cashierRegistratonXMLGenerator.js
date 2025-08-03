import { getRowNum } from "./commonXMLTagGenerator.js";

const getCashierRegistrationDocument = (data) => {
  const {
    documentNumber,
    regionCode,
    districtCode,
    reportingMonth,
    reportingYear,
    taxCodeDPI,
    fillDate,
    softwareName,

    // Тіло декларації
    operationDate,
    operationNumber,
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
      C_DOC: "J13",
      C_DOC_SUB: "918",
      C_DOC_VER: 2,
      C_DOC_TYPE: 0,
      C_DOC_CNT: documentNumber,
      C_REG: regionCode,
      C_RAJ: districtCode,
      PERIOD_MONTH: reportingMonth,
      PERIOD_TYPE: 1,
      PERIOD_YEAR: reportingYear,
      C_STI_ORIG: taxCodeDPI,
      C_DOC_STAN: 1,
      LINKED_DOCS: { $: { "xsi:nil": "true" } },
      D_FILL: fillDate,
      SOFTWARE: softwareName,
    },
    DECLARBODY: {
      HDATE: operationDate,
      HNUM: operationNumber,
      HTIN: organizationTin,
      HNAME: organizationName,
      T1RXXXXG1S: [{ _: cashierFullName, $: getRowNum(0) }],
      T1RXXXXG2S: [{ _: cashierTin, $: getRowNum(0) }],
      T1RXXXXG3S: [{ _: cashierKeyId, $: getRowNum(0) }],
      T1RXXXXG4S: [{ _: cashierPosition, $: getRowNum(0) }],
      M01: 1,
      HKBOS: chiefTin,
      HBOS: chiefName,
      HFILL: fillDate,
    },
  };

  return {
    DECLAR: {
      $: {
        "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        "xsi:noNamespaceSchemaLocation": "J1391802.xsd",
      },
      ...DECLAR,
    },
  };
};

export default getCashierRegistrationDocument;
