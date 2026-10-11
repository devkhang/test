import { Theme, alpha } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const styles = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    field: { marginBottom: "32px" },
    paper: { padding: "32px", margin: "16px 0" },
    gridIM: {
      width: "17%",
      minWidth: "208px",
      padding: "20px",
      margin: "32px auto",
      boxShadow:
        "0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)",
      borderRadius: "15px",
    },
    text: { paddingTop: "10px", fontSize: "18px", textAlign: "center" },
    button: { display: "flex", justifyContent: "flex-end" },
    btn: {
      width: "120px",
      backgroundColor: theme.palette.primary.main,
      margin: "8px 0",
      color: "white",
    },
  };
});
