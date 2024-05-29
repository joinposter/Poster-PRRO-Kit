import getFiscalCompanyData from "./blocks/fiscalCompanyBlock.js";
import { priceFormat } from "../../../helpers/receipt.js";
import { getDateTime } from "../../../helpers/common.js";

const getServiceTransactionBody = ({
  sum,
  dateTime,
  receiptConfig,
  cashboxData,
}) => {
  const operationType = sum > 0 ? "ВНЕСЕННЯ" : "ВИЛУЧЕННЯ";
  const date = getDateTime({ date: dateTime, format: "date" });
  const time = getDateTime({ date: dateTime, format: "time" });
  return [
    { type: "ruler" },
    { type: "text", value: `СЛУЖБОВЕ ${operationType}`, align: "center" },
    {
      type: "smartTable",
      items: [["Готівка", `${priceFormat(sum || 0)}${receiptConfig.currency}`]],
    },
    {
      type: "smartTable",
      items: [
        [date, time],
        ["ФН ПРРО", cashboxData.cashbox],
      ],
    },
    { type: "ruler" },
    { type: "text", value: "СЛУЖБОВИЙ ЧЕК", align: "center" },
    { type: "text", value: "POSTER", align: "center" },
    { type: "ruler" },
  ];
};

const fiscalCompanyData = (data) => getFiscalCompanyData(data.cashboxData);
const serviceInputBody = (data) => getServiceTransactionBody(data);

const getServiceTransactionReceiptData = (data) => [
  ...fiscalCompanyData(data),
  ...serviceInputBody(data),
];

export default getServiceTransactionReceiptData;
