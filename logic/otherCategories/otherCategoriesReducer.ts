import _ from "lodash";
import Insurance from "api/Insurance";
import Year from "api/Year";

export default function otherCategoriesReducer({
  state,
  action,
  dispatch,
  enqueueSnackbar,
  translate,
}: any) {
  const cases: any = {
    onClickTab: async () => {
      const { item } = action;
      dispatch("onLoading");
      const [yearApi, insuranceApi] = await Promise.all([
        Year.get({ where: { status: true }, order: { year: "DESC" } }),
        Insurance.get(),
      ]);

      const res: any = {};
      const yearArr = _.get(yearApi, "data.items") || [];
      const insuranceArr = _.get(insuranceApi, "data.items") || [];
      const renderRows = yearArr.map((item) => {
        const tmp = insuranceArr.find((obj) => item.id === obj.yearId);
        return { year: item.year, yearId: item.id, ...tmp, fee: tmp?.fee || 0 };
      });

      res.oldRows = renderRows;
      res.rows = _.cloneDeep(res.oldRows);
      return {
        ...res,
        loading: false,
        valueTab: item ? item.id : 1,
      };
    },
    setEdit: () => {
      const { rows, oldRows } = state;
      const { rowIdx } = action.data;

      rows[rowIdx].isEdit = !rows[rowIdx].isEdit;
      if (!rows[rowIdx].isEdit && !!rows[rowIdx].id) {
        rows[rowIdx] = _.cloneDeep(
          oldRows.find((item: any) => rows[rowIdx].id === item.id)
        );
      }
      return { rows };
    },
    onChange: () => {
      const {
        data: { name, rowIdx, item },
        ele,
      } = action;
      const { rows } = state;
      item[name] = ele?.target?.value;
      rows[rowIdx] = item;
      return { rows };
    },

    save: async () => {
      const { rows } = state;
      const { item, rowIdx } = action.data;
      const fee = +item.fee.replace(/,/g, "");
      dispatch("onLoading");
      const { success } = !!item.id
        ? await Insurance.put(item.id, { ...item, fee })
        : await Insurance.post({ ...item, fee });
      if (success) {
        enqueueSnackbar(translate("common.updateMes"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }
      rows[rowIdx].isEdit = false;
      return { rows, loading: false };
    },
    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
}
