import { getFiscalCompanyData } from "./fiscalCompanyBlock/getFiscalCompanyData.js";

const fiscalCompanyData = (data) => getFiscalCompanyData(data.cashboxConfig);

const getFiscalReceiptData = (data) => [...fiscalCompanyData(data)];

export default getFiscalReceiptData;
