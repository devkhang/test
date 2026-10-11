import _ from "lodash";
import { set } from "src/hooks/useLocalStorage";
import Province from "api/Province";
import User from "api/User";
import Role from "api/Role";
import Media from "api/Media";

export const profileUserReducer = ({
  state,
  action,
  dispatch,
  enqueueSnackbar,
  translate,
  props,
}): any => {
  const { id } = props;
  const cases: any = {
    initial: async () => {
      const { provinces } = state;
      const res: any = {};

      const [rsUsers, resRoles] = await Promise.all([
        User.getProfile(id),
        Role.get({}),
      ]);
      res.data = rsUsers.data;
      res.roles = _.get(resRoles, "data.items") || [];
      if (_.isEmpty(provinces)) {
        const dataProvince = await Province.get({});
        res.provinces = dataProvince.data || [];
      }
      if (!_.isEmpty(res.data?.province)) {
        const id = res.data.province?.key || "";
        const dataDistrict = await Province.getDistrict(id);
        res.districts = dataDistrict.data || [];
      }
      if (!_.isEmpty(res.data?.district)) {
        const id = res.data.district?.key || "";
        const dataWard = await Province.getWard(id);
        res.wards = dataWard.data || [];
      }
      return { ...res };
    },

    uploadAvatar: async () => {
      const { file } = action;
      const { data } = state;
      let formData = new FormData();
      for (const key of Object.keys(file)) {
        formData.append("file", file[key]);
      }
      const dataApi = await Media.post(formData);
      if (dataApi.data) {
        data.avatar = _.get(dataApi, "data.public_url") || "";
        enqueueSnackbar(translate("userManager.messAddAvatar"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }
      return { data, loadingAvatar: false };
    },

    onChange: () => {
      const { name, value } = action;
      const { data } = state;
      data[name] = value;
      return { data };
    },

    selectAuto: async () => {
      const { name, item } = action;
      const { data } = state;
      data[name] = item;
      const res: any = {};

      if (name === "province") {
        const id = item?.key || "";
        const { data: dataApi } = await Province.getDistrict(id);
        res.districts = dataApi || [];
        res.wards = [];
        data.district = null;
        data.ward = null;
        data.quarter = null;
      }

      if (name === "district") {
        const id = item?.key || "";
        const { data: dataApi } = await Province.getWard(id);
        res.wards = dataApi || [];
        data.ward = null;
        data.quarter = null;
      }
      return { ...res, data };
    },

    update: async () => {
      const { data } = state;
      const dataApi = await User.update(id, { ...data });

      const res: any = {};
      if (dataApi.success) {
        set("avatar", data.avatar);
        enqueueSnackbar(translate("common.updateMes"), {
          variant: "success",
        });
        window.location.reload();
        res.open = false;
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }
      return { ...res };
    },

    openDialog: () => ({ open: true }),
    closeDialog: () => ({ open: false }),
  };
  return cases[action.type] && cases[action.type]();
};
