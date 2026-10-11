import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const styles = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    grid: {
      paddingTop: "10px",
    },
    contain: {
      marginTop: "15px",
      display: "flex",
      justifyContent: "flex-end",
    },
    btn: {
      width: "125px",
      backgroundColor: theme.palette.primary.main,
      marginRight: "15px",
      color: "white",
    },
    btnColor: {
      width: "125px",
      color: theme.palette.primary.main,
    },
    textField: {
      "& .MuiInputLabel-root": {
        paddingRight: "26px",
      },
    },
  };
});
