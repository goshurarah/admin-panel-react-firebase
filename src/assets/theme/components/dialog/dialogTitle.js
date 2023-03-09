// Amdin panel React base styles
import typography from "assets/theme/base/typography";

// Amdin panel React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

const { size } = typography;

const dialogTitle = {
  styleOverrides: {
    root: {
      padding: pxToRem(16),
      fontSize: size.xl,
    },
  },
};

export default dialogTitle;
