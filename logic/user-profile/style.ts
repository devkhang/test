import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const useStyles = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    loading: {
      display: "block",
    },
    oveflow: {
      width: "100%",
      overflowY: "auto",
    },
    clsFirstCard: {
      overflowY: "auto",
      marginBottom: "1.5%",
      "& .clsDiv": {
        width: "100%",
        margin: "1% 2%",
        fontWeight: "bold",
        fontSize: "20px",
      },
      "& .clsGridIM": {
        minWidth: "180px",
        padding: "1%",
        marginBottom: "0.5%",
        boxShadow:
          "0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)",
        borderRadius: "15px",
        " & .clsDivStatus": {
          margin: "35% 0 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        },
      },
      "& .clsGridForm": {
        boxShadow:
          "0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)",
        borderRadius: "15px",
        padding: "1%",
        marginBottom: "0.5%",
        "& div": {
          marginBottom: "1%",
        },
      },
    },

    clsSeCard: {
      marginBottom: "2%",
      "& .clsDiv": {
        width: "100%",
        margin: "1% 2%",
        fontWeight: "bold",
        fontSize: "20px",
      },
      "& .clsGridForm": {
        marginBottom: "1.5%",
        marginLeft: "29%",
        boxShadow:
          "0 0 2px 0 rgb(145 158 171 / 24%), 0 16px 32px -4px rgb(145 158 171 / 24%)",
        borderRadius: "15px",
        padding: "1%",
        "& div": {
          marginBottom: "1%",
        },
      },
    },

    buttons: {
      margin: "1% 2% 0 0",
      position: "absolute",
      backgroundColor: "white",
      width: "99%",
      bottom: 0,
      padding: "15px 5%",
    },
    disabled: {
      backgroundColor: theme.palette.grey["200"],
      cursor: "not-allowed",
    },
  };
});
