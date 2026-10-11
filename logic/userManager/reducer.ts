import _ from "lodash";
import User from "api/User";
import Role from "api/Role";

export default function accountDoetReducer({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
}: any) {
  const cases: any = {
    initial: async () => {
      const { roles } = state;
      const res: any = {};
      const dataRoles = _.isEmpty(roles) ? await Role.get({}) : {};

      res.roles = _.get(dataRoles, "data.items") || roles || [];

      return { ...res, loading: false };
    },

    onSelect: async () => {
      const {
        data: { item },
      } = action;

      dispatch("onLoading");
      const { data, success } = await User.get({
        pageSize: 10,
        pageNumber: 0,
        relation: JSON.stringify(["role"]),
        where: {
          unitId: { value: [item?.id || null], operation: "in" },
        },
      });

      const res: any = {};
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        const user = _.get(data, "items") || [];
        res.rows = user.filter((i) => i.deletedBy == null);
        res.page = {
          count: Math.ceil(data.count / 10),
          pageSize: data?.pageSize,
          page: data?.pageNumber,
        };
      }

      return { ...res, unitId: item?.id, dataDoet: item, loading: false };
    },

    onClickForm: () => {
      const {
        data: { data, name },
      } = action;
      const { rows } = state;
      const res: any = {};
      let mess = "";

      if (name === "saveNew") {
        res.rows = [data, ...rows];
        mess = "common.addMes";
      } else if (name === "update") {
        const index = rows.findIndex((i: any) => i.id === data.id);
        rows[index] = data;
        res.rows = rows;
        mess = "common.updateMes";
      }

      enqueueSnackbar(translate(mess), {
        variant: "success",
      });

      return { ...res, confirm: { open: false } };
    },

    onFilter: async () => {
      const { valueFilter, unitId, page, valueSearch, anchorEl } = state;
      const {
        data: { name },
      } = action;

      const dataApi = await User.get({
        pageSize: page.pageSize || 10,
        pageNumber: 0,
        relation: JSON.stringify(["role"]),
        where: {
          unitId: { value: [unitId], operation: "in" },
          ...valueFilter,
          ...valueSearch,
        },
      });

      const res: any = {};
      if (dataApi.success) {
        const user = _.get(dataApi.data, "items") || [];
        res.rows = user.filter((i) => i.deletedBy == null);
        // res.valueSearch = valueSearch
        res.page = {
          count: Math.ceil(
            dataApi?.data?.count / dataApi?.data?.pageSize || 10
          ),
          pageSize: dataApi?.data?.pageSize,
          page: dataApi?.data?.pageNumber,
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

      return {
        ...res,
        anchorEl: { ...anchorEl, [name]: null },
        loading: false,
      };
    },

    setEditHead: async () => {
      const {
        data: { name },
      } = action;
      const { editHead, valueSearch, page, unitId, valueFilter } = state;
      const res: any = {};
      let newValuSearch: any = {};

      if (!!editHead[name]) {
        for (let item in valueSearch) {
          if (item === name) continue;
          newValuSearch = { ...newValuSearch, [item]: valueSearch[item] };
        }
        const { data, success } = await User.get({
          pageSize: page.pageSize || 10,
          pageNumber: 0,
          relation: JSON.stringify(["role"]),
          where: {
            unitId: { value: [unitId], operation: "in" },
            ...valueFilter,
            ...newValuSearch,
          },
        });
        const user = _.get(data, "items") || [];
        res.rows = user.filter((i) => i.deletedBy == null);
        res.page = {
          count: Math.ceil(data?.count / data?.pageSize || 10),
          pageSize: data?.pageSize,
          page: data?.pageNumber,
        };
      }

      return {
        ...res,
        editHead: { ...editHead, [name]: !editHead[name] },
        valueSearch: !!editHead[name] ? newValuSearch : valueSearch,
      };
    },

    onSearch: async () => {
      const {
        data: { name, isClose },
        ele,
      } = action;
      const { valueSearch, page, valueFilter, unitId, editHead } = state;
      const newValuSearch = {
        ...valueSearch,
        [name]: { value: `%${ele?.target?.value || ""}%`, operation: "like" },
      };

      const res: any = {};
      const { data, success } = await User.get({
        pageSize: page.pageSize || 10,
        pageNumber: 0,
        relation: JSON.stringify(["role"]),
        where: {
          unitId: { value: [unitId], operation: "in" },
          ...valueFilter,
          ...newValuSearch,
        },
      });

      if (success) {
        const user = _.get(data, "items") || [];
        res.rows = user.filter((i) => i.deletedBy == null);
        res.page = {
          count: Math.ceil(data?.count / data?.pageSize || 10),
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

      return { ...res, valueSearch: newValuSearch };
    },

    reset: async () => {
      const { roles, genders, unitId } = state;

      dispatch("onLoading");
      const { success, data } = await User.get({
        pageSize: 10,
        pageNumber: 0,
        relation: JSON.stringify(["role"]),
        where: { unitId: { value: [unitId || ""], operation: "in" } },
      });

      const resData: any = {};
      if (success) {
        const user = _.get(data, "items") || [];
        resData.rows = user.filter((i) => i.deletedBy == null);
        resData.sorts = {};
        resData.valueFilter = {};
        resData.dataFilter = {};
        resData.valueSearch = "";
        resData.roles = roles.map((item: any) => ({
          ...item,
          isfilter: false,
        }));
        resData.genders = genders.map((item: any) => ({
          ...item,
          isfilter: false,
        }));

        resData.page = {
          count: Math.ceil(data?.count / data?.pageSize || 10),
          pageSize: data?.pageSize,
          page: data?.pageNumber,
        };
        enqueueSnackbar(translate("userManager.refreshSuccess"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }

      return { ...resData, loading: false, editHead: {} };
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
      const params = { ids: listId };

      dispatch("onLoading");
      const dataApi = await User.deletes(params);

      const res: any = {};
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
      const { row, rows } = state;

      dispatch("onLoading");
      const dataApi = await User.delete(row.id);

      const res: any = {};
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
      return {
        ...res,
        rows,
        confirm: { ...confirm, open: false },
        loading: false,
      };
    },

    statusUser: async () => {
      const {
        data: { item, rowIdx },
        ele,
      } = action;
      const { rows } = state;

      dispatch("onLoading");
      const dataApi = await User.put(item.id, {
        status: !ele.target.checked,
      });

      const resData: any = {};
      if (dataApi.data) {
        rows[rowIdx] = { ...item, status: ele.target.checked };
        enqueueSnackbar(translate("userManager.stattusSuccess"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }
      return { ...resData, rows, loading: false };
    },

    resetPass: async () => {
      const { data } = action;

      dispatch("onLoading");
      const dataApi = await User.put(data.id, {
        ...data,
        password: "12345678",
      });

      if (dataApi.data) {
        enqueueSnackbar(translate("userManager.changePassword"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }
      return { loading: false };
    },

    onChangeFilter: () => {
      const {
        data: { item, index, name },
        ele,
      } = action;
      const value = ele.target.checked;
      const { roles, genders, disables, dataFilter }: any = state;

      if (name === "roles") {
        roles[index] = { ...roles[index], isfilter: value };
        const values = roles
          .filter((item: any) => item.isfilter === true)
          .map((i: any) => i.id);
        dataFilter.role = { name: "role", value: values };
      }

      if (name === "genders") {
        genders[index] = { ...genders[index], isfilter: value };
        const values = genders
          .filter((item: any) => item.isfilter === true)
          .map((i: any) => i.id);
        dataFilter.gender = { name: "gender", value: values };
      }

      const items: any = Object.values(dataFilter).filter(
        (item: any) => item.value.length > 0
      );
      const valueFilter = {
        ...items.reduce((obj: any, item: any) => {
          obj[item.name] = { value: item.value, operation: "in" };
          return obj;
        }, {}),
      };

      return { roles, genders, disables, valueFilter };
    },

    onPaging: async () => {
      const { pageSize, pageNumber, data } = action;
      const { valueFilter, valueSearch, unitId } = state;
      let F: any = {};

      if (!_.isEmpty(valueFilter)) {
        F = { ...F, ...valueFilter };
      }

      if (!_.isEmpty(valueSearch)) {
        F = {
          ...F,
          name: {
            value: `%${valueSearch}%`,
            operation: "like",
          },
        };
      }

      dispatch("onLoading");
      const dataApi = await User.get({
        pageSize: pageSize,
        pageNumber: pageNumber || data?.pageNumber || 0,
        relation: JSON.stringify(["role"]),
        where: { ...F, unitId: { value: [unitId], operation: "in" } },
        // order: sorts
      });
      const restData: any = {};
      if (dataApi.success) {
        const user = _.get(dataApi, "data.items") || [];
        restData.rows = user.filter((i) => i.deletedBy == null);
        restData.page = {
          count: Math.ceil(dataApi?.data?.count / pageSize || 10),
          pageSize: dataApi?.data?.pageSize,
          page: dataApi?.data?.pageNumber,
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

    deliverImport: async () => {
      // const {
      //   data: { data },
      // } = action;
      const { unitId } = state;

      // if (data.severity === "error") {
      //   return;
      // }

      dispatch("onLoading");
      const dataApi = await User.get({
        pageSize: 10,
        pageNumber: 0,
        where: {
          unitId: { value: [unitId], operation: "in" },
        },
      });

      const resData: any = {};
      if (dataApi.success) {
        const user = _.get(dataApi, "data.items") || [];
        resData.rows = user.filter((i) => i.deletedBy == null);
        resData.page = {
          count: Math.ceil(dataApi?.data?.count / 10),
          pageSize: dataApi?.data?.pageSize,
          page: dataApi?.data?.pageNumber,
        };
        resData.fillter = {};
        resData.valueSearch = "";
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }

      return { ...resData, loading: false };
    },

    openDialog: () => {
      const { openKey }: any = state;
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
      if (name === "importFile") {
        openKey.type = "importFile";
      }

      return {
        ...res,
        openKey: {
          ...openKey,
          open: openKey.open + 1,
        },
      };
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

      if (type === "deleteAll") {
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

    onLoading: () => {
      return { loading: true };
    },
  };

  return cases[action.type] && cases[action.type]();
}
