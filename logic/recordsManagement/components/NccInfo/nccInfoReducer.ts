import _ from "lodash";
import { uuidv4 } from "../utils";
import Profile from "api/Profile";
import Province from "api/Province";
import Ethnic from "api/Ethnic";
import Upload from "api/Upload";

export const nccInfoReducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any): any => {
  const { profile } = props;
  const cases: any = {
    initial: async () => {
      const relation = ["infoNcc"];
      const res: any = {};
      res.data = { disabilitiesChildren: [], htc: {} };
      res.rows = [];
      if (!!profile) {
        dispatch("onLoading");

        const [nccInfoApi, resEthnic] = await Promise.all([
          Profile.get({
            where: { id: profile },
            relation: JSON.stringify(relation),
          }),
          Ethnic.get({}),
        ]);

        if (!nccInfoApi.success) {
          enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
        } else {
          res.ethnic = _.get(resEthnic, "data.items") || [];
          res.data = _.get(nccInfoApi, "data.items[0].infoNcc[0]", {
            disabilitiesChildren: [],
            htc: {},
          });
          res.oldRows = res.data?.disabilitiesChildren || [];
          res.rows = _.cloneDeep(res.oldRows);
          res.moves = _.get(nccInfoApi, "data.items[0].move") || [];
          const items: any = res.moves.filter((i) => !_.isEmpty(i)) || [];

          res.type = items[0]?.type === 0 ? 0 : items[0]?.type || -1;
          res.move = res.moves.find((i) => i.type === res.type) || {};
        }
      }
      return { ...res, loading: false };
    },

    changeNccInfo: () => {
      const { name, value } = action;
      const { data } = state;
      if (name === "disabilitiesChildren") {
        data.disabilitiesChildren = value;
      }
      if (["decided", "decidedDate", "organ", "subsidy"].includes(name)) {
        if(!data.htc){
          const dataHtc = data.htc= {}
          return dataHtc[name] = value
        }
        else  data.htc[name] = value;
      } else {
        data[name] = value;
      }
      return { data };
    },

    changeSelect: () => {
      const { name, item } = action;
      const { data } = state;
      data[name] = item;
      return { data };
    },

    addNew: async () => {
      let { rows } = state;
      return { rows: [{ isEdit: true }, ...rows], loading: false };
    },

    setEdit: () => {
      const { rows, oldRows } = state;
      const { rowIdx } = action.data;

      if (!rows[rowIdx].id && !!rows[rowIdx].isEdit) {
        rows.splice(rowIdx, 1);
      } else {
        rows[rowIdx].isEdit = !rows[rowIdx].isEdit;
        if (!rows[rowIdx].isEdit && !!rows[rowIdx].id) {
          rows[rowIdx] = _.cloneDeep(
            oldRows.find((item: any) => rows[rowIdx].id === item.id)
          );
        }
      }
      return { rows };
    },

    onChange: () => {
      const {
        data: { name, rowIdx, item },
        ele,
      } = action;
      const { rows } = state;
      const value = ele?.target?.value;
      item[name] = value;
      rows[rowIdx] = item;

      return { rows };
    },

    save: async () => {
      const { rows, data } = state;
      const { rowIdx } = action.data;
      const res: any = {};
      if (
        !!rows[rowIdx].fullName &&
        !!rows[rowIdx].dateOfBirth &&
        !!rows[rowIdx].disability
      ) {
        rows[rowIdx] = { ...rows[rowIdx], isEdit: false, id: uuidv4() };
        res.oldRows = _.cloneDeep(rows);
        data.disabilitiesChildren = rows;
      } else {
        enqueueSnackbar(translate("recordsManagement.notEnoughInput"), {
          variant: "error",
        });
        return { rows };
      }
      return { ...res, rows, loading: false };
    },

    delete: async () => {
      const { rows } = state;
      const { item } = action.data;
      return {
        rows: rows.filter((v: any) => v.id !== item.id),
        loading: false,
      };
    },

    NCCmove: () => {
      const { moves } = state;
      const { name, e } = action;

      const res: any = {};
      res.move = moves.find((i) => i.type === name) || { type: name };
      res.type = name;
      if (!e.target.checked) {
        res.type = null;
      }

      return { ...res };
    },

    onChangNCCmove: () => {
      const { name, e } = action;
      const { move } = state;
      move[name] = e?.target?.value;

      if (name === "date") {
        move[name] = e;
      }

      return { move };
    },

    selectAuto: async () => {
      const { name, item } = action;
      const { move } = state;
      const res: any = {};

      if (name === "province") {
        const dataApi = await Province.getDistrict(item?.key);
        move.province = item;
        res.districts = _.get(dataApi, "data") || [];
        move.district = {};
        res.wards = [];
        move.ward = {};
      }
      if (name === "district") {
        const dataApi = await Province.getWard(item?.key);
        move.district = item;
        res.wards = _.get(dataApi, "data") || [];
        move.ward = {};
      }
      if (name === "ward") {
        move.ward = item;
      }

      return { ...res, move };
    },

    handleDropFile: async () => {
      const { data } = action;
      const { move } = state;

      if (data[0]?.size > 8 * 1024 * 1024) {
        enqueueSnackbar(translate("recordsManagement.sizeErr"), {
          variant: "error",
        });
        return;
      } else {
        const uploadApi = await Upload.uploadFile(data);
        if (!uploadApi.success) {
          enqueueSnackbar(translate("recordsManagement.errorMessage"), {
            variant: "error",
          });
          return;
        } else {
          enqueueSnackbar(translate("common.loadSuccess"), {
            variant: "success",
          });
          const newData = {
            ...data[0],
            name: uploadApi.data.public_id || "",
            size: data[0]?.size,
            id: uuidv4(),
            url: uploadApi.data.public_url,
          };
          move.file = [...(move?.file || []), newData];
        }
      }
      return { move };
    },

    removeItem: () => {
      const { nameFile, file } = action;
      const { move } = state;
      const filteredItems = (move[nameFile] || []).filter(
        (i: any) => i !== file
      );
      move.file = filteredItems;
      return { move };
    },

    removeAll: () => {
      const { move } = state;
      move.file = [];
      return { move };
    },

    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
};
