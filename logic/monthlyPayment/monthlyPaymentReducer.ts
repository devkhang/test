import List from "api/List";
import Year from "api/Year";
import Category from "api/Category";
import Province from "api/Province";
import Doet from "api/Doet";
import _ from "lodash";
import moment from "moment";
import { get } from "src/hooks/useLocalStorage";
import {
  paymentUnit,
  convertCurrency,
  renderRows,
  Type,
} from "./components/utils";

const setDataPrefers = (dataProfiles) => {
  const dataPrefers: any = [];
  if (!_.isEmpty(dataProfiles)) {
    dataProfiles.forEach((item) => {
      const profile = item.profiles;

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

export default function monthlyPaymentReducer({
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

      res.unit = paymentUnit.map((item, idx) => ({ value: item, id: idx }));
      res.province = infoDomain?.province || {};
      const provinceId = res.province?.key || null;

      if (!_.isEmpty(res.province)) {
        const dataDistrict = await Province.getDistrict(provinceId);
        res.districts = dataDistrict.data || [];
      }

      const [yearResponse, doetResponse, categoryResponse] = await Promise.all([
        Year.get({ where: { status: true }, order: { year: "DESC" } }),
        Doet.get({
          where: isDomain ? { parentId: infoDomain?.id } : { id: user?.unitId },
        }),
        Category.get({
          where: {
            unitId: provinceId,
            status: true,
          },
          order: { index: "ASC" },
        }),
      ]);

      if (!doetResponse.success || !categoryResponse.success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      } else {
        res.years = _.get(yearResponse, "data.items") || [];
        res.year = res.years[0];

        const doetsApi = _.get(doetResponse, "data.items") || [];
        res.doets = isDomain ? [infoDomain, ...doetsApi] : [...doetsApi];
        res.doet = res.doets[0];

        const categoryData = _.get(categoryResponse, "data.items") || [];
        res.category = [{ id: "All", name: "Tất cả" }, ...categoryData];

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
      ).map((row: any) => row.id);
      const typeDelrows = (
        rows.filter((item: any) => item.isCheck === true) || []
      ).map((row: any) => row.type);

      return { rows, ...res, checkAll, listId, typeDelrows };
    },

    deleteAll: async () => {
      const { rows, listId, typeDelrows } = state;

      if (typeDelrows.some((t) => t == Type.Excute)) {
        enqueueSnackbar(translate("paymentList.delError"), {
          variant: "error",
        });
        return { confirm: { ...confirm, open: false } };
      } else {
        const params = { ids: listId };
        dispatch("onLoading");
        const dataApi = await List.deletes(params);

        const res: any = {};
        if (dataApi.success) {
          rows.map((item: any) =>
            listId.includes(item.id)
              ? (item.isDelete = true)
              : (item.isDelete = false)
          );
          const data = rows.filter((item: any) => item.isDelete === false);
          res.rows = data;
          res.existCode = data.map((i) => i.code);
          res.checkAll = false;

          enqueueSnackbar(translate("userManager.messDelete"), {
            variant: "success",
          });
        } else {
          enqueueSnackbar(translate("common.errorMes"), {
            variant: "error",
          });
          return;
        }

        return {
          ...res,
          confirm: { ...confirm, open: false },
          loading: false,
        };
      }
    },

    delete: async () => {
      const { row, rows } = state;
      if (row.type === Type.Excute) {
        enqueueSnackbar(translate("paymentList.delError"), {
          variant: "error",
        });
        return { confirm: { ...confirm, open: false } };
      } else {
        dispatch("onLoading");
        const res: any = {};
        const dataApi = await List.delete(row.id);

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
      }
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

    showDetail: async () => {
      const { category, showDetail } = state;
      const { item } = action.data;
      const res: any = {};
      const { data, success } = await List.getDetail(item.id, {
        relation: `["listProfiles","listProfiles.profiles"]`,
        where: "prefers",
      });
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      } else {
        const dataProfiles = _.get(data, "listProfiles") || [];
        const dataPrefers = setDataPrefers(dataProfiles);
        res.dataRows = renderRows(dataPrefers);

        const categoryId = _.get(data, "categoryId");
        const total = convertCurrency(_.get(data, "total"));
        const code = _.get(data, "code", "");

        res.detailItem = { total, categoryId, code };
      }
      return { ...res, showDetail: showDetail + 1, loading: false };
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

      if (name === "foundedDate") {
        const date = ele == "Invalid Date" ? "" : ele == null ? "" : ele;
        valueSearch.foundedDate = date;
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
        if (keys[i] === "foundedDate") {
          const value = moment(valueSearch?.foundedDate, "YYYY-MM-DD").format(
            "YYYY-MM-DD"
          );
          whereSearch = {
            ...whereSearch,
            foundedDate: {
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
        const newValue =
          values.length > 0
            ? [...values, { key: "0", value: "Tất cả" }]
            : values;
        dataFilter.wards = { name: "wardId", value: newValue };
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
            value: [
              ...(item.value || []).map((i) =>
                item.name === "unit" ? i.id : i.key
              ),
            ],
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
      const tmp: any = {};
      const newData = {
        ...confirm,
        type: name,
        content: translate("paymentList.mesDelete"),
        open: true,
      };
      if (name === "delete") {
        tmp.row = item;
      }
      return { ...tmp, confirm: newData };
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
