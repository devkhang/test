import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const styles = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    table: {
      "& .none": {
        display: "none",
      },

      "& thead .action": {
        width: "120px",
        textAlign: "center",
        "& button": {
          color: "white",
          backgroundColor: theme.palette.primary.main,
        },
      },

      "& tbody .show": {
        "& .open": {
          transform: "rotate(90deg)",
          transition: "0.2s",
        },
      },

      "& tbody .beneficiary": {
        "& .textfieldSL": {
          "& .MuiFilledInput-input": {
            padding: "8px",
            backgroundColor: isDark ? "#212b36" : "white",
          },
        },
      },

      "& tbody .action": {
        textAlign: "center",
        "& .btnSave": {
          color: theme.palette.primary.main,
        },
        "& .btnDelete": {
          color: "red",
        },
      },

      "& .close": {
        transform: "rotate(0)",
        transition: "0.2s",
      },

      "& tbody .child": {
        paddingLeft: "30px",
      },

      "& tbody .textField": {
        "& input": {
          padding: "8px",
          backgroundColor: isDark ? "#212b36" : "white",
        },
      },
    },
    buttons: {
      margin: "8px",
      backgroundColor: "white",
      width: "90%",
      bottom: 0,
      padding: "15px 20px",
    },
  };
});
