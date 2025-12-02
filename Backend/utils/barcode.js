import bwipjs from "bwip-js";

// برگرداندن Buffer PNG برای barcodeText
export const generateBarcodePng = async (barcodeText) => {
  const png = await bwipjs.toBuffer({
    bcid: "code128", // نوع بارکد
    text: barcodeText,
    scale: 3,
    height: 10,
    includetext: true,
    textxalign: "center",
  });
  return png; // Buffer
};
