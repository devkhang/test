import _ from "lodash";
import Record from "api/Record";
import Profile from "api/Profile";
import { uuidv4 } from "../utils";

const validateRevolution = (data, categoryKey) => {
  const err: any = {
    startDateR: !data.startDate,
    endDateR: !data.endDate,
    organR: !data.organ,
    rank: !data.rank,
    area: !data.area,
  };
  const isValid =
    categoryKey === "BT"
      ? !!data.startDate &&
        !!data.endDate &&
        !!data.organ &&
        !!data.rank &&
        !!data.area
      : !!data.startDate && !!data.endDate && !!data.organ && !!data.area;
  return { isValid, err };
};

const validateJailed = (data) => {
  const err: any = {
    startDateJ: !data.startDate,
    endDateJ: !data.endDate,
    organJ: !data.organ,
    prison: !data.prison,
  };
  const isValid =
    !!data.startDate && !!data.endDate && !!data.organ && !!data.prison;
  return { isValid, err };
};

export const recordsInfoReducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any): any => {
  const { profile, categoryKey } = props;
  const cases: any = {
    initial: async () => {
      const relation = ["info"];
      const res: any = {};
      const newState = {
        data: {
          code: `${categoryKey}-`,
          inprogressRevolution: [],
          inprogressJailed: [],
        },
        rowsCM: [],
        rows: [],
        err: {},
      };

      if (!!profile) {
        dispatch("onLoading");
        const profileApi = await Profile.get({
          where: { id: profile },
          relation: JSON.stringify(relation),
        });
        if (!profileApi.success) {
          enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
        } else {
          res.data = _.get(profileApi, "data.items[0].info[0]", {
            inprogressRevolution: [],
            inprogressJailed: [],
          });
          res.oldRowsCM = res.data?.inprogressRevolution || [];
          res.rowsCM = _.cloneDeep(res.oldRowsCM);

          res.oldRows = res.data?.inprogressJailed || [];
          res.rows = _.cloneDeep(res.oldRows);
        }
      }
      return { ...newState, ...res, loading: false };
    },

    checkCode: async () => {
      const { value } = action;
      const { data } = state;
      const { isExisted } = await Record.checkCode({ code: value });
      if (isExisted) {
        return { data: { ...data, isErrorCode: true } };
      }
      return { data: { ...data, isErrorCode: false } };
    },

    changeRecords: () => {
      const { name, value } = action;
      const { data } = state;
      if (name === "code") {
        dispatch({ type: "checkCode", value });
        data[name] = value;
      }
      if (name === "startRevolution") {
        data.inprogressRevolution.startDate = value;
      }
      if (name === "endRevolution") {
        data.inprogressRevolution.endDate = value;
      }
      if (name === "inprogressRevolution") {
        data.inprogressRevolution = value;
      }
      if (name === "inprogressJailed") {
        data.inprogressJailed = value;
      } else data[name] = value;
      return { data };
    },

    addNew: async () => {
      let { rowsCM, rows } = state;
      const { setItem } = action.data;
      const res: any = {};

      if (setItem === "inprogressRevolution") {
        res.rowsCM = [...rowsCM, { isEdit: true }];
      }
      if (setItem === "inprogressJailed") {
        res.rows = [...rows, { isEdit: true }];
      }
      return { ...res, loading: false };
    },

    editRevolution: () => {
      const { rowsCM, oldRowsCM } = state;
      const { rowIdx } = action.data;
      if (!rowsCM[rowIdx].id && !!rowsCM[rowIdx].isEdit) {
        rowsCM.splice(rowIdx, 1);
      } else {
        rowsCM[rowIdx].isEdit = !rowsCM[rowIdx].isEdit;
        if (!rowsCM[rowIdx].isEdit && !!rowsCM[rowIdx].id) {
          rowsCM[rowIdx] = _.cloneDeep(
            oldRowsCM.find((item: any) => rowsCM[rowIdx].id === item.id)
          );
        }
      }
      return { rowsCM };
    },

    changeRevolution: () => {
      const {
        data: { name, rowIdx, item },
        ele,
      } = action;
      const { rowsCM } = state;
      if (name === "startDate" || name === "endDate") {
        if (!!ele && ele.toDateString() !== "Invalid Date") {
          rowsCM[rowIdx][name] = ele;
        }
      } else {
        const value = ele?.target?.value;
        item[name] = value;
        rowsCM[rowIdx] = item;
      }
      return { rowsCM };
    },

    changeJailed: () => {
      const {
        data: { name, rowIdx, item },
        ele,
      } = action;
      const { rows } = state;

      if (name === "startDate" || name === "endDate") {
        if (!!ele && ele.toDateString() !== "Invalid Date") {
          rows[rowIdx][name] = ele;
        }
      } else {
        const value = ele?.target?.value;
        item[name] = value;
        rows[rowIdx] = item;
      }
      return { rows };
    },

    saveRevolution: async () => {
      const { rowsCM, data, err } = state;
      const { rowIdx } = action.data;
      const res: any = {};
      const validate = validateRevolution(rowsCM[rowIdx], categoryKey);
      if (validate.isValid) {
        rowsCM[rowIdx] = { ...rowsCM[rowIdx], isEdit: false, id: uuidv4() };
        res.oldRowsCM = _.cloneDeep(rowsCM);
        data.inprogressRevolution = rowsCM;
      } else {
        enqueueSnackbar(translate("recordsManagement.notEnoughInput"), {
          variant: "error",
        });
        return { rowsCM, err: { ...err, ...validate.err } };
      }
      return { ...res, rowsCM, loading: false };
    },

    saveJailed: async () => {
      const { rows, data, err } = state;
      const { rowIdx } = action.data;
      const res: any = {};
      const validate = validateJailed(rows[rowIdx]);
      if (validate.isValid) {
        rows[rowIdx] = { ...rows[rowIdx], isEdit: false, id: uuidv4() };
        res.oldRows = _.cloneDeep(rows);
        data.inprogressJailed = rows;
      } else {
        enqueueSnackbar(translate("recordsManagement.notEnoughInput"), {
          variant: "error",
        });
        return { rows, err: { ...err, ...validate.err } };
      }
      return { ...res, rows, loading: false };
    },

    editJailed: () => {
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

    delete: async () => {
      const { rowsCM, rows } = state;
      const { setItem, item } = action.data;
      const r: any = {};
      if (setItem === "inprogressRevolution") {
        r.rowsCM = rowsCM.filter((v: any) => v.id !== item.id);
      }
      if (setItem === "inprogressJailed") {
        r.rows = rows.filter((v: any) => v.id !== item.id);
      }
      return { ...r };
    },

    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
};
