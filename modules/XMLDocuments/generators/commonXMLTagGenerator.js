import { formatNumber } from "../../../helpers/common.js";
import { getFiscalNumberControlCode } from "../helpers/xmlGenerator.js";

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

  return {
    ...getTypeFields(),
    ...getUIDFields(operationData),
    ...getOrganizationFields(cashboxData),
    ...getDateTimeFields(dateTime),
    ...getDocumentNumberFields(cashboxData),
    ...getCashboxFields(cashboxData),
    ...getCashierFields(operationData),
    ...getVersionFields(),
    ...getOfflineFields({ operationData }),
    ...getTestingModeFields(cashboxData),
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
    ipn,
  } = cashboxData;

  const IPN = ipn ? { IPN: ipn } : {};

  return {
    TIN,
    ...IPN,
    ORGNM,
    POINTNM,
    POINTADDR,
  };
};

export const getDocumentNumberFields = (cashboxData) => {
  const { nextDocumentNumber: ORDERNUM } = cashboxData;
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

export const getCashierFields = ({ cashier }) => {
  const CASHIER = cashier ? { CASHIER: cashier } : {};
  return CASHIER;
};

export const getRevokeFields = ({ revoke }) => {
  const REVOKELASTONLINEDOC = revoke ? { REVOKELASTONLINEDOC: true } : {};
  return REVOKELASTONLINEDOC;
};

export const getVersionFields = () => ({
  VER: 1,
});

export const getTestingModeFields = ({ isTestingMode }) => {
  const TESTING = isTestingMode ? { TESTING: true } : {};
  return TESTING;
};

const getOfflineFields = ({ operationData, operationSum }) => {
  const {
    cashboxData: {
      isOffline,
      offlineSessionData: { lastDocumentHash },
    },
  } = operationData;

  return isOffline
    ? {
        ORDERTAXNUM: getOfflineFiscalNumber({
          operationData,
          operationSum,
        }),
        OFFLINE: true,
        PREVDOCHASH: lastDocumentHash,
      }
    : {};
};

const getOfflineFiscalNumber = ({ operationData, operationSum }) => {
  const { cashboxData, dateTime } = operationData;
  const { ORDERDATE, ORDERTIME } = getDateTimeFields(dateTime);

  const {
    cashboxLocalNumber,
    cashbox,
    nextDocumentNumber,
    offlineSessionData: {
      id,
      seed,
      nextOfflineDocumentNumber,
      lastDocumentHash,
    },
  } = cashboxData;

  const secretParts = [
    seed,
    ORDERDATE,
    ORDERTIME,
    nextDocumentNumber,
    cashbox,
    cashboxLocalNumber,
  ];
  if (operationSum) {
    secretParts.push(operationSum);
  }
  if (lastDocumentHash) {
    secretParts.push(lastDocumentHash);
  }

  const secretPartsString = secretParts.join(",");
  const controlCode = getFiscalNumberControlCode(secretPartsString);

  return `${id}.${nextOfflineDocumentNumber}.${controlCode}`;
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
