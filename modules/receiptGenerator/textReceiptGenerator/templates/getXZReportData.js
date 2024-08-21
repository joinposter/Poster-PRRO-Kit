import {
  DOCUMENT_TYPE_X_REPORT,
  DOCUMENT_TYPE_Z_REPORT,
} from "../../const/receipt.js";
import getFiscalCompanyData from "./blocks/fiscalCompanyBlock.js";
import textFooterBlock from "./blocks/smartFooterBlock/textFooterBlock.js";
import { getDateTime } from "../../../../helpers/common.js";
import { priceFormat } from "../../helpers/receipt.js";
import { findCashPaymentData } from "../../helpers/receiptData.js";
import {
  getData,
  getTaxSum,
  getTaxTurnover,
  getPaymentSum,
} from "../../../../helpers/centsFormat.js";

const getTaxData = (taxes) => {
  if (!taxes) return [];
  return taxes
    .sort((a, b) => a.type - b.type)
    .reduce((acc, tax) => {
      const name = {
        type: "text",
        value: `${tax.name} ${tax.program} ${tax.percent}%`,
      };
      const table = {
        type: "smartTable",
        hideTopBorder: true,
        items: [
          { row: ["Сума податку", priceFormat(getTaxSum(tax))] },
          {
            row: [
              "Обіг без податку",
              priceFormat(getTaxTurnover(tax) - getTaxSum(tax)),
            ],
          },
          { row: ["Обіг за податком", priceFormat(getTaxTurnover(tax))] },
        ],
      };
      return acc.concat([name, table]);
    }, []);
};

const getTitle = ({ type, cashboxData }) => {
  if (type === DOCUMENT_TYPE_X_REPORT) return "X-звіт";
  if (type === DOCUMENT_TYPE_Z_REPORT)
    return `Z-звіт №${cashboxData.shiftNumber}`;
  return null;
};

const fiscalCompanyData = ({ cashboxData, cashier }) =>
  getFiscalCompanyData({ ...cashboxData, cashier });

const getPayment = (payment) =>
  payment
    ? { row: [payment.payFormName, priceFormat(getPaymentSum(payment))] }
    : null;

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
      {
        row: [
          "Загальний обіг",
          priceFormat(
            getData(
              data?.realiz?.sum?.isInCents,
              data?.realiz?.sum?.isInCents
                ? data?.realiz?.sum?.value
                : data?.realiz?.sum,
            ),
          ),
        ],
      },
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
      {
        row: [
          "Загальний обіг",
          priceFormat(
            getData(
              data?.return?.sum?.isInCents,
              data?.return?.sum?.isInCents
                ? data?.return?.sum?.value
                : data?.return?.sum,
            ),
          ),
        ],
      },
      ...(data?.return?.payments
        ? data.return.payments.map(getPayment).filter(Boolean)
        : [null]),
      { row: ["Кількість чеків", data?.return?.receiptCount || "0"] },
    ].filter(Boolean),
  },
  ...getTaxData(data?.return?.taxes),
];

const calcBalance = (data) => {
  const CENTS_IN_UAH = 100;
  const realizData = data.realiz;
  const returnData = data.return;
  const cashPaymentData = realizData?.payments.find(findCashPaymentData);
  const cashRefundData = returnData?.payments.find(findCashPaymentData);

  const isInCents =
    data.shiftOpenData.balance?.isInCents ||
    cashPaymentData?.isInCents ||
    cashRefundData?.isInCents ||
    data.serviceInput?.isInCents ||
    data.serviceOutput?.isInCents;

  const cashPaymentsSum = cashPaymentData?.sum || 0;
  const cashRefundsSum = cashRefundData?.sum || 0;
  const balanceInCents = data.shiftOpenData.balance?.isInCents
    ? data.shiftOpenData.balance.value
    : (data.shiftOpenData.balance || 0) * CENTS_IN_UAH;
  const cashPaymentsSumInCents = cashPaymentData?.isInCents
    ? cashPaymentsSum
    : cashPaymentsSum * CENTS_IN_UAH;
  const serviceInputInCents = data.serviceInput?.isInCents
    ? data.serviceInput.value
    : data.serviceInput * CENTS_IN_UAH;
  const serviceOutputInCents = data.serviceOutput?.isInCents
    ? data.serviceOutput.value
    : data.serviceOutput * CENTS_IN_UAH;
  const cashRefundsSumInCents = cashRefundData?.isInCents
    ? cashRefundsSum
    : cashRefundsSum * CENTS_IN_UAH;

  const result = isInCents
    ? getData(
        true,
        balanceInCents +
          cashPaymentsSumInCents +
          serviceInputInCents +
          serviceOutputInCents -
          cashRefundsSumInCents,
      )
    : (data.shiftOpenData.balance || 0) +
      cashPaymentsSum +
      data.serviceInput +
      data.serviceOutput -
      cashRefundsSum;
  return result;
};

const cashFlowData = (data) => [
  { type: "text", value: "Готівкові кошти в касі", align: "center" },
  {
    type: "smartTable",
    items: [
      {
        row: [
          "Початковий залишок",
          priceFormat(
            getData(
              data.shiftOpenData.balance?.isInCents,
              data.shiftOpenData.balance?.isInCents
                ? data.shiftOpenData.balance.value
                : data.shiftOpenData.balance,
            ),
          ),
        ],
      },
      {
        row: [
          "Службове внесення",
          priceFormat(
            getData(
              data.serviceInput?.isInCents,
              data.serviceInput?.isInCents
                ? data.serviceInput.value
                : data.serviceInput,
            ),
          ),
        ],
      },
      {
        row: [
          "Службове вилучення",
          priceFormat(
            Math.abs(
              getData(
                data.serviceOutput?.isInCents,
                data.serviceOutput?.isInCents
                  ? data.serviceOutput.value
                  : data.serviceOutput,
              ),
            ),
          ),
        ],
      },
      { row: ["Кінцевий залишок", priceFormat(calcBalance(data))] },
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
