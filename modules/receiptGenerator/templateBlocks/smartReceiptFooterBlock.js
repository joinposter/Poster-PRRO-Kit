import textFooterBlock from "./smartReceiptFooterBlock/textFooterBlock.js";
import htmlFooterBlock from "./smartReceiptFooterBlock/htmlFooterBlock.js";

const getSmartReceiptFooterBlock = (data, isHtml) =>
  isHtml ? htmlFooterBlock(data) : textFooterBlock(data);

export default getSmartReceiptFooterBlock;
