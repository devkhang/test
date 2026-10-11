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
} from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
import { TransitionProps } from "@material-ui/core/transitions";

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    textAlign: "center",
    color: "white",
    padding: "16px",
    backgroundColor: theme.palette.primary.main,
  },
}));

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children?: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

const Confirm = (props: any) => {
  const {
    open,
    title,
    cancel,
    yes,
    children,
    onClose,
    onYes,
    maxWidth,
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
      <DialogTitle className={classes.title}>
        {translate("common.warning")}
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      <DialogActions>
        <Button key="0" onClick={onClose}>
          {cancel || translate("common.cancel")}
        </Button>
        <Button
          key="1"
          onClick={onYes}
          autoFocus
          variant="contained"
          color="primary"
        >
          {yes || translate("common.btnY")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirm;
