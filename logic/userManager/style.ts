import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const style = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    div: {
      overflowX: "auto",
      paddingBottom: "3.5%",
    },
    table: {
      minWidth: "1350px",
      "& .fix": {
        position: "sticky",
        zIndex: 10,
      },
      "& thead th": {
        padding: "10px",
      },
      "& thead .clsCheckH": {
        left: 0,
        padding: "10px",
        width: "60px",
        backgroundColor: isDark ? "#333d48" : "",
      },
      "& thead .name": {
        left: "60px",
        width: "260px",
        whiteSpace: "nowrap",
        backgroundColor: isDark ? "#333d48" : "",
      },
      "& thead .position": {
        width: "260px",
      },
      "& thead .clsStatus": {
        width: "125px",
      },
      "& thead .clsAction": {
        right: 0,
        width: "130px",
        paddingRight: "20px",
        textAlign: "center",
        backgroundColor: isDark ? "#333d48" : "",
        "& button": {
          backgroundColor: theme.palette.primary.main,
          color: "white",
        },
      },
      "& thead .textSearch": {
        backgroundColor: isDark ? "#212B36" : "white",
        "& .MuiOutlinedInput-input": {
          padding: "8px 0",
        },
      },
      "& tbody .clsCheckBd": {
        backgroundColor: isDark ? "#212B36" : "#EEEEEE",
        left: 0,
      },
      "& tbody .name": {
        backgroundColor: isDark ? "#212B36" : "#EEEEEE",
        left: "60px",
        whiteSpace: "nowrap",
      },
      "& tbody .position": {
        width: "260px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        display: "block",
      },
      "& tbody .clsActionBD": {
        padding: "5px",
        right: 0,
        backgroundColor: isDark ? "#212B36" : "#EEEEEE",
        "& button": {
          padding: "5px",
        },
        "& .BtnKey": {
          transform: "rotate(130deg)",
        },
        "& .btnDelete": {
          color: "#FF0000",
        },
      },
    },
    footer: {
      right: 0,
      position: "absolute",
    },
    loading: {
      display: "block",
    },
    btnYes: {
      backgroundColor: theme.palette.primary.main,
      color: "#FFFFFF",
    },
    btnNo: {
      backgroundColor: "#DFE3E8",
      color: "#000000",
    },
    card: {
      padding: "16px",
      "& .box": {
        maxHeight: "300px",
        overflow: "auto",
      },
    },
    box: {
      width: "100%",
      margin: "1%",
      padding: "1% 2%",
      borderBottom: `3px solid ${theme.palette.primary.main}`,
      "& span": {
        marginRight: "30px",
      },
    },
    red: {
      color: "red",
    },
  };
});
