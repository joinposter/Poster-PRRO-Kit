import getFiscalCompanyData from "../templateBlocks/fiscalCompanyBlock.js";
import { priceFormat } from "../helpers/receipt.js";
import { getData } from "../../../helpers/centsFormat.js";
import getSmartTransactionFooterBlock from "../templateBlocks/smartTransactionFooterBlock.js";

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
          styles: {
            1: {
              extraCssClass: "text-end",
            },
          },
        },
      ],
    },
  ];
};

const fiscalCompanyData = ({ cashboxData, cashier }) =>
  getFiscalCompanyData({ ...cashboxData, cashier });
const serviceInputBody = (data) => getServiceTransactionBody(data);

const getServiceTransactionReceiptData = (data, isHtml) => [
  ...fiscalCompanyData(data),
  ...serviceInputBody(data),
  ...getSmartTransactionFooterBlock(data, isHtml),
];

export default getServiceTransactionReceiptData;
