import Province from "api/Province";
import Media from "api/Media";
import Setting from "api/Setting";
import _ from "lodash";
import Doet from "api/Doet";
import { get, set } from "src/hooks/useLocalStorage";

export default function settingReducer({
  state,
  action,
  dispatch,
  enqueueSnackbar,
  translate,
}: any) {
  const id = get("user")?.doet;
  const cases: any = {
    initial: async () => {
      const { data } = state;
      dispatch("onLoading");
      const [dataProvince, dataDoet] = await Promise.all([
        Province.get(),
        Doet.get({ where: { id } }),
      ]);

      const provinces = dataProvince.data || [];
      data.name = _.get(dataDoet, "data.items[0].name2") || "";
      data.province = _.get(dataDoet, "data.items[0].province2") || "";
      data.logo = _.get(dataDoet, "data.items[0].logo") || "";
      return { provinces, data, loading: false };
    },
    onChange: () => {
      const { name, value } = action;
      const { data } = state;
      data[name] = value;
      return data;
    },
    uploadImg: async () => {
      const { e, name } = action;
      const { data } = state;
      const file = e;
      let formData = new FormData();
      for (const key of Object.keys(file)) {
        formData.append("file", file[key]);
      }
      const dataApi = await Media.post(formData);
      if (dataApi.data) {
        data[name] = _.get(dataApi, "data.public_url") || "";
        enqueueSnackbar(translate("userManager.messAddAvatar"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }
      return data;
    },
    save: async () => {
      const { data } = state;
      dispatch("onLoading");
      const { success } = await Setting.post({ ...data });
      if (success) {
        enqueueSnackbar(translate("common.loadSuccess"), {
          variant: "success",
        });
        const proVal = data.province?.value;
        let header;
        if (!_.isEmpty(proVal)) {
          header = {
            ...data,
            province: {
              ...data.province,
              value:
                proVal.slice(0, 2) === "Th"
                  ? proVal.slice(10)
                  : proVal.slice(5),
            },
          };
        } else header = { ...data };

        set("setHeader", header);
        window.location.reload();
      } else
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      return { loading: false };
    },
    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
}
