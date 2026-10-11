import _ from "lodash";
import moment from "moment";
import Profile from "api/Profile";
import Province from "api/Province";
import Export from "api/Export";
import Doet from "api/Doet";
import Category from "api/Category";
import ImportFile from "api/ImportFile";
import { status } from "logic/recordsManagement";
import { get } from "src/hooks/useLocalStorage";
import List from "api/List";

export default function recordsReducer({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
}: any) {
  const infoDomain = get("infoDomain");
  const user = get("user");
  const isDomain = user?.unitId === user?.doet; //so
  const token = get("token");

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
      const [dataProvince, dataDoet, dataDistrict, dataCategory] =
        await Promise.all([
          Province.get({}),
          Doet.getItems(token, {
            where: isDomain
              ? { parentId: infoDomain?.id }
              : { id: user?.unitId },
          }),
          Province.getDistrict(infoDomain?.province?.key),
          Category.get({
            where: {
              unitId: infoDomain?.province?.key,
              status: true,
            },
            order: { index: "ASC" },
          }),
        ]);
      if (!dataDoet?.data?.success || !dataCategory.success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
        return;
      }

      res.status = status;
      res.provinces = _.get(dataProvince, "data") || [];
      res.districts = _.get(dataDistrict, "data") || [];

      const doetsApi = _.get(dataDoet, "data.data.items") || [];

      res.doets = isDomain ? [infoDomain, ...doetsApi] : [...doetsApi];
      res.doet = res.doets[0];
      res.categories = _.get(dataCategory, "data.items") || [];
      res.category = res.categories[0] || {};
      res.categoryId = res.category.id;
      res.categoryKey = res.category.key;
      res.catValue = 0;

      const doetFilter = !res.doet?.parentId
        ? { doet_id: res.doet.id }
        : { unitId: res.doet.id };
      dispatch({
        type: "getProfile",
        cat_id: res.categoryId,
        doetFilter,
      });

      return { ...res };
    },

    refresh: async () => {
      const { doetFilter } = state;
      dispatch("refreshFilter");
      dispatch({
        type: "getProfile",
        doetFilter,
        notify: true,
      });
    },

    onClick: () => {
      const { item, index } = action;
      return { category: item, catValue: index };
    },

    selectCategory: async () => {
      const { item, index } = action;
      const { doet } = state;
      const res: any = {};
      dispatch({ type: "onClick", item, index });
      dispatch("refreshFilter");
      res.categoryId = item.id;
      res.categoryKey = item.key;
      const doetFilter = !doet.parentId
        ? { doet_id: doet.id }
        : { unitId: doet.id };
      dispatch({
        type: "getProfile",
        cat_id: item.id,
        doetFilter,
      });

      return { ...res, itemHead: item };
    },

    refreshFilter: async () => {
      const { districts, genders } = state;
      const res: any = {};
      res.districts = districts.map((item: any) => ({
        ...item,
        isfilter: false,
      }));
      res.genders = genders.map((item: any) => ({
        ...item,
        isfilter: false,
      }));
      res.status = status.map((item: any) => ({
        ...item,
        isfilter: false,
      }));

      return { ...newState, ...res };
    },

    onChange: () => {
      const { value } = action;
      const { doets } = state;
      const doet = doets.find((i: any) => i.id === value);
      const doetFilter = !doet.parentId
        ? { doet_id: value }
        : { unitId: value };
      dispatch("refreshFilter");
      dispatch({
        type: "getProfile",
        notify: true,
        doetFilter,
      });
      return { doet };
    },

    getProfile: async () => {
      const { categoryId } = state;
      const { cat_id, notify, doetFilter } = action;

      dispatch("onLoading");
      const res: any = {};
      const dataProfile = await Profile.get({
        pageSize: 10,
        pageNumber: 0,
        where: {
          categoryId: { value: [cat_id || categoryId], operation: "in" },
          ...doetFilter,
        },
        order: { fullName: "ASC" },
      });
      if (!dataProfile.success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        !!notify &&
          enqueueSnackbar(translate("common.loadSuccess"), {
            variant: "success",
          });
        res.rows = _.get(dataProfile, "data.items") || [];
        res.page = {
          page: dataProfile.data.pageNumber,
          pageSize: dataProfile.data.pageSize,
          count: Math.ceil(dataProfile.data.count / 10),
        };
      }

      return { ...res, loading: false, doetFilter };
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
      const res: any = {};
      const params = { ids: listId };
      let del = true;
      dispatch("onLoading");
      if (!!listId) {
        for (let i = 0; i < listId.length; i++) {
          const { data } = await List.checkExistUser(listId[i]);
          if (!_.isEmpty(data)) {
            del = false;
            break;
          }
        }
        if (!del) {
          enqueueSnackbar(translate("recordsManagement.errorDelMes"), {
            variant: "error",
          });
          return {
            confirm: { ...confirm, open: false },
            loading: false,
          };
        }

        const dataApi = await Profile.deletes(params);
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
      }
      return {
        ...res,
        confirm: { ...confirm, open: false },
        loading: false,
      };
    },

    delete: async () => {
      const { row, rows } = state;
      const res: any = {};
      dispatch("onLoading");

      const { data, success } = await List.checkExistUser(row.id);
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
        return { confirm: { ...confirm, open: false }, loading: false };
      }

      if (_.isEmpty(data)) {
        const dataApi = await Profile.delete(row.id);
        if (dataApi.success) {
          const index = rows.findIndex((i: any) => i.id === row.id);
          rows.splice(index, 1);
          enqueueSnackbar(translate("common.deleteMes"), {
            variant: "success",
          });
        } else {
          enqueueSnackbar(translate("common.errorMes"), {
            variant: "error",
          });
        }
      } else {
        enqueueSnackbar(translate("recordsManagement.errorDelMes"), {
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

    onChangeFilter: () => {
      const {
        data: { index, name },
        ele,
      } = action;
      const value = ele.target.checked;
      const { districts, genders }: any = state;
      const dataFilter: any = state.dataFilter || {};
      if (name === "districts") {
        districts[index] = { ...districts[index], isfilter: value };
        const values = districts.filter((item: any) => item.isfilter === true);
        const dataVal = values.map((i) => ({ key: i.key, value: i.value }));
        dataFilter.district = { name: "district", value: dataVal };
      }

      if (name === "genders") {
        genders[index] = { ...genders[index], isfilter: value };
        const values = genders
          .filter((item: any) => item.isfilter === true)
          .map((i: any) => i.id);
        dataFilter.gender = { name: "gender", value: values };
      }

      if (name === "status") {
        status[index] = { ...status[index], ...{ isfilter: value } };
        const values = status
          .filter((item: any) => item.isfilter === true)
          .map((i: any) => i.id);
        dataFilter.status = { name: "point", value: values.flat() };
      }

      const items: any = Object.values(dataFilter).filter(
        (item: any) => item?.value.length > 0
      );
      const valueFilter = {
        ...items.reduce((obj: any, item: any) => {
          obj[item.name] = { value: item.value, operation: "in" };
          return obj;
        }, {}),
      };

      return { districts, genders, status, valueFilter, dataFilter };
    },

    filter: async () => {
      const { valueFilter, page, categoryId, doetFilter } = state;

      const { data, success } = await Profile.get({
        pageSize: page.pageSize || 10,
        pageNumber: 0,
        where: {
          ...valueFilter,
          categoryId: { value: [categoryId], operation: "in" },
          ...doetFilter,
        },
        order: { fullName: "ASC" },
      });

      const res: any = {};
      if (success) {
        res.rows = _.get(data, "items");
        res.page = {
          count: Math.ceil(data?.count / data?.pageSize || 0),
          pageSize: data?.pageSize,
          page: data?.pageNumber,
        };
        res.rows.length > 0
          ? enqueueSnackbar(translate("userManager.findSuccess"), {
              variant: "success",
            })
          : enqueueSnackbar(translate("userManager.findError"), {
              variant: "warning",
            });
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }

      return { ...res, loading: false };
    },

    onPaging: async () => {
      const { pageSize, pageNumber } = action;
      const { valueFilter, whereSearch, categoryId, doetFilter, page } = state;
      let F: any = {};

      if (!_.isEmpty(valueFilter)) {
        F = { ...F, ...valueFilter };
      }

      if (!_.isEmpty(whereSearch)) {
        F = { ...F, ...whereSearch };
      }

      dispatch("onLoading");
      const { data: dataProfile, success } = await Profile.get({
        pageSize: pageSize,
        pageNumber: pageNumber || 0,
        where: {
          ...F,
          categoryId: { value: [categoryId], operation: "in" },
          ...doetFilter,
        },
        order: { fullName: "ASC" },
      });
      const restData: any = {};
      if (success) {
        restData.rows = _.get(dataProfile, "items") || [];
        restData.page = {
          count: Math.ceil(dataProfile?.count / pageSize || 0),
          pageSize: dataProfile?.pageSize,
          page: dataProfile?.pageNumber,
        };
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }
      return {
        ...restData,
        loading: false,
      };
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
      const { valueSearch, categoryId, doetFilter } = state;
      valueSearch[name] = ele?.target?.value || "";

      const keys = Object.keys(valueSearch).filter(
        (item) => valueSearch[item] !== ""
      );

      let whereSearch = {};
      for (let i = 0; i < keys.length; i++) {
        whereSearch = {
          ...whereSearch,
          [keys[i]]: { value: `%${valueSearch[keys[i]]}%`, operation: "like" },
        };
      }

      const { data, success } = await Profile.get({
        pageSize: 10,
        pageNumber: 0,
        where: {
          ...whereSearch,
          categoryId: { value: [categoryId], operation: "in" },
          ...doetFilter,
        },
        order: { fullName: "ASC" },
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
          count: Math.ceil(data?.count / 10 || 0),
        };
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }

      return { ...res, whereSearch };
    },

    showDetail: () => {
      const { openKey } = state;
      const { item } = action.data;
      return {
        row: item,
        openKey: {
          ...openKey,
          showDetail: openKey.showDetail + 1,
        },
      };
    },

    exports: async () => {
      const { listId } = state;
      const { value, e } = action;

      if (_.isEmpty(listId)) {
        return enqueueSnackbar(translate("recordsManagement.errorExport"), {
          variant: "error",
        });
      }

      const ids = (listId || []).map((i) => i + "");
      const dataApi = await Export.get({
        template: value,
        ids: JSON.stringify([...ids]),
      });

      if (dataApi.errors) {
        return enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }
      window.open(
        `${
          process.env.apiUrl
        }report/exports?template=${value}&ids=${JSON.stringify([...ids])}`,
        "_self"
      );

      return;
    },

    openDialog: () => {
      const { openKey } = state;
      const {
        data: { name, item },
      } = action;

      const res: any = {};
      if (name === "addNew") {
        openKey.type = "addNew";
        res.row = {};
      }
      if (name === "update") {
        openKey.type = "update";
        res.row = item;
      }

      return {
        ...res,
        openKey: {
          ...openKey,
          open: openKey.open + 1,
        },
      };
    },

    openDialogImport: () => {
      const { openKeyImport } = state;
      return { openKeyImport: { ...openKeyImport, open: openKeyImport + 1 } };
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

    openConfirm: () => {
      const {
        data: { name, item, type },
      } = action;
      const { confirm } = state;
      const res: any = {};

      if (name === "delete") {
        confirm.type = "delete";
        confirm.content = translate("userManager.mesDeleteUser");
        res.row = item;
      }

      if (name === "deleteAll") {
        confirm.type = "deleteAll";
        confirm.content = translate("userManager.mesDeleteUser");
      }

      return { ...res, confirm: { ...confirm, open: true } };
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

    import: async () => {
      const { e } = action;
      const { categoryId } = state;
      const file = e.target.files;

      dispatch("onLoading");

      let formData = new FormData();
      for (const key of Object.keys(file)) {
        formData.append("file", file[key]);
      }

      const { data, success } = await ImportFile.import(categoryId, formData);

      dispatch("refresh");
      return { loading: false };
    },
  };

  return cases[action.type] && cases[action.type]();
}
