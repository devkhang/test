import _ from "lodash";
import { uuidv4 } from "../utils";
import Year from "api/Year";
import Profile from "api/Profile";
import Upload from "api/Upload";
import List from "api/List";

export default function preferentialReducer({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any) {
  const { profile } = props;

  const cases: any = {
    initial: async () => {
      const { data, success } = await Year.get({
        where: { status: true },
        order: { year: "DESC" },
      });
      const dataApi = await Profile.get({ where: { id: profile } });
      const res: any = {};
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.years = data.items;
        res.year = res.years[0];
        res.prefers = _.get(dataApi, "data.items[0].prefers") || [];
        res.other = _.get(dataApi, "data.items[0].other") || {};
        res.files = _.get(dataApi, "data.items[0].attachment") || [];
      }

      return { ...res, loading: false };
    },

    onChange: () => {
      const { name, e } = action;
      const { other }: any = state;
      other[name] = e?.target?.value;

      if (
        [
          "decidedDate",
          "decidedDateOnce",
          "startDate",
          "dateInsurance",
        ].includes(name)
      ) {
        other[name] = e;
      }
      return { other };
    },

    handleDropFile: async () => {
      const { data } = action;
      const { files } = state;
      const res: any = {};

      const uploadApi = await Upload.uploadFile(data);

      if (uploadApi.success) {
        enqueueSnackbar(translate("common.loadSuccess"), {
          variant: "success",
        });
        const newData = {
          ...data[0],
          name: data[0].name || "",
          size: data[0]?.size,
          id: uuidv4(),
          url: _.get(uploadApi, "data.public_url"),
        };
        res.files = [...files, newData];
      }

      return res;
    },

    onDownFile: () => {
      const { data } = action;
      window.open(`${data.url}`, "_self");
    },

    onRemove: () => {
      const { files } = state;
      const { index } = action;
      files.splice(index, 1);
      return { files };
    },

    onSelectYear: () => {
      const { e } = action;
      const value = e.target.value;
      return { year: value, other: {}, prefers: [] };
    },

    deliverItem: () => {
      const { data } = action;
      return { prefers: data };
    },

    openDialog: async () => {
      const { openKey } = state;
      const { name } = action;

      const { data, success } = await List.checkExistUser(profile);
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
        return;
      }
      const alreadyOnList = !_.isEmpty(data);
      const keys =
        name === "prefers"
          ? { open: openKey.open + 1 }
          : { openEdu: openKey.openEdu + 1 };
      return {
        openKey: { ...openKey, ...keys },
        alreadyOnList,
      };
    },
  };
  return cases[action.type] && cases[action.type]();
}
