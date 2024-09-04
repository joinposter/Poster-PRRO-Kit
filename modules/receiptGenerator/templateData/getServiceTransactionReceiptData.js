import getFiscalCompanyData from "../templateBlocks/fiscalCompanyBlock.js";
import { priceFormat } from "../helpers/receipt.js";
import { getDateTime } from "../../../helpers/common.js";
import textFooterBlock from "../templateBlocks/smartReceiptFooterBlock/textFooterBlock.js";
import { getData } from "../../../helpers/centsFormat.js";

const getServiceTransactionBody = ({ sum, isInCents, receiptConfig }) => {
  const operationType = sum > 0 ? "ВНЕСЕННЯ" : "ВИЛУЧЕННЯ";
  return [
    { type: "ruler" },
    { type: "text", value: `СЛУЖБОВЕ ${operationType}`, align: "center" },
    {
      type: "smartTable",
      hideBottomBorder: false,
      items: [
        {
          row: [
            "Готівка",
            `${priceFormat(Math.abs(getData(isInCents, sum)))}${receiptConfig.currency}`,
          ],
        },
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
      isOffline: data?.cashboxData?.isOffline,
    },
  }),
];

export default getServiceTransactionReceiptData;
