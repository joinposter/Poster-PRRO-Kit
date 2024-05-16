import { getFiscalCompanyData } from "./fiscalCompanyBlock/getFiscalCompanyData.js";
import { priceFormat } from "../../../helpers/receipt.js";

const getServiceInputBody = ({
  sum,
  date,
  time,
  receiptConfig,
  cashboxConfig,
}) => [
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

const fiscalCompanyData = (data) => getFiscalCompanyData(data.cashboxConfig);
const serviceInputBody = (data) => getServiceInputBody(data);

const getServiceInputReceiptData = (data) => [
  ...fiscalCompanyData(data),
  ...serviceInputBody(data),
];

export default getServiceInputReceiptData;