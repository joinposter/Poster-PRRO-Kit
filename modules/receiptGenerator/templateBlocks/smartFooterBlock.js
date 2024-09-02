import textFooterBlock from "./smartFooterBlock/textFooterBlock.js";
import htmlFooterBlock from "./smartFooterBlock/htmlFooterBlock.js";

const getSmartFooterBlock = (data, isHtml) =>
  isHtml ? htmlFooterBlock(data) : textFooterBlock(data);

export default getSmartFooterBlock;
