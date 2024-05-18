import getFiscalCompanyData from "./blocks/fiscalCompanyBlock.js";
import { priceFormat } from "../../../helpers/receipt.js";

const getServiceOutputBody = ({
  sum,
  date,
  time,
  receiptConfig,
  cashboxConfig,
}) => [
  { type: "ruler" },
  { type: "text", value: "Службове вилучення", align: "center" },
  {
    type: "smartTable",
    items: [["Готівка", `-${priceFormat(sum || 0)}${receiptConfig.currency}`]],
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
const serviceOutputBody = (data) => getServiceOutputBody(data);

const getServiceOutputBodyData = (data) => [
  ...fiscalCompanyData(data),
  ...serviceOutputBody(data),
];

export default getServiceOutputBodyData;
