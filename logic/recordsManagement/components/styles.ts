import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

export const styles = makeStyles((theme: Theme) => ({
  loading: { marginTop: "40px" },
  title: { margin: "18px 0" },
  title2: { paddingBottom: "16px" },
  header: { paddingBottom: "16px" },
  note: { margin: "30px 0", height: "280px" },
  title3: { marginTop: "16px" },
  ceilEnd: {
    textAlign: "center",
    width: "120px",
    padding: 0,
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    position: "absolute",
  },

  gridItem: {
    paddingTop: "24px",
    paddingLeft: "40px",
  },

  textField: {
    "& .MuiInputLabel-root": {
      paddingRight: "26px",
    },
  },

  txtField: {
    "& .MuiInputBase-root": {
      //paddingLeft: "20%",
    },
  },

  minWidth: {
    minWidth: "35px",
    "& input": {
      textAlign: "center",
    },
  },

  table: {
    "& .fix": {
      position: "sticky",
      zIndex: 10,
    },
    "& thead th": {
      textAlign: "left",
      padding: "10px 8px",
      whiteSpace: "nowrap",
    },
    "& thead .clsStatus": {
      textAlign: "center",
      width: "90px",
    },
    "& thead .address": {
      width: "250px",
    },
    "& thead .clsAction": {
      right: 0,
      width: "130px",
      paddingRight: "20px",
      textAlign: "center",
      "& button": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
      },
    },
    "& tbody .name": {
      whiteSpace: "nowrap",
    },
    "& tbody .center": {
      textAlign: "center",
      width: "90px",
    },
    "& tbody .address": {
      width: "250px",
      display: "block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    "& tbody .disability": {
      minWidth: "400px",
    },
  },
}));
