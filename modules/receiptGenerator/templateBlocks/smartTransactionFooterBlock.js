import textFooterBlock from "./smartTransactionFooterBlock/textFooterBlock.js";
import htmlFooterBlock from "./smartTransactionFooterBlock/htmlFooterBlock.js";
import { getDateTime } from "../../../helpers/common.js";

const updateTransactionData = (data) => ({
  ...data,
  dateTime: getDateTime({ date: data.dateTime }),
  footerData: {
    docType: "СЛУЖБОВИЙ ЧЕК",
    software: "Poster POS",
    isOffline: data?.isOffline,
  },
});

const getSmartTransactionFooterBlock = (data, isHtml) => {
  const updatedData = updateTransactionData(data);
  return isHtml ? htmlFooterBlock(updatedData) : textFooterBlock(updatedData);
};
export default getSmartTransactionFooterBlock;
