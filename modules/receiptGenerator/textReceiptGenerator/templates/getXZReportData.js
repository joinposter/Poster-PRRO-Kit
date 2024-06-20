import {
  DOCUMENT_TYPE_X_REPORT,
  DOCUMENT_TYPE_Z_REPORT,
} from "../../const/receipt.js";
import getFiscalCompanyData from "./blocks/fiscalCompanyBlock.js";
import textFooterBlock from "./blocks/smartFooterBlock/textFooterBlock.js";
import { getDateTime } from "../../../../helpers/common.js";
import { priceFormat } from "../../helpers/receipt.js";

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
          { row: ["Сума податку", priceFormat(tax.sum)] },
          { row: ["Обіг без податку", priceFormat(tax.turnover - tax.sum)] },
          { row: ["Обіг за податком", priceFormat(tax.turnover)] },
        ],
      };
      return acc.concat([name, table]);
    }, []);
};

const getTitle = ({ type, zNumber }) => {
  if (type === DOCUMENT_TYPE_X_REPORT) return "X-звіт";
  if (type === DOCUMENT_TYPE_Z_REPORT) return `Z-звіт №${zNumber || 0}`;
  return null;
};

const fiscalCompanyData = ({ cashboxData, cashier }) =>
  getFiscalCompanyData({ ...cashboxData, cashier });

const getPayment = (payment) =>
  payment ? { row: [payment.payFormName, priceFormat(payment.sum)] } : null;

const xzReportHeaderData = (data) =>
  [
    getTitle(data)
      ? { type: "text", value: getTitle(data), align: "center" }
      : null,
    {
      type: "smartTable",
      items: [
        {
          row: [
            "Зміна відкрита",
            getDateTime({ date: data?.shiftOpenData?.dateTime || "" }),
          ],
        },
        {
          row: [
            "Останній фіскальний чек",
            getDateTime({ date: data?.lastFiscalDocumentData?.dateTime || "" }),
          ],
        },
        {
          row: [
            "Фіскальний номер останього чеку",
            data?.lastFiscalDocumentData?.fiscalId || "",
          ],
        },
        { row: ["Валюта звіту", data.receiptConfig.currency] },
      ],
    },
  ].filter(Boolean);

const xzReportRealizeData = (data) => [
  { type: "text", value: "Продаж", align: "center" },
  {
    type: "smartTable",
    items: [
      { row: ["Загальний обіг", priceFormat(data?.realiz?.sum)] },
      ...(data?.realiz?.payments
        ? data.realiz.payments.map(getPayment).filter(Boolean)
        : [null]),
      { row: ["Кількість чеків", data?.realiz?.receiptCount || "0"] },
    ].filter(Boolean),
  },
  ...getTaxData(data?.realiz?.taxes),
];

const xzReportReturnData = (data) => [
  { type: "text", value: "Повернення", align: "center" },
  {
    type: "smartTable",
    items: [
      { row: ["Загальний обіг", priceFormat(data?.return?.sum)] },
      ...(data?.return?.payments
        ? data.return.payments.map(getPayment).filter(Boolean)
        : [null]),
      { row: ["Кількість чеків", data?.return?.receiptCount || "0"] },
    ].filter(Boolean),
  },
  ...getTaxData(data?.return?.taxes),
];

const cashFlowData = (data) => [
  { type: "text", value: "Готівкові кошти в касі", align: "center" },
  {
    type: "smartTable",
    items: [
      { row: ["Початковий залишок", priceFormat(null)] },
      { row: ["Службове внесення", priceFormat(data.serviceInput)] },
      { row: ["Службове вилучення", priceFormat(data.serviceOutput)] },
      { row: ["Кінцевий залишок", priceFormat(null)] },
    ],
  },
];

const getXZReportData = (data) => [
  ...fiscalCompanyData(data),
  ...xzReportHeaderData(data),
  ...xzReportRealizeData(data),
  ...xzReportReturnData(data),
  ...cashFlowData(data),
  ...textFooterBlock({
    ...data,
    dateTime: getDateTime({ date: data.dateTime }),
    footerData: {
      docType:
        data.type === DOCUMENT_TYPE_Z_REPORT
          ? "ФІСКАЛЬНИЙ ДОКУМЕНТ"
          : "СЛУЖБОВИЙ ДОКУМЕНТ",
      software: "Poster POS",
      isOffline: data?.cashboxData?.isOffline,
    },
  }),
];

export default getXZReportData;
