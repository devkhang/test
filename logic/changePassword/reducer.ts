import Users from "api/Users";
import Auth from "api/Auth";
import _ from "lodash";

const validateData = (oldPass, newPass, confirmPass, translate) => {
  const errors: any = {};
  const emp = !!oldPass && !!newPass && !!confirmPass;
  if (!emp) {
    const errors: any = {
      oldPass: !oldPass,
      newPass: !newPass,
      confirmPass: !confirmPass,
    };
    return {
      message: translate("changePassword.errorIsEmpty"),
      isValid: false,
      errors,
    };
  } else if (oldPass === newPass) {
    const errors: any = {
      newPass: oldPass === newPass,
    };
    return {
      message: translate("changePassword.errorNewPassMess"),
      isValid: false,
      errors,
    };
  } else if (newPass !== confirmPass) {
    const errors: any = {
      confirmPass: newPass !== confirmPass,
    };
    return {
      message: translate("changePassword.errorConfirmPassMess"),
      isValid: false,
      errors,
    };
  } else return { isValid: true, errors, message: "" };
};

export const changePasswordReducer = ({
  state,
  action,
  router,
  dispatch,
  enqueueSnackbar,
  translate,
}: any) => {
  const cases: any = {
    onChange: () => {
      const { name, value } = action;
      const { data } = state;
      data[name] = value;
      return data;
    },

    onSubmit: async () => {
      const { data } = state;
      const validate = validateData(
        data?.oldPass,
        data?.newPass,
        data?.confirmPass,
        translate
      );
      if (validate.isValid) {
        dispatch("onLoading");
        const { success } = await Users.changePassword(
          data.oldPass,
          data.newPass
        );
        if (!success) {
          enqueueSnackbar(translate("changePassword.error"), {
            variant: "error",
          });
        } else {
          enqueueSnackbar(translate("changePassword.success"), {
            variant: "success",
          });
          Auth.logOut(router);
          return { open: false, loading: false, data: {} };
        }
      } else {
        enqueueSnackbar(translate("changePassword.errorIsValidMess"), {
          variant: "error",
        });
        return { errors: { ...validate.errors, message: validate.message } };
      }
      return { loading: false };
    },

    isShow: () => {
      const { name, value } = action;
      const { isShow } = state;
      isShow[name] = !value;
      return isShow;
    },

    onLoading: () => ({ loading: true }),
    openDialog: () => ({ open: true }),
    closeDialog: () => ({ open: false, loading: false, data: {}, errors: {} }),
  };
  return cases[action.type] && cases[action.type]();
};
