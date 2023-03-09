
import colors from "assets/theme/base/colors";
import boxShadows from "assets/theme/base/boxShadows";
import borders from "assets/theme/base/borders";

const { white } = colors;
const { md } = boxShadows;
const { borderRadius } = borders;

const tableContainer = {
  styleOverrides: {
    root: {
      backgroundColor: white.main,
      boxShadow: md,
      borderRadius: borderRadius.xl,
    },
  },
};

export default tableContainer;
