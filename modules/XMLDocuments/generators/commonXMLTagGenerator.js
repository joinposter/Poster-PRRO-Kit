import { formatNumber } from "../../../helpers/common.js";
import { getFiscalNumberControlCode } from "../helpers/xmlGenerator.js";
// import { getCashboxData, isCashboxModeOffline } from "../cashbox.js";
// import { getOfflineSessionData } from "../queue.js";

const getDateTimeFields = (date) => {
  if (!Date.parse(date)) {
    return {
      ORDERDATE: "",
      ORDERTIME: "",
    };
  }
  const localISOTime = new Date(date);
  const year = formatNumber(localISOTime.getFullYear(), "yyyy");
  const month = formatNumber(localISOTime.getMonth() + 1, "MM");
  const day = formatNumber(localISOTime.getDate(), "dd");
  const hours = formatNumber(localISOTime.getHours(), "HH");
  const minutes = formatNumber(localISOTime.getMinutes(), "mm");
  const seconds = formatNumber(localISOTime.getSeconds(), "ss");

  return {
    ORDERDATE: [day, month, year].join(""),
    ORDERTIME: [hours, minutes, seconds].join(""),
  };
};

const getHeader = (operationData, getTypeFields = () => {}) => {
  const { cashboxData, dateTime } = operationData;
  // const cashboxData = await getCashboxData(cashbox);

  return {
    ...getTypeFields(),
    ...getUIDFields(operationData),
    ...getOrganizationFields(cashboxData),
    ...getDateTimeFields(dateTime),
    ...getDocumentNumberFields(operationData),
    ...getCashboxFields(cashboxData),
    ...getCashierFields(),
    ...getVersionFields(),
    ...getOfflineFields({ operationData }),
    ...getTestingModeFields(),
  };
};

const getDoctype = (doctype, subtype) => {
  const DOCSUBTYPE = subtype !== undefined ? { DOCSUBTYPE: subtype } : {};
  return {
    DOCTYPE: doctype,
    ...DOCSUBTYPE,
  };
};

const getRowNum = (index = 0) => ({ ROWNUM: index + 1 });

const rowsToMapper = (rows, Mapper) => ({
  ROW: rows.map(Mapper),
});

export const getUIDFields = (operationData) => {
  const { uid: UID } = operationData;
  return { UID };
};

export const getOrganizationFields = (cashboxData) => {
  const {
    tin: TIN,
    name: ORGNM,
    pointName: POINTNM,
    pointAddress: POINTADDR,
  } = cashboxData;

  return {
    TIN,
    ORGNM,
    POINTNM,
    POINTADDR,
  };
};

export const getDocumentNumberFields = (operationData) => {
  const {
    cashboxData: { documentNumber: ORDERNUM },
  } = operationData;
  return { ORDERNUM };
};

export const getCashboxFields = (cashboxData) => {
  const { cashboxLocalNumber: CASHDESKNUM, cashbox: CASHREGISTERNUM } =
    cashboxData;

  return {
    CASHDESKNUM,
    CASHREGISTERNUM,
  };
};

export const getCashierFields = () => ({
  CASHIER: "Шевченко Т.Г.",
});

export const getVersionFields = () => ({
  VER: 1,
});

export const getTestingModeFields = () => ({
  TESTING: true,
});

const getOfflineFields = ({ operationData, operationSum }) => {
  const {
    cashboxData: { isCashboxModeOffline: isOffline, previousDocumentHash },
  } = operationData;

  return isOffline
    ? {
        ORDERTAXNUM: getOfflineFiscalNumber({
          operationData,
          operationSum,
        }),
        OFFLINE: true,
        PREVDOCHASH: previousDocumentHash,
      }
    : {};
};

const getOfflineFiscalNumber = ({ operationData, operationSum }) => {
  const { cashboxData, dateTime } = operationData;
  const { ORDERDATE, ORDERTIME } = getDateTimeFields(dateTime);

  const {
    cashboxLocalNumber,
    cashbox,
    getOfflineSessionData: { id, seed },
    documentNumber,
    offlineDocumentNumber,
    previousDocumentHash,
  } = cashboxData;

  const secretParts = [
    seed,
    ORDERDATE,
    ORDERTIME,
    documentNumber,
    cashbox,
    cashboxLocalNumber,
  ];
  if (operationSum) {
    secretParts.push(operationSum);
  }
  if (previousDocumentHash) {
    secretParts.push(previousDocumentHash);
  }

  const secretPartsString = secretParts.join(",");
  const controlCode = getFiscalNumberControlCode(secretPartsString);

  return `${id}.${offlineDocumentNumber}.${controlCode}`;
};

export {
  getHeader,
  getDateTimeFields,
  getOfflineFields,
  getDoctype,
  getRowNum,
  rowsToMapper,
  getOfflineFiscalNumber,
};
