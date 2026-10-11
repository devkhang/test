import { Theme, alpha } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const styles = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    table: {
      minWidth: "700px",
      "& .none": {
        display: "none",
      },

      "& thead .show": {
        width: "70px",
        textAlign: "center",
      },

      "& thead .status": {
        width: "100px",
      },

      "& thead .allowance": {
        width: "130px",
        textAlign: "center",
      },

      "& thead .code": {
        width: "60px",
      },

      "& thead .action": {
        width: "120px",
        textAlign: "center",
        "& button": {
          backgroundColor: theme.palette.primary.main,
          color: "white",
        },
      },

      "& tbody .show": {
        "& .open": {
          transform: "rotate(90deg)",
          transition: "0.2s",
        },

        "& .close": {
          transform: "rotate(0)",
          transition: "0.2s",
        },
      },

      "& tbody .name": {
        maxWidth: "500px",
        "& .span": {
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          display: "block",
        },
      },

      "& tbody .child": {
        paddingLeft: "30px",
      },

      "& tbody .allowance": {
        width: "130px",
        textAlign: "center",
      },

      "& tbody .textField": {
        "& input": {
          padding: "8px",
          backgroundColor: isDark ? "#212b36" : "white",
        },
      },

      "& tbody .action": {
        alignItem: "center",
        "& .btnSave": {
          color: theme.palette.primary.main,
        },
        "& .btnDelete": {
          color: "red",
        },
      },
    },

    iconShow: {
      color: isDark ? "white" : theme.palette.primary.main,
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
    },
  };
});
