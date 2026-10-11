import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const styles = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    div: {
      overflowX: "auto",
      paddingBottom: "3.5%",
    },
    table: {
      //minWidth: "1650px",
      "& .fix": {
        position: "sticky",
        zIndex: 10,
      },
      "& thead th": {
        textAlign: "left",
        padding: "10px 5px",
        whiteSpace: "nowrap",
      },
      "& thead .clsCheckH": {
        left: 0,
        padding: "10px 5px",
        width: "60px",
        backgroundColor: isDark ? "#333d48" : "",
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
      "& thead .code": {
        paddingLeft: "5px",
        width: "135px",
      },
      "& thead .clsStatus": {
        textAlign: "center",
      },
      "& thead .clsName": {
        paddingLeft: "16px",
        width: "250px",
      },
      "& thead .dateOfBirth": {
        width: "135px",
      },
      "& tbody .code": {
        paddingLeft: "5px",
        width: "135px",
      },
      "& tbody td": {
        textAlign: "left",
      },
      "& thead .date": {
        minWidth: "160px",
      },
      "& thead .receiveDate": {
        minWidth: "125px",
      },
      "& tbody .clsName": {
        paddingLeft: "16px",
        whiteSpace: "nowrap",
      },
      "& tbody .colorTxt": {
        color: theme.palette.primary.main,
        fontWeight: "600",
        textAlign: "center",
        whiteSpace: "nowrap",
      },
      "& tbody .redTxt": {
        color: "red",
        fontWeight: "600",
        textAlign: "center",
        whiteSpace: "nowrap",
      },

      "& tbody .color": {
        color: theme.palette.primary.main,
        fontWeight: "bold",
        fontSize: "17px",
        paddingLeft: "16px",
        whiteSpace: "nowrap",
      },
      "& tbody .receiver": {
        whiteSpace: "nowrap",
      },
      "& tbody .clsCheckBd": {
        backgroundColor: isDark ? "#212B36" : "#EEEEEE",
        left: 0,
      },
      "& tbody .prefers": {
        width: "650px",
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
      "& tbody .clsStatus": {
        textAlign: "center",
      },
      "& tbody .date": {
        minWidth: "160px",
      },
      "& tbody .receiveDate": {
        minWidth: "125px",
      },
      "& tbody .clsActionBD": {
        padding: "5px",
        textAlign: "center",
        backgroundColor: isDark ? "#212B36" : "#EEEEEE",
        "& button": {
          padding: "5px",
        },
        "& .btnDelete": {
          color: "#FF0000",
        },
      },

      "& .textSearch": {
        backgroundColor: "#fff",
        borderRadius: "8px",
        borderColor: "#eee",
        "& button": {
          padding: 0,
        },
        "& .MuiOutlinedInput-input": {
          paddingLeft: "5px",
        },
        "& .MuiOutlinedInput-root": {
          paddingRight: "5px",
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
    stepButton: {
      "& .MuiStepIcon-root:not(.Mui-active)": {
        fill: "currentcolor",
      },
      "& .MuiSvgIcon-root-MuiStepIcon-root.Mui-completed": {
        color: theme.palette.primary.main,
      },
    },
    currentStep: {
      "& .MuiStepIcon-root:not(.Mui-active)": {
        fill: theme.palette.primary.main,
      },
    },

    red: {
      color: "red",
    },
    select: {
      "& .MuiSelect-select": {
        color: theme.palette.primary.main,
      },
    },
    note: { minHeight: "300px" },
    button: {
      width: "135px",
      backgroundColor: theme.palette.primary.main,
      color: "white",
    },
    total: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
  };
});
