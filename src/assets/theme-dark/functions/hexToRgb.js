
import chroma from "chroma-js";

function hexToRgb(color) {
  return chroma(color).rgb().join(", ");
}

export default hexToRgb;
