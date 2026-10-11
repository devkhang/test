import { Theme, alpha } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const styles = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    div: {
      overflowX: "auto",
    },
    table: {
      minWidth: "1200px",

      "& thead": {
        whiteSpace: "nowrap",
      },

      "& .fix": {
        position: "sticky",
        zIndex: 1,
      },

      "& thead .check": {
        width: "50px",
      },

      "& thead .no": {
        width: "145px",
      },

      "& thead .attachedFile": {
        textAlign: "center",
      },

      "& thead .action": {
        right: 0,
        textAlign: "center",
        width: "120px",
        backgroundColor: isDark ? "#29313a" : "#f4f6f8",
        "& button": {
          backgroundColor: theme.palette.primary.main,
          color: "white",
        },
      },

      "& thead .documentType": {
        width: "130px",
      },

      "& tbody .textField": {
        "& .MuiFilledInput-input": {
          paddingTop: "11px",
          paddingBottom: "4px",
          backgroundColor: isDark ? "#161c24" : "white",
        },
      },

      "& tbody .attachedFile": {
        textAlign: "center",
        "& a": {
          cursor: "pointer",
          color: theme.palette.primary.main,
        },
        "& .btnUpFile": {
          color: theme.palette.primary.main,
        },
      },

      "& tbody .action": {
        textAlign: "center",
        right: 0,
        backgroundColor: isDark ? "#161c24" : "rgb(244, 246, 248)",
        "& .BtnEdit": {
          color: theme.palette.primary.main,
        },
        "& .btnDelete": {
          color: "red",
        },
      },
    },

    box: {
      padding: "16px",
    },

    boxHead: {
      paddingLeft: "16px",

      "& .textField": {
        // width: "110px",
        textAlign: "center",
        "& .MuiFilledInput-input": {
          paddingTop: "11px",
          paddingBottom: "4px",
          backgroundColor: isDark ? "#161c24" : "white",
        },
      },
    },

    card: {
      padding: "16px",
      "& .box": {
        padding: "0 10px",
        maxHeight: "300px",
        overflow: "auto",
      },
    },

    texSearch: {
      width: "250px",
    },

    displaynone: {
      display: "none",
    },

    red: { color: "red" },
  };
});
