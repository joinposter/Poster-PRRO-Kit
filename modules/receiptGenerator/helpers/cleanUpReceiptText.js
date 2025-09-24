/* eslint-disable no-control-regex */
const RE_ASCII = /[\x00-\x1F]+/g;
const RE_UNICODE_CTRL = /[\u0001-\u001A]+/g;
const RE_EMOJI = /[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F]/gu;

const cleanUpReceiptText = (s) =>
  String(s ?? "")
    .replace(RE_ASCII, " ")
    .replace(RE_UNICODE_CTRL, " ")
    .replace(RE_EMOJI, "")
    .trim();

export default cleanUpReceiptText;
