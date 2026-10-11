import _ from "lodash";
import Profile from "api/Profile";
import Province from "api/Province";

export const addressInfoReducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any): any => {
  const { profile, doet } = props;

  const cases: any = {
    initial: async () => {
      const relation = ["infoAddress"];
      const res: any = {};
      dispatch("onLoading");

      if (profile) {
        const { data, success } = await Profile.get({
          where: { id: profile },
          relation: JSON.stringify(relation),
        });

        if (!success)
          enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
        else {
          res.data = _.get(data, "items[0].infoAddress[0]", {});
        }
      }

      if (_.isEmpty(res.data.district)) {
        res.data.province = doet?.province || {};
        res.data.district = doet?.district || {};
      }

      const [dataDistrict, dataWard] = await Promise.all([
        Province.getDistrict(doet?.province.key || null),
        Province.getWard(doet?.district?.key || null),
      ]);

      res.districts = dataDistrict.data || [];
      res.wards = dataWard.data || [];

      return { ...res, loading: false };
    },

    changeAddress: () => {
      const { name, value } = action;
      const { data } = state;
      data[name] = value;
      return { data };
    },

    onSelect: async () => {
      const { name, item } = action;
      const { data, wards } = state;
      const res: any = {};

      data[name] = item;
      if (name === "district") {
        const id = item?.key || "";
        const { data: dataApi } = await Province.getWard(id);
        res.wards = dataApi || [];
        data.ward = null;
      }
      return { ...res, data };
    },

    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
};
