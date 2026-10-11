import { Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export const styles = makeStyles((theme: Theme) => {
  return {
    headActions: {
      display: "flex",
      justifyContent: "space-between"
    },
    btnWrapper: {
      display: "flex",
      "&:button": {
        marginRight: "15px"
      }
    },
    btn: {
      width: '135px',
      margin: '16px',
    },
    btnAdd: {
      backgroundColor: theme.palette.primary.main,
      color: "white"
    },
    printBtn: {
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main
    },
    yearSelect: {
      width: "170px",
      margin: "8px 0"
    }
  };
});
