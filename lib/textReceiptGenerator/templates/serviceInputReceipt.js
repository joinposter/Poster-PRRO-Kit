import { getFiscalCompanyData } from "./fiscalCompanyBlock/getFiscalCompanyData.js";
import { cashboxConfig, getServiceInputBodyMock } from "./mock.js";
import { priceFormat } from "../../../helpers/receipt.js";

const getServiceInputBody = ({ sum, date, time, receiptConfig }) => [
  { type: "ruler" },
  { type: "text", value: "Службове внесення", align: "center" },
  {
    type: "smartTable",
    items: [["Готівка", `${priceFormat(sum || 0)}${receiptConfig.currency}`]],
  },
  {
    type: "smartTable",
    items: [
      [date, time],
      ["ФН ПРРО", cashboxConfig.fn],
    ],
  },
  { type: "ruler" },
  { type: "text", value: "СЛУЖБОВИЙ ЧЕК", align: "center" },
  { type: "text", value: "POSTER", align: "center" },
  { type: "ruler" },
];

const fiscalCompanyData = getFiscalCompanyData(cashboxConfig);
const serviceInputBody = getServiceInputBody(getServiceInputBodyMock);

const serviceInputReceiptData = [...fiscalCompanyData, ...serviceInputBody];

export default serviceInputReceiptData;
