import _ from "lodash";
import Year from "api/Year";
import Form from "api/Form";
import Upload from "api/Upload";
import { get } from "src/hooks/useLocalStorage";
import { type } from "./utils";
import { AwsService } from "services/aws/aws.service";

const validate = (data) => {
  if (_.isEmpty(data.name) || _.isEmpty(data.file)) {
    return true;
  }
  return false;
};

const formManagerReducer = ({ state, action, dispatch, orther }: any) => {
  const { enqueueSnackbar, translate } = orther;
  const infoDomain = get("infoDomain");

  const MoetId = !infoDomain?.parentId ? infoDomain.id : infoDomain.parentId;

  const cases: any = {
    initial: async () => {
      const res: any = {};
      const dataYear = await Year.get({
        where: { status: true },
        order: { year: "DESC" },
      });
      if (!!dataYear.success) {
        res.years = _.get(dataYear, "data.items");
        res.year = res.years[0] || {};
        const dataForm = await Form.get({
          where: {
            yearId: res.year.id,
            doet_id: MoetId,
          },
        });
        res.rows = _.get(dataForm, "data.items") || [];
        res.oldRows = _.cloneDeep(res.rows);
      }

      const typeFilter = type.map((item: any) => ({
        name: item,
        isfilter: false,
      }));
      const user = get("user");
      res.workUnit = user?.workUnit || "";

      return { loading: false, ...res, typeFilter };
    },

    onChange: () => {
      const {
        data: { name, rowIdx },
        ele,
      } = action;
      const { rows } = state;

      const value = ele?.target?.value;
      rows[rowIdx][name] = value;

      if (name === "publishDate") {
        rows[rowIdx][name] = ele;
      }
      if (name === "file") {
        const file = ele?.target?.files;
        rows[rowIdx].file = file;
      }

      return { rows };
    },

    addNew: () => {
      const { rows, year } = state;
      const newItem = { isEdit: true, yearId: year.id };

      return { rows: [newItem, ...rows] };
    },

    save: async () => {
      const {
        data: { item, rowIdx },
      } = action;
      const { rows } = state;

      const error = validate(item);
      if (!!error) {
        enqueueSnackbar(translate("formManager.notEnoughError"), {
          variant: "error",
        });
        return;
      }

      const uploadApi = !item?.file[0]?.size
        ? {}
        : await AwsService.upload(item?.file[0]);

      item.file = !!uploadApi
        ? [
            {
              name: item?.file[0]?.name,
              url: _.get(uploadApi, "cdn"),
            },
          ]
        : item.file;

      const dataApi = !!item.id
        ? await Form.put(item.id, item)
        : await Form.post(item);
      if (!dataApi) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        if (uploadApi) {
          rows[rowIdx].file = [
            {
              name: item?.file[0]?.name,
              url: _.get(uploadApi, "cdn"),
            },
          ];
        }

        rows[rowIdx] = !item.id
          ? _.get(dataApi, "data")
          : { ...item, isEdit: false };
      }
      return { rows };
    },

    setEdit: () => {
      const {
        data: { item, rowIdx },
      } = action;
      const { rows, oldRows } = state;

      if (!!item.isEdit && !item.id) {
        rows.splice(rowIdx, 1);
      } else {
        if (!item.isEdit && !!item.id) {
          rows[rowIdx] = { ...item, isEdit: !item.isEdit };
        }
        if (!!item.isEdit && !!item.id) {
          rows[rowIdx] = oldRows.find((i) => i.id === item.id);
        }
      }

      return { rows };
    },

    setEditShowInput: () => ({ showInput: !state.showInput }),

    refresh: async () => {
      const { typeFilter, year } = state;
      const res: any = {};
      const newState = {
        checkAll: false,
        valueSearch: {},
        anchorEl: {
          type: null,
        },
        showInput: false,
      };
      res.typeFilter = typeFilter.map((i) => ({ ...i, isfilter: false }));
      dispatch("onLoading");
      const dataForm = await Form.get({
        where: {
          yearId: year.id,
          doet_id: MoetId,
        },
      });
      res.rows = _.get(dataForm, "data.items") || [];
      res.oldRows = _.cloneDeep(res.rows);
      return { ...newState, ...res, loading: false };
    },

    onSelectYear: async () => {
      dispatch("onLoading");
      const { e } = action;
      const { typeFilter } = state;
      const year = e.target?.value;

      const res: any = {};
      const dataApi = await Form.get({
        where: {
          yearId: year.id,
          doet_id: MoetId,
        },
      });

      if (!dataApi.success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      } else {
        res.rows = _.get(dataApi, "data.items");
        res.typeFilter = (typeFilter || []).map((item) => ({
          ...item,
          isfilter: false,
        }));
      }

      return { year, ...res, loading: false, showInput: false };
    },

    onSearch: async () => {
      const { e } = action;
      const { typeFilter, year } = state;
      const valueSearch = e?.target?.value;
      dispatch("onLoading");

      const params: any = [];
      typeFilter.forEach((item, index) => {
        !!item.isfilter && params.push(index);
      });

      const S = _.isEmpty(valueSearch)
        ? {}
        : { name: { value: `%${valueSearch}%`, operation: "like" } };
      const F =
        params.length > 0
          ? { type: { value: [...params], operation: "in" } }
          : {};

      const res: any = {};
      const dataApi = await Form.get({
        where: {
          ...F,
          ...S,
          yearId: year.id,
          doet_id: MoetId,
        },
      });

      if (!dataApi.success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.rows = _.get(dataApi, "data.items");
      }

      return { ...res, loading: false };
    },

    onCheck: () => {
      const {
        data: { name, rowIdx, item },
      } = action;
      const { checkAll, rows } = state;
      const res: any = {};

      if (name === "checkAll") {
        rows.forEach((element, index) => {
          rows[index] = { ...element, isCheck: !checkAll };
        });
      } else {
        rows[rowIdx] = { ...item, isCheck: !item.isCheck };
      }

      res.checkAll = rows.every((item) => !!item.isCheck);
      const listId = rows.filter((item) => !!item.isCheck).map((i) => i.id);

      return { ...res, listId };
    },

    onCheckFilter: () => {
      const {
        data: { item, index },
      } = action;
      const { typeFilter } = state;
      typeFilter[index] = { ...item, isfilter: !item.isfilter };

      return { typeFilter };
    },

    onFilter: async () => {
      dispatch("onLoading");
      const { typeFilter, anchorEl, year } = state;

      const params: any = [];
      typeFilter.forEach((item, index) => {
        !!item.isfilter && params.push(index);
      });

      const F =
        params.length > 0
          ? { type: { value: [...params], operation: "in" } }
          : {};

      const res: any = {};
      const dataApi = await Form.get({
        where: {
          ...F,
          yearId: year.id,
          doet_id: MoetId,
        },
      });

      if (!dataApi.success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.rows = _.get(dataApi, "data.items");
      }

      return {
        loading: false,
        ...res,
        anchorEl: { ...anchorEl, type: null },
        showInput: false,
        checkAll: false,
      };
    },

    openLink: () => {
      const {
        data: { item },
      } = action;

      window.open(`${item?.file[0]?.url}`, "_blank");
    },

    delete: async () => {
      const { row, rows, confirm } = state;

      dispatch("onLoading");
      const dataApi = await Form.delete(row.id);

      if (!dataApi.success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        const index = rows.findIndex((item) => item.id === row.id);
        rows.splice(index, 1);
        enqueueSnackbar(translate("common.deleteMes"), {
          variant: "success",
        });
      }

      return { rows, loading: false, confirm: { ...confirm, open: false } };
    },

    deleteAll: async () => {
      const { listId, rows, confirm } = state;

      dispatch("onLoading");
      const dataApi = await Form.deletes({ ids: listId });
      const res: any = {};

      if (!dataApi.success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.rows = rows.filter((item) => !listId.includes(item.id));
      }

      return { ...res, loading: false, confirm: { ...confirm, open: false } };
    },

    openPopver: () => {
      const { ele } = action;
      const { anchorEl }: any = state;
      return {
        anchorEl: {
          ...anchorEl,
          type: ele.currentTarget,
        },
      };
    },

    closePopver: () => {
      const { anchorEl } = state;
      return { anchorEl: { ...anchorEl, type: null } };
    },

    openConfirm: () => {
      const { data } = action;
      const { listId } = state;

      const res: any = {};
      if (!listId) {
        enqueueSnackbar(translate("formManager.notFound"), {
          variant: "warning",
        });
        return;
      }

      if (data.name === "delete") {
        res.row = data.item;
      }

      return {
        ...res,
        confirm: {
          open: true,
          type: data.name,
          content: translate("preferentialTreament.contentDelete"),
        },
      };
    },

    closeConfirm: () => ({ confirm: { ...state.confirm, open: false } }),

    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
};

export default formManagerReducer;
