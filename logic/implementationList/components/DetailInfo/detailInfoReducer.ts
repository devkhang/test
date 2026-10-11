import _ from "lodash";
import moment from "moment";
import List from "api/List";
import {
  Status,
  convertCurrency,
  Type,
  renderRows,
} from "logic/monthlyPayment/components/utils";

const setDataPrefers = (dataProfiles) => {
  const dataPrefers: any = [];
  if (!_.isEmpty(dataProfiles)) {
    dataProfiles.forEach((profile) => {
      profile.prefers?.forEach((prefer) => {
        dataPrefers.push({
          id: profile.id,
          name: profile.fullName,
          dateOfBirth: profile.dateOfBirth,
          gender: profile.gender,
          prefers: prefer.name,
          prefersId: prefer.id,
          subsidy: prefer.subsidy,
          allowance: prefer.allowance,
          paid: prefer.paid,
          categoryId: profile.categoryId,
        });
      });
    });
  }
  return dataPrefers;
};

const detailInfoReducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any) => {
  const { listId, row, deliverItem } = props;

  const cases: any = {
    initial: async () => {
      const res: any = {};
      dispatch("onLoading");
      const { data, success } = await List.getDetail(listId, {
        relation: `["listProfiles","listProfiles.profiles"]`,
        where: "prefers",
      });
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      } else {
        const dataPrefers = _.get(data, "profile") || [];

        res.rows = renderRows(dataPrefers);
        res.oldRows = _.cloneDeep(res.rows);
        res.total = convertCurrency(_.get(data, "total", 0));
      }
      const checked = row.point === Status.Complete;
      deliverItem && deliverItem(checked);
      return { ...res, loading: false };
    },

    changeStatus: () => {
      const { rowIdx, value } = action;
      const { rows } = state;
      rows[rowIdx] = { ...rows[rowIdx], paid: value };

      return { loading: false, rows };
    },

    onChange: () => {
      const {
        data: { name, rowIdx, item },
        ele,
      } = action;
      const { rows } = state;
      if (name === "receiveDate") {
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

    setEditHead: () => {
      const {
        data: { name },
      } = action;
      const { editHead, valueSearch } = state;
      valueSearch[name] = !editHead[name] ? valueSearch[name] : "";
      !!editHead[name] && dispatch({ type: "onSearch", data: { name } });

      return {
        editHead: { ...editHead, [name]: !editHead[name] },
        valueSearch,
      };
    },

    onSearch: async () => {
      const {
        data: { name },
        ele,
      } = action;
      const { valueSearch, oldRows } = state;
      valueSearch[name] = ele?.target?.value || "";

      const keys = Object.keys(valueSearch).filter(
        (item) => valueSearch[item] !== ""
      );

      let whereSearch: any = {};
      for (let i = 0; i < keys.length; i++) {
        whereSearch = {
          ...whereSearch,
          [keys[i]]: valueSearch[keys[i]],
        };
      }
      const rows = oldRows.filter(
        (i) =>
          (i.name || "")
            .toLowerCase()
            .includes((whereSearch.name || "").toLowerCase()) &&
          (i.dateOfBirth || "")
            .toLowerCase()
            .includes((whereSearch.dateOfBirth || "").toLowerCase()) &&
          (i.name || "")
            .toLowerCase()
            .includes((whereSearch.receiver || "").toLowerCase())
      );
      return { rows };
    },
    onChangDate: () => {
      const { value } = action;
      if (!!value && value.toDateString() !== "Invalid Date") {
        return { date: value };
      }
    },

    browse: () => {
      const { rows, date } = state;
      if (!!date) {
        const newRows = rows.map((i) =>
          i.isFather
            ? i
            : {
                ...i,
                paidMoney: `${+(i.allowance || 0) + +(i.subsidy || 0)}`,
                paid: Type.Excute,
                receiveDate: date,
              }
        );
        dispatch("closeConfirm");
        return { rows: newRows };
      } else {
        enqueueSnackbar(translate("paymentList.mesBrowse"), {
          variant: "error",
        });
        return { err: true };
      }
    },
    openConfirm: () => ({ open: true }),
    closeConfirm: () => ({ open: false, date: null, err: false }),
    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
};
export default detailInfoReducer;
