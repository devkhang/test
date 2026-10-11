import React, { forwardRef } from "react";
import { makeStyles } from "@material-ui/styles";

import {
  Button,
  Dialog,
  Slide,
  DialogTitle,
  DialogContent,
  DialogActions,
  Theme,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
import { TransitionProps } from "@material-ui/core/transitions";

const useStyles = makeStyles((theme: Theme) => {
  const isDark = theme.palette.mode === "dark";
  return {
    title: {
      textAlign: "center",
      color: "white",
      padding: "16px",
      backgroundColor: theme.palette.primary.main,
    },
    action: {
      backgroundColor: isDark ? "#212B36" : "white",
      zIndex: 10,
    },
    btnContainer: {
      alignItems: "center",
      display: "flex",
    },
    button: {
      marginLeft: "16px",
    },
    grayTxt: {
      fontSize: "0.875rem",
      color: "gray",
    },
  };
});

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children?: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

const FormDialog = (props: any) => {
  const {
    open,
    title,
    children,
    noAction,
    action,
    cancel,
    yes,
    onYes,
    onClose,
    maxWidth,
    exports,
    continues,
    onContinue,
    onCheck,
    checked,
    ...other
  } = props;
  const { translate } = useLocales();
  const classes = useStyles();

  return (
    <Dialog
      TransitionComponent={Transition}
      keepMounted
      maxWidth={maxWidth || "sm"}
      fullWidth
      onClose={onClose}
      open={open}
      {...other}
    >
      {title && (
        <DialogTitle className={classes.title}>{translate(title)}</DialogTitle>
      )}
      <DialogContent dividers>{children}</DialogContent>
      {!noAction && (
        <DialogActions className={classes.action}>
          {action || (
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid item>
                {onCheck && (
                  <>
                    <FormControlLabel
                      label={translate("paymentList.complete")}
                      control={
                        <Checkbox checked={checked} onChange={onCheck} />
                      }
                    />
                    <Typography className={classes.grayTxt}>
                      {translate("paymentList.note")}
                    </Typography>
                  </>
                )}
              </Grid>

              <Grid item className={classes.btnContainer}>
                <Button key="0" onClick={onClose}>
                  {cancel || translate("common.cancel")}
                </Button>
                {onYes && (
                  <Button
                    key="1"
                    onClick={onYes}
                    autoFocus
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    {yes || translate("common.btnSave")}
                  </Button>
                )}
                {continues && (
                  <Button
                    key="3"
                    onClick={onContinue}
                    autoFocus
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    {continues || translate("common.continue")}
                  </Button>
                )}
              </Grid>
            </Grid>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default FormDialog;
