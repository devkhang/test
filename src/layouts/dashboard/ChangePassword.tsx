import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import useLocales from "src/hooks/useLocales";
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";

import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import FormDialog from "logic/components/dialogs/FormDialog";
import { Loading } from "@vna/lib/dist/components";
import { changePasswordReducer, useStyles } from "logic/changePassword";

const initialState = {
  data: {},
  errors: {},
  isShow: {
    oldPass: false,
    newPass: false,
    confirmPass: false,
  },
  loading: false,
  open: false,
};

export default function ChangePassword(props: any) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const { openKey } = props;

  const [state, dispatch] = useReducer({
    reducer: changePasswordReducer,
    name: changePasswordReducer.name,
    router: useRouter(),
    initialState,
    enqueueSnackbar,
    translate,
  });

  const { data, errors, isShow, loading, open } = state;

  useEffect(() => {
    if (openKey != 0) {
      dispatch("openDialog");
    }
  }, [openKey]);

  return (
    <FormDialog
      fullWidth
      open={open}
      title={translate("changePassword.changePassword")}
      onClose={() => dispatch("closeDialog")}
      onYes={() => dispatch("onSubmit")}
    >
      <Loading loading={loading}>
        <TextField
          className={classes.textField}
          type={isShow.oldPass ? "" : "Password"}
          label={translate("changePassword.oldPassword")}
          error={errors?.oldPass}
          helperText={!!errors.oldPass ? errors.message : ""}
          value={data?.oldPass || ""}
          onChange={(e) =>
            dispatch({
              type: "onChange",
              name: "oldPass",
              value: e.target.value,
            })
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  className={classes.iconShow}
                  onClick={() =>
                    dispatch({
                      type: "isShow",
                      name: "oldPass",
                      value: isShow.oldPass,
                    })
                  }
                >
                  {isShow.oldPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          className={classes.textField}
          type={isShow.newPass ? "" : "Password"}
          label={translate("changePassword.newPassword")}
          error={errors?.newPass}
          helperText={!!errors.newPass ? errors.message : ""}
          value={data?.newPass || ""}
          onChange={(e) =>
            dispatch({
              type: "onChange",
              name: "newPass",
              value: e.target.value,
            })
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  className={classes.iconShow}
                  onClick={() =>
                    dispatch({
                      type: "isShow",
                      name: "newPass",
                      value: isShow.newPass,
                    })
                  }
                >
                  {isShow.newPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          className={classes.textField}
          type={isShow.confirmPass ? "" : "Password"}
          label={translate("changePassword.confirmPassword")}
          error={errors?.confirmPass}
          helperText={!!errors.confirmPass ? errors.message : ""}
          value={data?.confirmPass || ""}
          onChange={(e) =>
            dispatch({
              type: "onChange",
              name: "confirmPass",
              value: e.target.value,
            })
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  className={classes.iconShow}
                  onClick={() =>
                    dispatch({
                      type: "isShow",
                      name: "confirmPass",
                      value: isShow.confirmPass,
                    })
                  }
                >
                  {isShow.confirmPass ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Loading>
    </FormDialog>
  );
}
