import _ from "lodash";
import Year from "api/Year";
import BurialFee from "api/BurialFee";
import Category from "api/Category";
import Doet from "api/Doet";
import { get } from "src/hooks/useLocalStorage";
import moment from "moment";
import { relation } from "logic/recordsManagement/components/utils";

export default function burialFeeReducer({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
}: any) {
  const infoDomain = get("infoDomain");
  const user = get("user");
  const newState = {
    editHead: {},
    valueSearch: {},
    valueFilter: {},
    dataFilter: {},
    whereSearch: {},
    relation: relation.map((item: any) => ({
      ...item,
      isfilter: false,
    })),
  };

  const cases: any = {
    initial: async () => {
      const isDomain = user?.unitId === user?.doet; //so
      const res: any = {};

      const [dataDoet, dataCategory, dataYear] = await Promise.all([
        Doet.get({
          where: isDomain ? { parentId: infoDomain?.id } : { id: user?.unitId },
        }),
        Category.get({
          where: {
            status: true,
            unitId: _.get(infoDomain, "province.key"), //get theo tinh
          },
          order: { index: "ASC" },
        }),
        Year.get({ where: { status: true }, order: { year: "DESC" } }),
      ]);

      const doetsApi = _.get(dataDoet, "data.items") || [];
      res.doets = isDomain ? [infoDomain, ...doetsApi] : [...doetsApi];
      res.doet = res.doets[0];

      res.categories = _.get(dataCategory, "data.items") || [];
      res.years = _.get(dataYear, "data.items") || [];
      res.year = res.years[0];
      res.yearId = res.year?.id;

      const doetFilter = !res.doet?.parentId
        ? { doet_id: res.doet?.id }
        : { unitId: res.doet?.id };
      dispatch({
        type: "loadBurialFees",
        year_id: res.yearId,
        doet_filter: doetFilter,
      });
      return { ...res };
    },

    handleChange: () => {
      const { name, value } = action;
      const { doets } = state;

      if (name === "doet") {
        const doet = doets.find((i: any) => i.id === value);
        const doetFilter = !doet.parentId
          ? { doet_id: value }
          : { unitId: value };

        dispatch({
          type: "loadBurialFees",
          doet_filter: doetFilter,
          notify: true,
        });
        return { ...newState, doet, doetFilter };
      }

      if (name === "year") {
        dispatch({
          type: "loadBurialFees",
          year_id: value.id,
          notify: true,
        });
        return { ...newState, year: value, yearId: value.id };
      }
    },

    loadBurialFees: async () => {
      const { yearId, doetFilter, page } = state;
      const { year_id, notify, doet_filter } = action;
      const res: any = {};
      const filter = !doet_filter ? doetFilter : doet_filter;

      dispatch("onLoading");
      const burialFeesRes = await BurialFee.get({
        relation: `["profiles", "profiles.infoBeneficiary", "profiles.infoNcc"]`,
        where: {
          yearId: year_id || yearId,
          //...filter,
        },
        pageSize: 10,
        pageNumber: 0,
      });

      if (!burialFeesRes.success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      } else {
        res.rows = _.get(burialFeesRes, "data.items") || [];
        res.page = {
          page: burialFeesRes.data.pageNumber,
          pageSize: burialFeesRes.data.pageSize,
          count: Math.ceil(burialFeesRes.data.count / page.pageSize || 0),
        };

        !!notify &&
          enqueueSnackbar(translate("common.loadSuccess"), {
            variant: "success",
          });
      }

      return { ...res, loading: false };
    },

    refresh: async () => {
      const { categories, yearId, doetFilter } = state;
      dispatch({
        type: "loadBurialFees",
        doetFilter,
        yearId,
        notify: true,
      });
      const cate = categories.map((item: any) => ({
        ...item,
        isfilter: false,
      }));

      return { ...newState, categories: cate };
    },

    openConfirm: () => {
      const { confirm } = state;
      const {
        data: { name, item },
      } = action;
      return {
        confirm: {
          ...confirm,
          open: true,
          type: name,
        },
        row: item || {},
      };
    },

    closeConfirm: () => ({
      confirm: {
        open: false,
      },
    }),

    openModal: () => {
      const { modal } = state;
      const {
        data: { item, name },
      } = action;
      const row = name === "addNew" ? {} : item;

      return { modal: { ...modal, open: true }, row };
    },

    closeModal: () => {
      const { modal } = state;
      return { modal: { ...modal, open: false } };
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

    onPaging: async () => {
      const { pageSize, pageNumber } = action;
      const { valueFilter, whereSearch, yearId, doetFilter, page } = state;

      let F: any = {};
      if (!_.isEmpty(valueFilter)) {
        F = { ...F, ...valueFilter };
      }

      if (!_.isEmpty(whereSearch)) {
        F = { ...F, ...whereSearch };
      }

      dispatch("onLoading");
      const { data, success } = await BurialFee.get({
        relation: `["profiles", "profiles.infoBeneficiary", "profiles.infoNcc"]`,
        where: {
          ...F,
          yearId: yearId,
          ...doetFilter,
        },
        pageSize: pageSize,
        pageNumber: pageNumber || page?.pageNumber || 0,
      });

      const restData: any = {};
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        restData.rows = _.get(data, "items") || [];
        restData.page = {
          count: Math.ceil(data?.count / pageSize || 0),
          pageSize: data?.pageSize,
          page: data?.pageNumber,
        };
      }

      return {
        loading: false,
        ...restData,
      };
    },

    deliverItem: () => {
      const { modal } = state;

      dispatch("loadBurialFees");
      return { modal: { ...modal, open: false } };
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
      ).map((fee: any) => fee.id);

      return { rows, ...res, checkAll, listId };
    },

    deleteAll: async () => {
      const { rows, listId } = state;

      const res: any = {};
      const params = { ids: listId };
      dispatch("onLoading");
      const dataApi = await BurialFee.deletes(params);

      if (dataApi.success) {
        rows.map((item: any) =>
          listId.includes(item.id)
            ? (item.isDelete = true)
            : (item.isDelete = false)
        );
        const data = rows.filter((item: any) => item.isDelete === false);
        res.rows = data;
        res.checkAll = false;

        enqueueSnackbar(translate("userManager.messDelete"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }
      return {
        ...res,
        confirm: { ...confirm, open: false },
        loading: false,
      };
    },

    delete: async () => {
      const { row, rows, confirm } = state;
      const index = rows.findIndex((item) => item.id == row.id);
      const dataApi = await BurialFee.delete(row.id);

      if (dataApi?.success) {
        rows.splice(index, 1);
        enqueueSnackbar(translate("common.deleteMes"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }

      return { rows, confirm: { ...confirm, open: false } };
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
      const { valueSearch, yearId, doetFilter } = state;
      valueSearch[name] = ele?.target?.value || "";
      // if (name === "dateOfBirth") {
      //   const date = ele == "Invalid Date" ? "" : ele == null ? "" : ele;
      //   date !== "" && date.setDate(date.getDate() - 1);
      //   valueSearch.dateOfBirth = date;
      // }

      const keys = Object.keys(valueSearch).filter(
        (item) => valueSearch[item] !== ""
      );

      let whereSearch = {};
      for (let i = 0; i < keys.length; i++) {
        whereSearch = {
          ...whereSearch,
          [keys[i]]: { value: `%${valueSearch[keys[i]]}%`, operation: "like" },
        };
        // if (keys[i] === "dateOfBirth") {
        //   whereSearch = {
        //     ...whereSearch,
        //     dateOfBirth: {
        //       value: [
        //         `${moment(valueSearch?.dateOfBirth, "YYYY-MM-DD").format(
        //           "YYYY-MM-DD"
        //         )} 00:00:01`,
        //         `${moment(valueSearch?.dateOfBirth, "YYYY-MM-DD").format(
        //           "YYYY-MM-DD"
        //         )} 23:59:59`,
        //       ],
        //       operation: "between",
        //     },
        //   };
        // }
      }

      const { data, success } = await BurialFee.get({
        pageSize: 10,
        pageNumber: 0,
        where: {
          ...whereSearch,
          yearId,
          ...doetFilter,
        },
        relation: `["profiles", "profiles.infoBeneficiary", "profiles.infoNcc"]`,
      });

      const res: any = {};
      if (success) {
        res.rows = _.get(data, "items") || [];
        res.rows.length > 0
          ? enqueueSnackbar(translate("userManager.findSuccess"), {
              variant: "success",
            })
          : enqueueSnackbar(translate("userManager.findError"), {
              variant: "warning",
            });
        res.page = {
          page: 0,
          pageSize: 10,
          count: Math.ceil(data?.count / 10 || 10),
        };
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }

      return { ...res, whereSearch };
    },
    showDetail: () => {
      const { modal } = state;
      const { item } = action.data;
      return { row: item, modal: { ...modal, openDetail: true } };
    },
    closeDetail: () => {
      const { modal } = state;
      return { modal: { ...modal, openDetail: false } };
    },
    onLoading: () => ({ loading: true }),
  };

  return cases[action.type] && cases[action.type]();
}
