import List from "api/List";
import Year from "api/Year";
import Province from "api/Province";
import Doet from "api/Doet";
import _ from "lodash";
import moment from "moment";
import {
  Type,
  convertCurrency,
  paymentUnit,
} from "../monthlyPayment/components/utils";
import { get } from "src/hooks/useLocalStorage";

const getType = (subsidyForm) => {
  switch (subsidyForm) {
    case 0:
      return "1-time";
    case 1:
      return "every-month";
    case 2:
      return "every-year";
    default:
      return "";
  }
};

function renderRows(profiles) {
  let childArr: any = [];
  let array: any = [];
  for (let i = 0; i < profiles.length; i++) {
    const numberChild = childArr.filter(
      (c: any) => profiles[i].name === c.name
    );
    childArr = profiles.filter((p: any) => profiles[i].name === p.name);
    if (numberChild.length > 0) continue;
    array = [...array, { name: profiles[i].name, isFather: true }, ...childArr];
  }
  return array;
}

export default function implementationListReducer({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
}: any) {
  const infoDomain = get("infoDomain") || {};
  const user = get("user");
  const isDomain = user?.unitId === user?.doet;

  const newState = {
    checkAll: false,
    editHead: {},
    valueSearch: {},
    valueFilter: {},
    dataFilter: {},
    whereSearch: {},
  };

  const cases: any = {
    initial: async () => {
      const res: any = {};

      res.roleUser = user?.role?.role || "";
      res.unit = paymentUnit.map((item, idx) => ({ value: item, id: idx }));
      res.province = infoDomain?.province;
      const provinceId = res.province?.key || null;

      if (!_.isEmpty(res.province)) {
        const dataDistrict = await Province.getDistrict(provinceId);
        res.districts = dataDistrict.data || [];
      }

      const [yearResponse, doetResponse] = await Promise.all([
        Year.get({ where: { status: true }, order: { year: "DESC" } }),
        Doet.get({
          where: isDomain ? { parentId: infoDomain?.id } : { id: user?.unitId },
        }),
      ]);
      if (!yearResponse.success || !doetResponse.success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      } else {
        res.years = _.get(yearResponse, "data.items") || [];
        res.year = res.years[0];

        const doetsApi = _.get(doetResponse, "data.items") || [];
        res.doets = isDomain ? [infoDomain, ...doetsApi] : [...doetsApi];
        res.doet = res.doets[0];

        const doetFilter = !res.doet?.parentId
          ? { doet_id: res.doet.id }
          : { unitId: res.doet.id };
        dispatch({
          type: "loadLists",
          subsidy_form: 1, //hard monthlyList
          yearId: res.year.id,
          provinceId,
          doet_filter: doetFilter,
        });
      }
      return { ...res };
    },

    loadLists: async () => {
      const {
        subsidy_form,
        yearId,
        provinceId,
        doet_filter,
        load_notify,
        filterSearch,
        paging,
        filter_notify,
      } = action;
      const { page, subsidyForm, year, province, doetFilter } = state;

      const res: any = {};
      const filter = !doet_filter ? doetFilter : doet_filter;

      const params = {
        form: subsidy_form === 0 ? 0 : subsidy_form || subsidyForm,
        yearId: yearId || year.id,
        provinceId: provinceId || province.key,
        type: { value: [Type.Excute], operation: "in" },
      };
      const F = !filterSearch ? {} : filterSearch;
      const onPaging = !paging ? { pageSize: 10, pageNumber: 0 } : paging;

      dispatch("onLoading");
      const { data, success } = await List.get({
        ...onPaging,
        where: {
          ...F,
          ...params,
          ...filter,
        },
      });
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      } else {
        !!load_notify &&
          enqueueSnackbar(translate("common.loadSuccess"), {
            variant: "success",
          });
        res.rows = _.get(data, "items") || [];
        if (filter_notify) {
          res.rows.length > 0
            ? enqueueSnackbar(translate("userManager.findSuccess"), {
                variant: "success",
              })
            : enqueueSnackbar(translate("userManager.findError"), {
                variant: "warning",
              });
        }
        res.existCode = res.rows.map((i) => i.code);
        res.page = {
          page: data.pageNumber,
          pageSize: data.pageSize,
          count: Math.ceil(data.count / page.pageSize || 0),
        };
      }
      return { ...res, loading: false };
    },

    onSelect: async () => {
      const { name, value } = action;
      const { year, subsidyForm, doets } = state;

      if (name === "doet") {
        const doet = doets.find((i: any) => i.id === value);
        const doetFilter = !doet.parentId
          ? { doet_id: value }
          : { unitId: value };

        dispatch({
          type: "loadLists",
          doet_filter: doetFilter,
          load_notify: true,
        });
        return { ...newState, doet, doetFilter };
      } else {
        const params = { year: year, subsidyForm: subsidyForm, [name]: value };

        dispatch({
          type: "loadLists",
          subsidy_form: params.subsidyForm,
          yearId: params.year.id,
          load_notify: true,
        });
        return { ...newState, ...params };
      }
    },

    refresh: () => {
      const { districts, unit } = state;
      const res: any = {};

      dispatch("loadLists");
      res.districts = districts.map((item: any) => ({
        ...item,
        isfilter: false,
      }));
      res.wards = [];
      res.unit = unit.map((item: any) => ({
        ...item,
        isfilter: false,
      }));
      return { ...newState, ...res, checkAll: false };
    },

    onCheck: () => {
      const { data, ele } = action;
      const { rows } = state;
      const value = ele.target.checked;
      const res: any = {};

      if (data.name === "checkAll") {
        rows.map((item: any) => (item.isCheck = value));
      } else {
        rows[data.rowIdx] = { ...rows[data.rowIdx], isCheck: value };
      }

      const checkAll = rows.every((item: any) => !!item.isCheck);
      const listId = (
        rows.filter((item: any) => item.isCheck === true) || []
      ).map((users: any) => users.id);

      return { rows, ...res, checkAll, listId };
    },

    deleteAll: async () => {
      const { rows, listId } = state;

      dispatch("onLoading");
      listId.forEach(async (id) => await List.put(id, { type: Type.Paid }));
      const res: any = {};
      enqueueSnackbar(translate("userManager.messDelete"), {
        variant: "success",
      });
      const data = rows.filter((item: any) => !listId.includes(item.id));
      res.rows = data;
      res.existCode = data.map((i) => i.code);
      res.checkAll = false;

      return {
        ...res,
        confirm: { ...confirm, open: false },
        loading: false,
      };
    },

    delete: async () => {
      const { row, rows } = state;
      dispatch("onLoading");
      const res: any = {};
      const dataApi = await List.put(row.id, { type: Type.Paid });

      if (dataApi.success) {
        const index = rows.findIndex((i: any) => i.id === row.id);
        rows.splice(index, 1);
        res.existCode = rows.map((i) => i.code);
        enqueueSnackbar(translate("common.deleteMes"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }
      return {
        ...res,
        rows,
        confirm: { ...confirm, open: false },
        loading: false,
      };
    },

    openDialog: () => {
      const { openKey } = state;
      const {
        data: { name, item },
      } = action;

      const openData = { ...openKey, type: name, open: openKey.open + 1 };
      const res =
        name === "update" ? { row: item, listId: item.id } : { row: {} };

      return {
        ...res,
        openKey: openData,
      };
    },

    onPaging: async () => {
      const { pageSize, pageNumber } = action;
      const { valueFilter, whereSearch } = state;
      let F: any = {};

      if (!_.isEmpty(valueFilter)) {
        F = { ...F, ...valueFilter };
      }

      if (!_.isEmpty(whereSearch)) {
        F = { ...F, ...whereSearch };
      }

      dispatch({
        type: "loadLists",
        filterSearch: F,
        paging: { pageSize, pageNumber },
      });

      return {
        loading: false,
      };
    },

    exports: async () => {
      const { listId, rows, subsidyForm } = state;
      if (!_.isEmpty(listId)) {
        const type = getType(subsidyForm);
        let time = 100;
        listId.forEach(function (id) {
          setTimeout(function () {
            window.open(
              `${process.env.apiUrl}report/list-support?type=${type}&id=${id}`
            );
          }, 200 + time);
          time += 100;
        });
        rows.map((item: any) => (item.isCheck = false));
      }
      return { rows, checkAll: false };
    },

    showDetail: async () => {
      const { showDetail } = state;
      const { item } = action.data;
      const res: any = {};
      dispatch("onLoading");
      const { data, success } = await List.getDetail(item.id, {
        relation: `["listProfiles","listProfiles.profiles"]`,
        where: "prefers",
      });
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      } else {
        const profile = _.get(data, "profile") || [];
        res.dataRows = renderRows(profile);
        res.total = convertCurrency(_.get(data, "total", 0));
      }
      return { ...res, showDetail: showDetail + 1, loading: false };
    },

    restorePoint: async () => {
      const { listId } = state;
      dispatch("onLoading");
      const { success } = await List.put(listId, { point: 1 });
      if (success) {
        enqueueSnackbar(translate("common.updateMes"), {
          variant: "success",
        });
        dispatch("loadLists");
      } else
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      return { loading: false };
    },

    openPopver: () => {
      const {
        ele,
        data: { name },
      } = action;
      const { anchorEl }: any = state;
      return {
        anchorEl: {
          ...anchorEl,
          [name]: ele.currentTarget,
        },
      };
    },

    closePopver: () => {
      const {
        data: { name },
      } = action;
      const { anchorEl } = state;
      return { anchorEl: { ...anchorEl, [name]: null } };
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
      const { valueSearch } = state;
      valueSearch[name] = ele?.target?.value || "";

      if (name === "receiveDate") {
        const date = ele == "Invalid Date" ? "" : ele == null ? "" : ele;
        date !== "" && date.setDate(date.getDate() - 1);
        valueSearch.receiveDate = date;
      }

      const keys = Object.keys(valueSearch).filter(
        (item) => valueSearch[item] !== ""
      );

      let whereSearch = {};
      for (let i = 0; i < keys.length; i++) {
        whereSearch = {
          ...whereSearch,
          [keys[i]]: { value: `%${valueSearch[keys[i]]}%`, operation: "like" },
        };
        if (keys[i] === "receiveDate") {
          const value = moment(valueSearch?.receiveDate, "YYYY-MM-DD").format(
            "YYYY-MM-DD"
          );
          whereSearch = {
            ...whereSearch,
            receiveDate: {
              value: [`${value} 00:00:01`, `${value} 23:59:59`],
              operation: "between",
            },
          };
        }
      }

      dispatch({
        type: "loadLists",
        filterSearch: whereSearch,
        filter_notify: true,
      });

      return { whereSearch };
    },

    onChangeFilter: async () => {
      const {
        data: { index, name },
        ele,
      } = action;
      const value = ele.target.checked;
      const { districts, wards, unit } = state;
      const res: any = {};

      const dataFilter = state.dataFilter || {};
      if (name === "districts") {
        districts[index] = { ...districts[index], isfilter: value };
        const values = districts.filter((item) => item.isfilter === true);
        dataFilter.districts = { name: "districtId", value: values };

        if (dataFilter.districts.value.length < 2) {
          const id = dataFilter.districts.value[0].key || "";
          const dataWard = await Province.getWard(id);
          res.wards = dataWard.data || [];
        } else res.wards = [];
      }
      if (name === "wards") {
        wards[index] = { ...wards[index], isfilter: value };
        const values = wards.filter((item) => item.isfilter === true);
        dataFilter.wards = { name: "wardId", value: values };
      }

      if (name === "unit") {
        unit[index] = { ...unit[index], isfilter: value };
        const values = unit.filter((item: any) => item.isfilter === true);
        dataFilter.unit = { name: "unit", value: values };
      }

      const items: any = Object.values(dataFilter).filter(
        (item: any) => item.value.length > 0
      );

      const valueFilter = {
        ...items.reduce((obj: any, item: any) => {
          obj[item?.name] = {
            value: (item.value || []).map((i) =>
              item.name === "unit" ? i.id : i.key
            ),
            operation: "in",
          };
          return obj;
        }, {}),
      };

      return { districts, wards, valueFilter, dataFilter, ...res };
    },

    filter: async () => {
      const { valueFilter } = state;
      dispatch({
        type: "loadLists",
        filterSearch: valueFilter,
        filter_notify: true,
      });
    },

    openConfirm: () => {
      const {
        data: { name, item },
      } = action;
      const { confirm } = state;
      const res: any = {};
      const newData = {
        ...confirm,
        type: name,
        content: translate("paymentList.mesDelete"),
        open: true,
      };
      if (name === "delete") {
        res.row = item;
      }
      return { ...res, confirm: newData };
    },

    closeConfirm: () => {
      const { confirm } = state;
      return {
        confirm: {
          ...confirm,
          open: false,
        },
      };
    },

    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
}
