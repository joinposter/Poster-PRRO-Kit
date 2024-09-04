import textFooterBlock from "./smartXZReportFooterBlock/textFooterBlock.js";
import htmlFooterBlock from "./smartXZReportFooterBlock/htmlFooterBlock.js";

const getSmartXZReceiptFooterBlock = (data, isHtml) =>
  isHtml ? htmlFooterBlock(data) : textFooterBlock(data);

export default getSmartXZReceiptFooterBlock;
