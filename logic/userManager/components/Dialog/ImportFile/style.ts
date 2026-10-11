import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

export const style = makeStyles((theme: Theme) => ({
  div: {
    marginTop: "24px",
    marginBottom:"50px"
  },
  stack: {
    position: "absolute",
    bottom: 0,
    width: "98%",
    padding: "15px 0",
    backgroundColor: "white",
  },
  table: {
    "& thead th": {
      textAlign: "center",
    },
    "& thead .clsUsername": {
      width: "14%",
    },
    "& thead .clsAction": {
      width: "9%",
    },
    "& tbody td": {
      textAlign: "center",
    },
    "& .fix": {
      position: "sticky",
      top: "0",
      zIndex: 1,
      backgroundColor: "whitesmoke",
    },
    "& tbody .red": {
      color: 'red'
    }
  },
  card: {
    outline: "none",
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(5, 1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.neutral,
    border: `1px dashed ${theme.palette.grey[500_32]}`,
    "&:hover": { opacity: 0.72, cursor: "pointer" },
    [theme.breakpoints.up("md")]: { textAlign: "left", flexDirection: "row" },
  },
}));
