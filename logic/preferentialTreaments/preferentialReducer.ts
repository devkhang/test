import _ from "lodash";
import Preferential from "api/Preferential";
import Category from "api/Category";
import { unaccent } from "logic/recordsManagement/util";
import { get } from "src/hooks/useLocalStorage";

const renderSearch = (array1: any, array2: any) => {
  let arr: any = [];
  for (let i = 0; i < array2.length; i++) {
    const level1 = !array2[i].parentId
      ? array2[i]
      : !array1.find((l1: any) => l1.id === array2[i].parentId)?.parentId
      ? array1.find((l1: any) => l1.id === array2[i].parentId)
      : array1.find(
          (l1: any) =>
            l1.id ===
            array1.find((l1: any) => l1.id === array2[i].parentId).parentId
        );
    const checkItem = arr.find((c: any) => c.id === level1.id);

    if (!!checkItem) continue;
    arr = [...arr, level1];
    const child = array1.filter((e: any) => level1.id === e.parentId);
    child.forEach((i: any) => {
      const listGrand = array1
        .filter((a: any) => i.id === a.parentId)
        .map((a: any) => ({
          ...a,
          show: !!level1.show,
          displayNone: !level1.show,
          isGrand: true,
        }));
      arr = [
        ...arr,
        { ...i, show: !!level1.show, displayNone: !level1.show },
        ...listGrand,
      ];
    });
  }

  return arr;
};

const setData = (array: any) => {
  let ar: any = [];
  const listFather = (array || [])
    .filter((arr: any) => !arr.parentId)
    .forEach((element: any) => {
      ar = [...ar, element];
      const child = array.filter((e: any) => element.id === e.parentId);
      const grand = child.forEach((i: any) => {
        const listGrand = array
          .filter((a: any) => i.id === a.parentId)
          .map((a: any) => ({
            ...a,
            show: !!element.show,
            displayNone: !element.show,
            isGrand: true,
          }));
        ar = [
          ...ar,
          { ...i, show: !!element.show, displayNone: !element.show },
          ...listGrand,
        ];
      });
    });
  return ar;
};

