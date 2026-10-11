import _ from "lodash";
import { set, get } from "src/hooks/useLocalStorage";
import Auth from "api/Auth";
import View from "api/View";
import Doet from "api/Doet";
import { errMess } from "./constants";

const setMenu = (items: any, roleUser: string) => {
  return items.reduce((array, i) => {
    const isMenu = (i.activities || []).find((a: any) => a.role === roleUser);
    if (!!isMenu) {
      array = [...array, i];
    }
    return array;
  }, []);
};

const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

interface IReducer {
  state: {
    userName: string;
    password: string;
    email: string;
    isShow: boolean;
    isMemory: boolean;
    forgotPass: boolean;
  };
  action: any;
  dispatch: any;
  enqueueSnackbar: any;
  translate: any;
  router: any;
}

export const loginReducer = ({
  state,
  action,
  router,
  dispatch,
  enqueueSnackbar,
  translate,
}: IReducer): any => {
  const cases: any = {
    initial: async () => {
      const account = get("account");

      if (account) {
        return {
          userName: account.userName,
          password: account.password,
          isMemory: true,
        };
      }

      return { forgotPass: false };
    },

    onChange: () => {
      const { name, value } = action;

      if (name === "checkbox") {
        value === false && localStorage.removeItem("account");

        return { isMemory: value };
      }

      return { [name]: value };
    },

    onSubmit: async () => {
      const { userName, password, isMemory } = state;
      const { keypress, typeClick } = action;
      if (keypress === "Enter" || typeClick === "click") {
        const { errors, data, status } = await Auth.login(userName, password);
        if (errors) {
          enqueueSnackbar(translate(errMess[status]), {
            variant: "error",
          });
        } else if (data) {
          if (isMemory) {
            set("account", { userName, password });
          }
          const user = get("user");

          const [viewApi, doetApi] = await Promise.all([
            View.getItems(data?.token || "", {
              order: { order: "ASC" },
            }),
            Doet.getItems(data?.token || "", {
              where: { id: user?.doet },
            }),
          ]);

          if (!!viewApi?.data?.success) {
            const items = _.get(viewApi, "data.data.items") || [];
            const roleUser = _.get(get("user"), "role.role");
            const menus = setMenu(items, roleUser);

            set("views", menus);
          }
          if (!!doetApi?.data?.success) {
            const item = _.get(doetApi, "data.data.items[0]") || {};
            const setHeader = {
              name: item?.name2 || "",
              province: item?.province2 || "",
              logo: item?.logo || "",
            };

            set("infoDomain", item);
            set("setHeader", setHeader);
          }
          router.push("/dashboard");
        } else {
          router.push("/500");
        }
      }
      return {};
    },

    sendRequire: async () => {
      const { email } = state;
      if (email.match(mailformat)) {
        const { success } = await Auth.forgotPassword({ email });
        success
          ? enqueueSnackbar(translate("login.sendSuccess"), {
              variant: "success",
            })
          : enqueueSnackbar(translate("login.resetPassErr"), {
              variant: "error",
            });
      } else
        enqueueSnackbar(translate("login.emailValid"), {
          variant: "error",
        });
    },

    showPassword: () => {
      return { isShow: !state.isShow };
    },

    forgotPassword: () => ({ email: "", forgotPass: !state.forgotPass }),
  };

  return cases[action.type]();
};
