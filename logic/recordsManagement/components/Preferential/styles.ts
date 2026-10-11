import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) => ({
  table: {
    "& .fix": {
      position: "sticky",
      zIndex: 10,
    },
    "& thead th": {
      textAlign: "left",
      padding: "10px 5px",
      whiteSpace: "nowrap",
    },
    "& thead .clsStatus": {
      textAlign: "center",
    },
    "& thead .clsName": {
      paddingLeft: "16px",
    },
    "& tbody td": {
      textAlign: "left",
    },
    "& tbody .clsName": {
      paddingLeft: "16px",
    },
    "& tbody .clsStatus": {
      textAlign: "center",
    },
    "& .block": {
      display: "flex",
      marginTop: "8px",
      minWidth: "145px",
    },
    "& .textSearch": {
      backgroundColor: "#fff",
      padding: "4px",
      borderRadius: "8px",
      "& button": {
        padding: 0,
      },
      "& .MuiOutlinedInput-input": {
        paddingLeft: "8px",
      },
      "& .MuiOutlinedInput-root": {
        paddingRight: "8px",
      },
    },
  },

  textfield: {
    minWidth: "200px",
    "& .MuiSelect-filled": {
      padding: "8px 35px",
      backgroundColor: "white",
    },
  },

  box: {
    margin: "12px 0",
  },

  button: {
    backgroundColor: theme.palette.primary.main,
    margin: "0 16px 16px 0",
    color: "white",
  },
  textField: {
    "& .MuiInputLabel-root": {
      paddingRight: "26px",
    },
  },
  grid: { paddingTop: "24px" },
  title: { padding: "20px 0" },
  moveTitle: {
    paddingBottom: "20px",
  },
  fileHeader: { paddingTop: "20px" },
  header: { paddingBottom: "20px" },
  color: {
    color: theme.palette.primary.main,
    whiteSpace: "nowrap",
    display: "block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginRight: "24px",
  },
  contain: {
    marginRight: "8px",
    marginBottom: "16px",
    flexDirection: "row",
  },
}));
