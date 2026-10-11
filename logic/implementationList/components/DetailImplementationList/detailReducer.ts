import _ from "lodash";
import List from "api/List";
import Province from "api/Province";
import { Status, Type } from "logic/monthlyPayment/components/utils";

const infoValidate = (data) => {
  const error = !!data.code && !!data.ward;
  const err: any = {
    code: !data.code,
    ward: !data.ward,
  };
  return { error, err };
};

const detailReducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
  steps,
}: any) => {
  const { row, province, form, yearId, existCode, doet } = props.params;
  const filter = {
    form: { value: [form], operation: "in" },
    yearId: { value: [yearId], operation: "in" },
    provinceId: { value: [province.key], operation: "in" },
    districtId: { value: [doet.district.key], operation: "in" },
  };
  const cases: any = {
    initial: async () => {
      const newState = {
        checked: false,
        codes: [],
        activeStep: 0,
        completed: {
          0: false,
          1: false,
        },
      };
      const res: any = {};
      res.info = row;
      res.listId = row?.id;
      res.info = { ...row, district: doet?.district };

      if (res.listId) {
        res.codes = [row.code];
        res.completed = {
          0: true,
          1: true,
        };
      }
      if (!_.isEmpty(res.info?.district)) {
        const id = res.info?.district?.key;
        const dataWard = await Province.getWard(id);
        res.wards = [{ key: "0", value: "Tất cả" }, ...(dataWard?.data || [])];
      }
      return { ...newState, ...res, loading: false, open: true };
    },

    handleStep: () => {
      const { idx } = action;
      dispatch("handleComplete");
      return { activeStep: idx };
    },

    handleComplete: () => {
      const { completed, activeStep } = state;
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      return { completed: { ...completed, ...newCompleted } };
    },

    continue: async () => {
      const { info } = state;
      const { activeStep } = state;
      const newActive = activeStep === steps.length - 1 ? -1 : activeStep + 1;

      dispatch("handleComplete");
      if (newActive === 1) {
        const valid = infoValidate(info);
        if (!!valid.error) {
          !!row.id ? dispatch("editExecuteList") : dispatch("saveExecuteList");
        } else {
          enqueueSnackbar(translate("recordsManagement.notEnough"), {
            variant: "error",
          });
          return { activeStep, openConfirm: false, err: { ...valid.err } };
        }
      }
      if (newActive === -1) {
        dispatch("updateProfiles");
      }
      return newActive === -1
        ? { open: false, openConfirm: false }
        : { activeStep: newActive };
    },

    deliverItem: () => ({ checked: action.checked }),

    selectWard: async () => {
      const { item } = action;
      const { info, codes } = state;
      const res: any = {};
      info.ward = item;

      const wardFilter =
        info.ward?.key === "0"
          ? {}
          : { wardId: { value: [info.ward.key], operation: "in" } };

      const dataList = await List.get({
        where: {
          ...filter,
          ...wardFilter,
        },
      });
      const items = _.get(dataList, "data.items") || [];
      const isExistCode = items.filter((i) => !existCode.includes(i.code));
      res.codes = [...codes, ...isExistCode.map((i) => i.code)];

      return { ...res, info };
    },

    updateProfiles: async () => {
      const { listId, checked } = state;
      const dataRows =
        _.get(globalThis, "reducers.detailInfoReducer.rows") || [];
      const profile = dataRows.filter((row) => !row.isFather);

      const point = !!checked ? Status.Complete : 1;
      const { success } = await List.put(listId, { profile, point });
      if (success) {
        enqueueSnackbar(translate("common.updateMes"), {
          variant: "success",
        });
      } else
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      return { open: false, openConfirm: false };
    },

    onCheck: () => {
      const { checked } = state;
      return { checked: !checked };
    },

    saveExecuteList: async () => {
      const { info, listId } = state;
      dispatch("onLoading");
      const { success } = await List.put(listId, {
        receiveDate: info.receiveDate,
        type: Type.Excute,
        executeNote: info.executeNote,
      });
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        enqueueSnackbar(translate("common.addMes"), {
          variant: "success",
        });
      }
      return { loading: false, openConfirm: false };
    },

    editExecuteList: async () => {
      const { info, listId } = state;
      dispatch("onLoading");
      const { success } = await List.put(listId, { ...info });
      if (success) {
        enqueueSnackbar(translate("common.updateMes"), {
          variant: "success",
        });
      } else
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      return { loading: false, openConfirm: false };
    },

    changeInfo: async () => {
      const { name, value } = action;
      const { info } = state;
      info[name] = value;
      const res: any = {};
      if (name === "code") {
        const wardFilter =
          info.ward?.key === "0"
            ? {}
            : { wardId: { value: [info.ward.key], operation: "in" } };

        const where = {
          ...filter,
          ...wardFilter,
          code: { value: [info.code], operation: "in" },
        };
        const dataList = await List.get({ where });
        const items = _.get(dataList, "data.items") || [];
        res.unit = _.get(items, "[0].unit");
        res.listId = _.get(items, "[0].id");
      }
      return { ...res, info };
    },

    openConfirm: () => ({ openConfirm: true }),
    closeConfirm: () => ({ openConfirm: false }),
    onLoading: () => ({ loading: true }),
    showModal: () => ({ open: true }),
    closeModal: () => ({ open: false, openConfirm: false }),
  };
  return cases[action.type] && cases[action.type]();
};
export default detailReducer;
