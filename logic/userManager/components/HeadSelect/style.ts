import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const style = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    gird: {
      margin: "15px 0 15px 8px",
      display: "block",
      "& .clsFirstG": {
        marginBottom: "15px",
        "& .select": {
          backgroundColor: isDark ? "" : "white",
        },
      },
      "& .clsSecondG": {
        marginBottom: "15px",
        "& .buttons": {
          marginLeft: "15%",
        },
        "& .select": {
          backgroundColor: isDark ? "" : "white",
        },
      },
    },
    loading: {
      display: "block",
    },
  };
});
