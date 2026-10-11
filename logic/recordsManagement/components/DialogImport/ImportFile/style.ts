import { makeStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";

export const style = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  const width = (props: any) =>
    ["LS", "AQ"].includes(props.categoryKey)
      ? "4192px"
      : ["LT", "TKN", "HH"].includes(props.categoryKey)
      ? "3510px"
      : ["BM", "AHLL", "AHKC", "BT", "KC"].includes(props.categoryKey)
      ? "2900px"
      : ["BB"].includes(props.categoryKey)
      ? "4514px"
      : "1800px";

  return {
    div: {
      margin: "24px 0",
      overflowX: "auto",
    },
    stack: {
      position: "absolute",
      bottom: 0,
      width: "97%",
      marginTop: "8px",
      paddingBottom: "15px",
      backgroundColor: "white",
    },
    table: {
      minWidth: width,
      "& thead th": {
        textAlign: "center",
        whiteSpace: "nowrap",
      },
      "& thead .fix": {
        position: "sticky",
        // zIndex: 1,
        backgroundColor: isDark ? "#333d49" : "whitesmoke",
      },

      "& thead .nativePlace": {
        width: "280px",
      },

      "& thead .ellipsis": {
        width: "280px",
      },

      "& thead .code": {
        left: 0,
        width: "85px",
      },

      "& thead .fullName": {
        left: "85px",
        width: "130px",
      },

      "& thead .status": {
        right: "70px",
        width: "130px",
      },

      "& thead .clsAction": {
        right: 0,
        width: "70px",
      },

      "& tbody td": {
        textAlign: "center",
        whiteSpace: "nowrap",
      },

      "& tbody .fix": {
        position: "sticky",
        // zIndex: 1,
        backgroundColor: isDark ? "#989898" : "#DCDCDC",
      },

      "& tbody .code": {
        left: 0,
      },

      "& tbody .fullName": {
        left: "85px",
        width: "130px",
      },

      "& tbody .status": {
        right: "70px",
        width: "130px",
      },

      "& tbody .clsAction": {
        right: 0,
        width: "70px",
      },

      "& tbody .nativePlace": {
        whiteSpace: "nowrap",
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "280px",
        //marginRight: "-90px",
      },

      "& tbody .ellipsis": {
        whiteSpace: "nowrap",
        display: "block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: "280px",
        marginRight: "-90px",
      },

      "& tbody .red": {
        color: "red",
      },
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

    box: {
      padding: "15px 0",
    },
  };
});
