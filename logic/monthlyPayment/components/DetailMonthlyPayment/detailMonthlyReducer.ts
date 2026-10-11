import _ from "lodash";
import List from "api/List";
import Province from "api/Province";
import { Type, getMonth } from "../utils";
import { get } from "src/hooks/useLocalStorage";
import { unaccent } from "logic/recordsManagement/util";

const infoDomain = get("infoDomain") || {};
const moetId = !infoDomain.parentId ? infoDomain.id : infoDomain.parentId;

const detailMonthlyReducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
  steps,
}: any) => {
  const { row, province, form, year, existCode, doet } = props.params;
  const yearId = year.id;

  const cases: any = {
    initial: async () => {
      const newState = {
        activeStep: 0,
        completed: {
          0: false,
          1: false,
        },
      };
      const res: any = {};
      res.info = row;
      res.listId = row.id;
      res.period = getMonth(year.year).filter((i) => !existCode.includes(i));
      res.info = { ...row, district: doet?.district };
      if (res.listId) {
        res.period = [row.code];
        res.completed = {
          0: true,
          1: true,
        };
      }
      dispatch("onLoading");
      if (!_.isEmpty(res.info?.district)) {
        const id = res.info?.district?.key;
        const dataWard = await Province.getWard(id);
        res.wards = [
          { key: "0", value: "Tất cả" },
          ...(dataWard?.data || []).sort((a, b) => {
            if (
              +unaccent(a?.value || "").replace(/phuong /g, "") >
              +unaccent(b?.value || "").replace(/phuong /g, "")
            )
              return 1;
            return -1;
          }),
        ];
      }
      return { ...newState, ...res, loading: false, open: true };
    },

    handleStep: () => {
      const { idx } = action;
      return { activeStep: idx };
    },

    handleComplete: () => {
      const { completed, activeStep } = state;
      const newCompleted = completed;
      newCompleted[activeStep - 1] = true;
      return { completed: { ...completed, ...newCompleted } };
    },

    continue: () => {
      const { activeStep } = state;
      const newActive = activeStep === steps.length - 1 ? -1 : activeStep + 1;
      switch (newActive) {
        case 1:
          return dispatch({ type: "handleStep1", newActive });
        case -1:
          return dispatch({ type: "handleStep2", newActive });
      }
    },

    handleStep1: () => {
      const { newActive } = action;
      const { info, activeStep } = state;
      if (!!info.district && !!info.ward && !!info.code) {
        !!row.id ? dispatch("editList") : dispatch("saveList");
        return { activeStep: newActive };
      } else {
        enqueueSnackbar(translate("recordsManagement.notEnough"), {
          variant: "error",
        });
        return { activeStep, openConfirm: false };
      }
    },

    handleStep2: () => {
      dispatch("handleComplete");
      return { open: false, openConfirm: false };
    },

    changeInfo: () => {
      const { name, value } = action;
      const { info } = state;
      info[name] = value;
      if (name === "ward") {
        info.wardId = value?.key;
      }
      return { info };
    },

    saveList: async () => {
      const { info } = state;
      dispatch("onLoading");
      let lastMonthItem = null;
      const { data, success } = await List.post({
        ...info,
        form,
        yearId,
        point: 1,
        type: Type.Paid,
        provinceId: province.key,
        districtId: info.district.key,
        wardId: info.ward.key,
        doet_id: moetId,
        unitId: doet.id,
      });
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        enqueueSnackbar(translate("common.addMes"), {
          variant: "success",
        });
        dispatch("handleComplete");
        const getMonth = data.code.split("/", 1);
        const lastMonth = +getMonth - 1;
        const lastCode =
          lastMonth < 1 ? null : data.code.replace(getMonth, lastMonth);
        if (lastCode) {
          const rows = _.get(globalThis.reducers, "monthlyPaymentReducer.rows");
          const item = (rows || []).find(
            (i) => i.code === lastCode && i.wardId == data.wardId
          );
          lastMonthItem = !!item ? item : null;
        }
      }
      return { loading: false, listId: data.id, lastMonthItem };
    },

    editList: async () => {
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
      return { loading: false };
    },

    openConfirm: () => ({ openConfirm: true }),
    closeConfirm: () => ({ openConfirm: false }),
    onLoading: () => ({ loading: true }),
    showModal: () => ({ open: true }),
    closeModal: () => ({ open: false, openConfirm: false }),
  };
  return cases[action.type] && cases[action.type]();
};
export default detailMonthlyReducer;
