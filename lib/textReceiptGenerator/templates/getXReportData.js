import {
  DOCUMENT_TYPE_X_REPORT,
  DOCUMENT_TYPE_Z_REPORT,
} from "../../../const/receipt.js";
import getFiscalCompanyData from "./blocks/fiscalCompanyBlock.js";
import getFooterData from "./blocks/footerBlock.js";
import { getDateTime } from "../../../helpers/common.js";
import { priceFormat } from "../../../helpers/receipt.js";

const getTaxData = (taxes) => {
  if (!taxes) return [];
  return taxes
    .sort((a, b) => a.type - b.type)
    .reduce((acc, tax) => {
      const name = {
        type: "text",
        value: `${tax.name} (${tax.program}) ${tax.percent}%`,
      };
      const table = {
        type: "smartTable",
        hideTopBorder: true,
        items: [
          ["Сума податку", priceFormat(tax.sum)],
          ["Обіг без податку", priceFormat(tax.turnover - tax.sum)],
          ["Обіг за податком", priceFormat(tax.turnover)],
        ],
      };
      return acc.concat([name, table]);
    }, []);
};

const getTitle = ({ type }) => {
  if (type === DOCUMENT_TYPE_X_REPORT) return "X-звіт";
  if (type === DOCUMENT_TYPE_Z_REPORT) return "Z-звіт";
  return null;
};

const fiscalCompanyData = (data) => getFiscalCompanyData(data.cashboxData);

const xzReportHeaderData = (data) =>
  [
    getTitle(data)
      ? { type: "text", value: getTitle(data), align: "center" }
      : null,
    {
      type: "smartTable",
      items: [
        [
          "Зміна відкрита",
          getDateTime({ date: data?.shiftOpenData?.dateTime || "" }),
        ],
        [
          "Останній фіскальний чек",
          getDateTime({ date: data?.lastFiscalDocumentData?.dateTime || "" }),
        ],
        [
          "Фіскальний номер останього чеку",
          data?.lastFiscalDocumentData?.fiscalId || "",
        ],
        ["Валюта звіту", data.receiptConfig.currency],
      ],
    },
  ].filter(Boolean);

const xzReportRealizeData = (data) => [
  { type: "text", value: "Продаж", align: "center" },
  {
    type: "smartTable",
    items: [
      ["Загальний обіг", priceFormat(data?.realiz?.sum)],
      ...(data?.realiz?.payments
        ? data.realiz.payments
            .map((payment) =>
              payment ? [payment.payFormName, priceFormat(payment.sum)] : null,
            )
            .filter(Boolean)
        : [null]),
      ["Кількість чеків", data?.realiz?.receiptCount || "0"],
    ].filter(Boolean),
  },
  ...getTaxData(data?.realiz?.taxes),
];

const xzReportReturnData = (data) => [
  { type: "text", value: "Повернення", align: "center" },
  {
    type: "smartTable",
    items: [
      ["Загальний обіг", priceFormat(data?.return?.sum)],
      ...(data?.return?.payments
        ? data.return.payments
            .map((payment) =>
              payment ? [payment.payFormName, priceFormat(payment.sum)] : null,
            )
            .filter(Boolean)
        : [null]),
      ["Кількість чеків", data?.return?.receiptCount || "0"],
    ].filter(Boolean),
  },
  ...getTaxData(data?.return?.taxes),
];

const cashFlowData = (data) => [
  { type: "text", value: "Готівкові кошти в касі", align: "center" },
  {
    type: "smartTable",
    items: [
      ["Початковий залишок", priceFormat(null)],
      ["Службове внесення", priceFormat(data.serviceInput)],
      ["Службове вилучення", priceFormat(data.serviceOutput)],
      ["Кінцевий залишок", priceFormat(null)],
    ],
  },
];

const getServiceInputReceiptData = (data) => [
  ...fiscalCompanyData(data),
  ...xzReportHeaderData(data),
  ...xzReportRealizeData(data),
  ...xzReportReturnData(data),
  ...cashFlowData(data),
  ...getFooterData({
    ...data,
    dateTime: getDateTime({ date: data.dateTime }),
    footerData: {
      docType: "СЛУЖБОВИЙ ДОКУМЕНТ",
      software: "Poster POS",
    },
  }),
];

export default getServiceInputReceiptData;
