import _ from "lodash";
import Preferential from "api/Preferential";
import Category from "api/Category";
import { unaccent } from "logic/recordsManagement/util";
import { get } from "src/hooks/useLocalStorage";

const checkDisable = (rows) => {
  const rowsCheck = rows.filter((i) => !!i.isCheck);

  return rows.map((item) => {
    if (!!item.isCheck) {
      return { ...item, isExist: false };
    } else {
      if (item.level === 3) {
        const rowL2 = rows.find((i) => i.id === item.parentId);
        const checkRowL3 = rowsCheck.find(
          (i) =>
            i.beneficiary === item.beneficiary && i.parentId === item.parentId
        );

        if (!!rowL2.isCheck) {
          return !checkRowL3
            ? { ...item, isExist: false }
            : { ...item, isExist: true };
        } else {
          const checkRowL2 = rowsCheck.find(
            (i) =>
              i.beneficiary === rowL2.beneficiary &&
              i.level < 3 &&
              i.id !== rowL2.id
          );

          if (!!checkRowL2) {
            return { ...item, isExist: true };
          } else {
            let checkL3 = false;

            const listRowL2 = rows.filter(
              (i) =>
                i.beneficiary === rowL2.beneficiary &&
                i.level < 3 &&
                i.id !== rowL2.id
            );

            for (let i = 0; i < listRowL2.length; i++) {
              const listRowL3 = rowsCheck.find((e) => {
                return e.parentId === listRowL2[i]?.id;
              });

              if (!_.isEmpty(listRowL3)) {
                checkL3 = true;
                break;
              }
            }

            if (checkL3) {
              return { ...item, isExist: true };
            }

            return !checkRowL3
              ? { ...item, isExist: false }
              : { ...item, isExist: true };
          }
        }
      } else {
        if (!!item.isCheck) {
          return { ...item, isExist: false };
        } else {
          const listRowL2 = rows.filter(
            (i) =>
              i.id !== item.id &&
              i.beneficiary === item.beneficiary &&
              i.level < 3
          );

          if (!listRowL2.every((i) => !i.isCheck)) {
            return { ...item, isExist: true };
          } else {
            let checkL3 = false;

            for (let i = 0; i < listRowL2.length; i++) {
              const listRowL3 = rowsCheck.filter(
                (e) => e.parentId === listRowL2[i]?.id
              );

              if (!_.isEmpty(listRowL3)) {
                checkL3 = true;
                break;
              }
            }

            return checkL3
              ? { ...item, isExist: true }
              : { ...item, isExist: false };
          }
        }
      }
    }
  });
};

const setParent = (arrays: any, beneficiary: number) => {
  const array = arrays.filter((i) =>
    (beneficiary === 0 ? [0, 2, 4] : [1, 3]).includes(i.beneficiary)
  );

  if (_.isEmpty(array)) return [];

  const level1 = (arrays || []).filter(
    (a) => !a.parentId && a.beneficiary !== 5
  );
  const tempArr = level1.reduce((temArray: any, item: any) => {
    const level2 = array
      .filter((l) => item.id === l.parentId)
      .map((m) => ({
        ...m,
        level: 2,
        displayNone: !item.show,
        show: !!item.show ? !!m.show : false,
      }));

    let level3: any = [];
    for (let i = 0; i < level2.length; i++) {
      const tempLevel3 = array
        .filter((l3) => level2[i]?.id === l3.parentId)
        .map((g) => ({
          ...g,
          isGrand: true,
          displayNone: !level2[i]?.show,
          level: 3,
        }));
      const itemL2 = tempLevel3.length > 0 ? { haveChild: true } : {};
      level3 = [
        ...level3,
        { ...level2[i], isChild: true, ...itemL2 },
        ...tempLevel3,
      ];
    }
    const itemL1 =
      level3.length > 0
        ? { ...item, isFather: true, level: 1 }
        : { ...item, level: 1 };

    const checkItemL1 = arrays.filter((i) => i.parentId === itemL1.id);

    return level3.length < 1 && checkItemL1.length > 0
      ? [...temArray]
      : [...temArray, itemL1, ...level3];
  }, []);

  return tempArr;
};

const setData = (array: any, arr: any) => {
  const tempArr: any = [];
  const setCheckArr = array.map((item: any) => {
    const checkItem = arr.find((i) => i.id === item.id);
    if (!_.isEmpty(checkItem)) {
      tempArr.push(checkItem);
    }
    return _.isEmpty(checkItem) ? item : { ...item, isCheck: true };
  });

  return checkDisable(setCheckArr);
};

