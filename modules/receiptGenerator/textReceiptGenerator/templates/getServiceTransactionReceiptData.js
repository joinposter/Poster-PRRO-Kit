import getFiscalCompanyData from "./blocks/fiscalCompanyBlock.js";
import { priceFormat } from "../../helpers/receipt.js";
import { getDateTime } from "../../../../helpers/common.js";
import textFooterBlock from "./blocks/smartFooterBlock/textFooterBlock.js";

const getServiceTransactionBody = ({ sum, receiptConfig }) => {
  const operationType = sum > 0 ? "ВНЕСЕННЯ" : "ВИЛУЧЕННЯ";
  return [
    { type: "ruler" },
    { type: "text", value: `СЛУЖБОВЕ ${operationType}`, align: "center" },
    {
      type: "smartTable",
      hideBottomBorder: false,
      items: [
        { row: ["Готівка", `${priceFormat(sum)}${receiptConfig.currency}`] },
      ],
    },
  ];
};

const fiscalCompanyData = ({ cashboxData, cashier }) =>
  getFiscalCompanyData({ ...cashboxData, cashier });
const serviceInputBody = (data) => getServiceTransactionBody(data);

const getServiceTransactionReceiptData = (data) => [
  ...fiscalCompanyData(data),
  ...serviceInputBody(data),
  ...textFooterBlock({
    ...data,
    dateTime: getDateTime({ date: data.dateTime }),
    footerData: {
      docType: "СЛУЖБОВИЙ ЧЕК",
      software: "Poster POS",
    },
  }),
];

export default getServiceTransactionReceiptData;
