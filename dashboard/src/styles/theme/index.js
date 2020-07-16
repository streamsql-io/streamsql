import blueGrey from "@material-ui/core/colors/blueGrey";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

export const GREEN = "#27ae60";
export const PURPLE = "#8e44ad";

const themeSpec = {
  palette: {
    primary: { main: GREEN, contrastText: "#FFFFFF" },
    secondary: { main: PURPLE },
    text: {
      primary: blueGrey[900],
      secondary: blueGrey[700],
    },
  },
};

let theme = createMuiTheme(themeSpec);
theme = responsiveFontSizes(theme);

export default theme;