export default function recordsReducer({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any) {
  const { data, deliverItem }: any = props;
  const { year, categoryKey, prefers, alreadyOnList } = data;
  const oldRowsCheck = _.cloneDeep(prefers);
  const infoDomain = get("infoDomain");

  const cases: any = {
    initial: async () => {
      const { subsidyForm }: any = props.data;

      const [categoriesData, categoriesForProvinceData] = await Promise.all([
        Category.get({
          where: { unitId: null, status: true },
          order: { index: "ASC" },
        }),
        Category.get({
          where: { unitId: _.get(infoDomain, "province.key"), status: true },
          order: { index: "ASC" },
        }),
      ]);

      const categoriesForProvince = _.get(
        categoriesForProvinceData,
        "data.items"
      );
      const categories = _.get(categoriesData, "data.items");
      const category =
        _.get(
          categories.find((item) => categoryKey === item.key),
          "id"
        ) || null;

      const { data, success } = await Preferential.get({
        where: {
          // beneficiary: { value: [0], operation: "in" },
          subsidyForm: { value: [1], operation: "in" },
          yearId: { value: [year?.id || ""], operation: "in" },
          categoryId: { value: [category], operation: "in" },
        },
        order: { name: "ASC" },
      });

      const res: any = {};
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.oldRows = (_.get(data, "items") || []).sort((a: any, b: any) => {
          if (+a.name.replace(/%/g, "") < +b.name.replace(/%/g, "")) return -1;
          else return 1;
        });
        const tem = _.cloneDeep(res.oldRows);
        res.rowsCheck = oldRowsCheck || [];
        res.rows = setData(setParent(tem, 0), res.rowsCheck);
      }

      return {
        open: true,
        ...res,
        subsidyForm: subsidyForm || 1,
        beneficiary: 0,
        categoriesForProvince,
        categories,
        category,
        loading: false,
      };
    },

    onSelect: async () => {
      const { name, value } = action;
      const { categoriesForProvince, subsidyForm, category, categories } =
        state;
      const res: any = {};
      const temp: any = {};

      if (name == "category") {
        res.category = value;

        const categorySelectKey = _.get(
          categories.find((item) => value === item.id),
          "key"
        );
        const categoryForProvince = categoriesForProvince.find(
          (item) => categorySelectKey === item.key
        );

        temp.categoryId = subsidyForm === 3 ? categoryForProvince?.id : value;

        const whereProvinId =
          subsidyForm === 3
            ? {
                provinceId: {
                  value: [_.get(infoDomain, "province.key")],
                  operation: "in",
                },
              }
            : {};
        temp.whereData = {
          subsidyForm: { value: [subsidyForm || 0], operation: "in" },
          ...whereProvinId,
        };
      }

      if (name == "subsidyForm") {
        res.subsidyForm = value;

        const categoryForProvince = categoriesForProvince.find(
          (item) => categoryKey === item.key
        );
        temp.categoryId = value === 3 ? categoryForProvince?.id : category;

        const whereProvinId =
          value === 3
            ? {
                provinceId: {
                  value: [_.get(infoDomain, "province.key")],
                  operation: "in",
                },
              }
            : {};

        temp.whereData = {
          subsidyForm: { value: [value], operation: "in" },
          ...whereProvinId,
        };
      }
      dispatch({ type: "loadPrefers", temp });
      return { ...res };
    },

    loadPrefers: async () => {
      const { temp } = action;
      const { beneficiary, rowsCheck } = state;
      const res: any = {};

      dispatch("onLoading");
      const { data, success } = await Preferential.get({
        where: {
          ...temp.whereData,
          yearId: { value: [year?.id || ""], operation: "in" },
          categoryId: { value: [temp.categoryId], operation: "in" },
        },
        order: { name: "ASC" },
      });

      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.oldRows = (_.get(data, "items") || []).sort((a: any, b: any) => {
          if (+a.name.replace(/%/g, "") < +b.name.replace(/%/g, "")) return -1;
          else return 1;
        });
        res.rows = setData(
          setParent(_.cloneDeep(res.oldRows) || [], beneficiary),
          rowsCheck
        );
      }

      return { ...res, loading: false };
    },

    selectBeneficiary: () => {
      const { e } = action;
      const { oldRows, rowsCheck } = state;
      dispatch("onLoading");

      const value = e.target.value;
      const rows = setData(setParent(oldRows, value), rowsCheck);

      return { rows, loading: false, beneficiary: value };
    },

    onSearch: () => {
      const { oldRows } = state;
      const { ele } = action;
      const value = ele?.target?.value;
      const rows = oldRows.filter((item: any) => {
        return unaccent(item?.name || "")
          .replace(/ /g, "")
          .includes(unaccent(value || "").replace(/ /g, ""));
      });

      return { rows };
    },

    show: () => {
      const {
        data: { rowIdx },
      } = action;
      const { rows, beneficiary } = state;
      rows[rowIdx].show = !rows[rowIdx].show;

      return { rows: setParent(rows, beneficiary) };
    },

    onChecked: () => {
      const {
        data: { rowIdx, item },
      } = action;
      const { rows, rowsCheck } = state;
      const res: any = {};
      rows[rowIdx] = { ...item, isCheck: !item.isCheck };

      const newRows: any = checkDisable(rows);

      const indxRowCheck = rowsCheck.findIndex((r) => item.id === r.id);
      if (indxRowCheck !== -1) {
        rowsCheck.splice(indxRowCheck, 1);
      } else {
        rowsCheck.push(rows[rowIdx]);
      }

      return { rows: newRows, rowsCheck };
    },

    deleteCheck: () => {
      const {
        data: { rowIdx, item },
      } = action;
      const { rows, rowsCheck } = state;
      if (alreadyOnList) {
        enqueueSnackbar(translate("recordsManagement.errUpdatePrefers"), {
          variant: "error",
        });
      } else {
        rowsCheck.splice(rowIdx, 1);
        const indxRows = rows.findIndex((r) => item.id === r.id);
        if (indxRows !== -1) {
          rows[indxRows] = { ...rows[indxRows], isCheck: false };
        }

        const newRows = checkDisable(rows);

        return { rows: newRows, rowsCheck };
      }
    },

    onSubmit: () => {
      const { rowsCheck } = state;
      deliverItem && deliverItem(rowsCheck);

      return { open: false };
    },

    setEditHead: () => {
      const { editHead, oldRows } = state;
      const res: any = {};
      if (!!editHead.name) {
        res.rows = oldRows;
      }

      return {
        ...res,
        editHead: { name: !editHead.name },
      };
    },

    closeDialog: () => ({ open: false, rowsCheck: oldRowsCheck || [] }),

    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
}
