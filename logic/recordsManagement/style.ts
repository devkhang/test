import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

export const style = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    div: {
      overflowX: "auto",
      paddingBottom: "3.5%",
    },
    table: {
      minWidth: (props: any) => `${props.widthTable}px`,
      "& .fix": {
        position: "sticky",
        zIndex: 10,
      },

      "& thead th": {
        whiteSpace: "nowrap",
      },

      "& thead .clsCheck": {
        left: 0,
        width: "60px",
        backgroundColor: isDark ? "#333d48" : "",
      },
      "& thead .code": {
        left: "60px",
        width: "145px",
        whiteSpace: "nowrap",
        backgroundColor: isDark ? "#333d48" : "",
        "& button": {
          padding: "5px",
        },
      },
      "& thead .fullName": {
        left: "205px",
        width: "230px",
        backgroundColor: isDark ? "#333d48" : "",
      },
      "& thead .dateOfBirth": {
        // width: "160px",
      },

      "& thead .genders": {
        // width: "120px",
      },

      "& thead .status": {
        width: "130px",
      },
      "& thead .nativePlace": {
        width: "380px",
      },

      "& thead .districts": {
        width: "160px",
      },
      "& thead .clsAction": {
        right: 0,
        width: "130px",
        textAlign: "center",
        backgroundColor: isDark ? "#333d48" : "",
        "& button": {
          backgroundColor: theme.palette.primary.main,
          color: "white",
        },
      },

      "& tbody .clsCheck": {
        backgroundColor: isDark ? "#212B36" : "#EEEEEE",
        left: 0,
      },
      "& tbody .code": {
        backgroundColor: isDark ? "#212B36" : "#EEEEEE",
        left: "60px",
        width: "145px",
      },
      "& tbody .fullName": {
        backgroundColor: isDark ? "#212B36" : "#EEEEEE",
        left: "205px",
      },
      "& tbody .nativePlace": {
        whiteSpace: "nowrap",
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "380px",
      },

      "& tbody .address": {
        whiteSpace: "nowrap",
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "280px",
        marginRight: "-90px",
      },

      "& tbody .clsStatus": {
        //textAlign: "center",
      },
      "& tbody .txtColor": {
        color: theme.palette.primary.main,
      },
      "& tbody .clsAction": {
        textAlign: "center",
        right: 0,
        backgroundColor: isDark ? "#212B36" : "#EEEEEE",
        "& button": {
          padding: "5px",
        },
        "& .btnDelete": {
          color: "#FF0000",
        },
      },
      "& tbody .span": {
        width: "280px",
        display: "inline-block",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
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
    red: {
      color: "red",
    },
    select: {
      width: "200px",
      margin: "16px 16px 8px 8px",
      "& .MuiSelect-select": {
        color: theme.palette.primary.main,
      },
      "& .MuiInputLabel-formControl": {
        color: theme.palette.primary.main,
      },
      "& .MuiInputBase-root": {
        "& .MuiSvgIcon-fontSizeMedium": {
          color: theme.palette.primary.main,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
        "& .MuiOutlinedInput-input": {
          padding: "8px 14px",
        },
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

    buttons: {
      margin: "16px 12px 8px 12px",
      width: "170px",
      padding: "5px 0",
      border: "1px solid",
      fontWeight: "normal",
      fontSize: "1rem",
    },
    selectDoet: {
      width: "45%",
      marginLeft: "8px",
    },
  };
});
