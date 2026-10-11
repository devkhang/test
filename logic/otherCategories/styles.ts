import { Theme, alpha } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const styles = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    table: {
      "& .fix": {
        position: "sticky",
        zIndex: 10,
      },
      "& thead th": {
        textAlign: "left",
        padding: "10px 5px",
      },
      "& thead .clsStt": {
        width: "100px",
        textAlign: "center",
      },
      "& thead .clsAction": {
        right: 0,
        width: "150px",
        textAlign: "center",
      },
      "& tbody .clsStt": {
        textAlign: "center",
      },
      "& tbody .clsAction": {
        padding: "5px",
        textAlign: "center",
        backgroundColor: isDark ? "#212B36" : "#EEEEEE",
        "& button": {
          padding: "5px",
        },
      },
    },
    box: {
      padding: "8px",
      marginTop: "10px",
    },
    tab: {
      "&:not(:last-child)": {
        margin: 0,
      },
      padding: "5px 20px",
      flexDirection: "row",
    },
  };
});
