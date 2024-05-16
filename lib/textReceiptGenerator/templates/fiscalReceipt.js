import { getFiscalCompanyData } from "./fiscalCompanyBlock/getFiscalCompanyData.js";
import { cashboxConfig } from "./mock.js";

const fiscalCompanyData = getFiscalCompanyData(cashboxConfig);

const fiscalReceiptData = [...fiscalCompanyData];

export default fiscalReceiptData;