const preferentialReducer = ({ state, action, dispatch, orther }: any) => {
  const { enqueueSnackbar, translate } = orther;
  const infoDomain = get("infoDomain");

  const cases: any = {
    initial: async () => {
      const { data, success } = await Category.get({
        where: {
          unitId: null,
          status: { value: [true], operation: "in" },
        },
        order: { index: "ASC" },
      });

      const categories = [..._.get(data, "items", [])];
      return { categories, loading: false };
    },

    deliverItem: async () => {
      const { valueTab, year, category } = state;
      const W = _.isEmpty(category?.id)
        ? {}
        : { categoryId: { value: [category?.id], operation: "in" } };

      const whereProvinId =
        valueTab === 3
          ? {
              provinceId: {
                value: [_.get(infoDomain, "province.key")],
                operation: "in",
              },
            }
          : {};

      dispatch("onLoading");
      const { data: dataAPi, success } = await Preferential.get({
        where: {
          subsidyForm: { value: [valueTab], operation: "in" },
          yearId: { value: [year.id], operation: "in" },
          ...W,
          ...whereProvinId,
        },
        order: { name: "ASC" },
      });

      const res: any = {};

      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.oldRows = setData(
          (_.get(dataAPi, "items") || []).sort((a: any, b: any) => {
            if (+a.name.replace(/%/g, "") < +b.name.replace(/%/g, ""))
              return -1;
            else return 1;
          })
        );
        res.rows = setData(
          (_.cloneDeep(res.oldRows) || []).filter((item: any) => !item.display)
        );
      }

      return { ...res, loading: false };
    },

    onChangeYear: async () => {
      const { valueTab, category } = state;
      const { data } = action;
      const res: any = {};
      const W = _.isEmpty(category?.id)
        ? {}
        : { categoryId: { value: [category?.id], operation: "in" } };

      const Y = !!data?.id
        ? { yearId: { value: [data?.id], operation: "in" } }
        : {};

      const whereProvinId =
        valueTab === 3
          ? {
              provinceId: {
                value: [_.get(infoDomain, "province.key")],
                operation: "in",
              },
            }
          : {};

      dispatch("onLoading");
      const { data: dataAPi, success } = await Preferential.get({
        where: {
          subsidyForm: { value: [valueTab], operation: "in" },
          ...whereProvinId,
          ...Y,
          ...W,
        },
        order: { name: "ASC" },
      });

      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.oldRows = setData(
          (_.get(dataAPi, "items") || []).sort((a: any, b: any) => {
            if (+a.name.replace(/%/g, "") < +b.name.replace(/%/g, ""))
              return -1;
            else return 1;
          })
        );
        res.rows = setData(
          (_.cloneDeep(res.oldRows) || []).filter((item: any) => !item.display)
        );
      }

      return { ...res, loading: false, year: data };
    },

    onChangeCategory: async () => {
      const { valueTab, year } = state;
      const { data } = action;
      const res: any = {};
      const W = !!data?.id
        ? { categoryId: { value: [data?.id], operation: "in" } }
        : {};

      const whereProvinId =
        valueTab === 3
          ? {
              provinceId: {
                value: [_.get(infoDomain, "province.key")],
                operation: "in",
              },
            }
          : {};
      dispatch("onLoading");
      const { data: dataAPi, success } = await Preferential.get({
        where: {
          subsidyForm: { value: [valueTab], operation: "in" },
          yearId: { value: [year?.id], operation: "in" },
          ...W,
          ...whereProvinId,
        },
        order: { name: "ASC" },
      });

      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.oldRows = setData(
          (_.get(dataAPi, "items") || []).sort((a: any, b: any) => {
            if (+a.name.replace(/%/g, "") < +b.name.replace(/%/g, ""))
              return -1;
            else return 1;
          })
        );
        res.rows = setData(
          (_.cloneDeep(res.oldRows) || []).filter((item: any) => !item.display)
        );
      }

      return { ...res, loading: false, category: data };
    },

    onClickTab: async () => {
      const { item } = action;
      const { year, category, categories } = state;
      const W =
        !!category?.id && item.id !== 3
          ? { categoryId: { value: [category?.id], operation: "in" } }
          : {};

      const whereProvinId =
        item.id === 3
          ? {
              provinceId: {
                value: [_.get(infoDomain, "province.key")],
                operation: "in",
              },
            }
          : {};

      const res: any = {};

      if (item.id === 3) {
        const dataApi = await Category.get({
          where: { unitId: _.get(infoDomain, "province.key") },
        });

        res.categories = _.get(dataApi, "data.items");
        res.category = {};
      }

      dispatch("onLoading");
      const { data, success } = await Preferential.get({
        where: {
          subsidyForm: { value: [item?.id], operation: "in" },
          yearId: { value: [year?.id], operation: "in" },
          ...W,
          ...whereProvinId,
        },
        order: { name: "ASC" },
      });

      if (!success) {
        res.rows = [];
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.oldRows = setData(
          (_.get(data, "items") || []).sort((a: any, b: any) => {
            if (+a.name.replace(/%/g, "") < +b.name.replace(/%/g, ""))
              return -1;
            else return 1;
          })
        );
        res.rows = setData(
          (_.cloneDeep(res.oldRows) || []).filter((item: any) => !item.display)
        );
      }

      return { ...res, loading: false, valueTab: item.id };
    },

    add: () => {
      const {
        data: { name, rowIdx, item },
      } = action;
      const { rows } = state;

      if (name === "addNew") {
        const newItem = { isFather: true, isEdit: true };
        return { rows: [newItem, ...rows] };
      }
      if (name === "addChild") {
        const newItem = { parentId: item.id, isEdit: true, show: true };
        rows.splice(rowIdx + 1, 0, newItem);
        return { rows };
      }
    },

    setEdit: () => {
      const {
        data: { rowIdx },
      } = action;
      const { rows, oldRows }: any = state;

      if (!rows[rowIdx].id && !!rows[rowIdx].isEdit) {
        rows.splice(rowIdx, 1);
      } else {
        rows[rowIdx].isEdit = !rows[rowIdx].isEdit;
        if (!!rows[rowIdx].id && !rows[rowIdx].isEdit) {
          rows[rowIdx] = _.cloneDeep(
            oldRows.find((item: any) => rows[rowIdx].id === item.id)
          );
        }
      }

      return { rows };
    },

    show: () => {
      const {
        data: { rowIdx },
      } = action;
      const { rows } = state;

      rows[rowIdx].show = !rows[rowIdx].show;

      return { rows: setData(rows) };
    },

    onChange: async () => {
      const { rows } = state;
      const {
        data: { rowIdx, name, item },
        ele,
      } = action;
      const value = ele.target.value;

      rows[rowIdx][name] = value;

      if (name === "status") {
        const check = ele.target.checked;

        const dataAPi = !!item.isEdit
          ? {}
          : await Preferential.put(item.id, { ...item, status: check });

        if (!item.isEdit && !dataAPi.success) {
          enqueueSnackbar(translate("common.errorMes"), {
            variant: "error",
          });
        }
        if (!item.isEdit && !!dataAPi.success) {
          enqueueSnackbar(translate("common.updateMes"), {
            variant: "success",
          });
        }

        rows[rowIdx][name] = check;
      }

      return { rows };
    },

    save: async () => {
      const {
        data: { item, rowIdx },
      } = action;
      const { rows } = state;

      dispatch("onLoading");

      const { data, success } = !!item.id
        ? await Preferential.put(item.id, item)
        : await Preferential.post(item);

      const res: any = {};
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        rows[rowIdx] = !!item.id
          ? { ...item, isEdit: false }
          : { ...data, show: true };

        res.rows = setData(rows);
        enqueueSnackbar(translate("common.addMes"), {
          variant: "succsess",
        });
      }

      return { ...res, loading: false };
    },

    delete: async () => {
      const { row, rows } = state;
      dispatch("onLoading");

      const index = rows.findIndex((i: any) => i.id === row.id);
      let listId: any = [];

      if (!row.parentId) {
        const listChild = rows
          .filter((item: any) => item.parentId === row.id)
          .map((item: any) => item.id);
        listId = [row.id, ...listChild];
      } else {
        listId = [row.id];
      }

      const { success } = await Preferential.deletes({ ids: [...listId] });

      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        rows.splice(index, listId.length);
        enqueueSnackbar(translate("common.deleteMes"), {
          variant: "success",
        });
      }

      return {
        confirm: { ...state.confirm, open: false },
        rows,
        loading: false,
      };
    },

    openDialog: () => {
      const { data, name } = action;
      const { openKey } = state;
      const res: any = {};

      if (data.name === "addNew") {
        res.row = {};
        res.openKey = { open: openKey.open + 1, type: "addNew" };
      }
      if (data.name === "update") {
        res.row = data.item;
        res.openKey = { open: openKey.open + 1, type: "update" };
      }

      return { ...res };
    },

    openConfirm: () => {
      const {
        data: { item },
      } = action;
      return {
        row: item,
        confirm: {
          open: true,
          content: translate("preferentialTreament.contentDelete"),
        },
      };
    },

    setEditHead: async () => {
      const { editHead } = state;
      return {
        editHead: { name: !editHead.name },
      };
    },

    onSearch: () => {
      const { oldRows } = state;
      const { ele } = action;
      const value = ele.target.value;

      const rowSearch = oldRows.filter((item: any) =>
        unaccent(item?.name)
          .replace(/ /g, "")
          .includes(unaccent(value).replace(/ /g, ""))
      );
      const newRows = setData(renderSearch(oldRows, rowSearch));

      return { rows: newRows };
    },

    closeConfirm: () => ({ confirm: { ...state.confirm, open: false } }),

    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
};

export default preferentialReducer;
