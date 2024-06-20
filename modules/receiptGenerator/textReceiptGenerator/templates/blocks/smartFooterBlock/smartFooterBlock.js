import textFooterBlock from "./textFooterBlock.js";
import htmlFooterBlock from "./htmlFooterBlock.js";

const getSmartFooterBlock = (data, isHtml) =>
  isHtml ? htmlFooterBlock(data) : textFooterBlock(data);

export default getSmartFooterBlock;
