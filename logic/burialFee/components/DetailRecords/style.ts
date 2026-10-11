import { TextField, Theme } from "@material-ui/core";
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/styles";

export const DisabledTextField = styled(TextField)(({ theme }) => ({}));

export const styles = makeStyles((theme: Theme) => {
  return {
    disabled: {
      backgroundColor: theme.palette.grey["200"],
      cursor: "not-allowed",
    },
    btn: {
      backgroundColor: theme.palette.primary.main,
      color: "white",
      marginTop: "5px",
      float: "left",
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
  };
});
