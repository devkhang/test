import { Theme } from "@material-ui/core";
import {makeStyles} from "@material-ui/styles"

export const useStyles = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    textField: {
      margin: "3% 0",
      width: "100%",
    },
    iconShow: {
      color: isDark ? "white" : theme.palette.primary.main,
    },
  }
});