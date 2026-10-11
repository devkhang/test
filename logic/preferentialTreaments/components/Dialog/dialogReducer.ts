import _ from "lodash";
import Preferential from "api/Preferential";
import { get } from "src/hooks/useLocalStorage";

const setData = (array: any) => {
  let ar: any = [];
  const listFather = (array || [])
    .filter((arr: any) => !arr.isGrand)
    .forEach((element: any) => {
      ar = [...ar, { ...element, displayNone: false }];
      const child = array.filter((e: any) => element.id === e.parentId);
      const grand = child.forEach((i: any) => {
        ar = [
          ...ar,
          { ...i, show: !!element.show, displayNone: !element.show },
        ];
      });
    });
  return ar;
};

const validate = (row: any) => {
  if (
    row.name === "" ||
    row?.categoryId === "" ||
    row?.categoryId == undefined
  ) {
    return true;
  }
  return false;
};

const dialogReducer = ({
  state,
  action,
  dispatch,
  props,
  enqueueSnackbar,
  translate,
}: any) => {
  const {
    data: { categories, row: rowProps, valueTab, year, oldRows },
    deliverItem,
  } = props;

  const infoDomain = get("infoDomain");

  const cases: any = {
    initial: async () => {
      const datas =
        valueTab === 1
          ? setData(
              oldRows.filter((x: any) => x.parentId === rowProps.id) || []
            ).reduce((arr: any, item: any) => {
              arr = [
                ...arr,
                item,
                ...oldRows
                  .filter((i: any) => item.id === i.parentId)
                  .map((j: any) => ({ ...j, isChildrent: true })),
              ];

              return arr;
            }, [])
          : setData(
              oldRows.filter((item: any) => item.parentId === rowProps.id)
            );

      const check = datas.length > 0;
      const isShow = datas.every((item: any) => !!item.display);
      const row = {
        ...rowProps,
        timesSubsidy: (rowProps.subsidy || 0) / (year?.unitPrice || 1),
        timesAllowance: (rowProps.allowance || 0) / (year?.unitPrice || 1),
      };

      return { open: true, row, datas, check, isShow };
    },

    onChange: () => {
      const { name, e } = action;
      const { row } = state;

      const value = e.target.value;
      row[name] = value;
      const res: any = {};
      if (name === "categoryId") {
        res.category = categories.find((item: any) => item.id === value);
        if (["AQ", "BB"].includes(res.category?.key)) {
          row.other = row.name;
        }
      }

      if (name === "status") {
        const value = e.target.checked;
        row[name] = value;
      }

      if (name === "timesSubsidy") {
        row.subsidy = value * (year?.unitPrice || 1);
      }

      if (name === "timesAllowance") {
        row.allowance = value * (year?.unitPrice || 1);
      }

      if (name === "18-") {
        row.other = row?.subsidy || null;
      }

      return { row, ...res };
    },

    onChangeChild: () => {
      const {
        data: { name, rowIdx },
        ele,
      } = action;
      const { datas } = state;
      const value = ele.target.value;
      datas[rowIdx][name] = value;

      return { datas };
    },

    onChecked: async () => {
      const { row, check } = state;

      const { name } = action;
      const res: any = {};
      res.check = !check;

      if (!check && !row.id) {
        const error = validate(row);

        if (error) {
          enqueueSnackbar(translate("common.validateError"), {
            variant: "error",
          });
          return;
        } else {
          const { data, success }: any = await Preferential.post({
            ...row,
            subsidyForm: valueTab,
            yearId: year.id,
            provinceId: _.get(infoDomain, "province.key"),
            subsidy: name === "add" ? row.subsidy : null,
            allowance: name === "add" ? row.allowance : null,
          });

          if (!success) {
            enqueueSnackbar(translate("common.errorMes"), {
              variant: "error",
            });
            return;
          } else {
            res.row = {
              ...row,
              id: data.id,
              timesSubsidy: null,
              timesAllowance: null,
              subsidy: null,
              allowance: null,
            };
          }
        }
      } else {
        res.row = {
          ...row,
          timesSubsidy: null,
          timesAllowance: null,
          subsidy: null,
          allowance: null,
        };
      }

      return { ...res };
    },

    onSubmit: async () => {
      const { row } = state;
      const res: any = {};

      const { data, success } = !!row.id
        ? await Preferential.put(row.id, row)
        : await Preferential.post({
            ...row,
            provinceId: _.get(infoDomain, "province.key"),
            subsidyForm: valueTab,
            yearId: year.id,
          });

      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        deliverItem && deliverItem();
        res.open = false;
      }

      return { ...res };
    },

    add: () => {
      const {
        data: { name, rowIdx, item },
      } = action;
      const { datas, row } = state;

      if (name === "addNew") {
        const newItem = { isFather: true, isEdit: true, parentId: row.id };
        return { datas: [newItem, ...datas] };
      }
      if (name === "addChild") {
        const newItem = { parentId: item.id, isEdit: true };
        datas.splice(rowIdx + 1, 0, newItem);
        return { datas };
      }
    },

    setEdit: () => {
      const {
        data: { rowIdx },
      } = action;
      const { datas }: any = state;

      if (!datas[rowIdx].id && !!datas[rowIdx].isEdit) {
        datas.splice(rowIdx, 1);
      } else {
        datas[rowIdx].isEdit = !datas[rowIdx].isEdit;
        if (!!datas[rowIdx].id && !datas[rowIdx].isEdit) {
          datas[rowIdx] = _.cloneDeep(
            datas.find((item: any) => datas[rowIdx].id === item.id)
          );
        }
      }

      return { datas };
    },

    save: async () => {
      const { datas, row } = state;
      const {
        data: { rowIdx },
      } = action;
      const params = {
        ...datas[rowIdx],
        provinceId: _.get(infoDomain, "province.key"),
        subsidyForm: valueTab,
        yearId: year.id,
      };

      const { data, success }: any = await Preferential.post(params);

      const res: any = {};
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        datas[rowIdx] = data;
      }

      return { datas };
    },

    show: () => {
      const {
        data: { rowIdx },
      } = action;
      const { datas } = state;

      datas[rowIdx].show = !datas[rowIdx].show;

      return { datas: setData(datas) };
    },

    onShow: async () => {
      const { datas } = state;
      const { e } = action;
      const value = e.target.value;
      const ids = datas.map((item: any) => item.id);

      const { data, success } = await Preferential.showData({ ids: ids });

      const res: any = {};
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.datas = datas.map((item: any) => ({ ...item, display: true }));
      }

      return { ...res, isShow: !state.isShow };
    },

    delete: async () => {
      const { row, datas, confirm } = state;

      const { data, success } = await Preferential.delete(row.id);

      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        enqueueSnackbar(translate("common.deleteMes"), {
          variant: "success",
        });
        const rowIdx = datas.findIndex((i: any) => i.id === row.id);
        datas.splice(rowIdx, 1);
      }

      return { datas, confirm: { ...confirm, open: false } };
    },

    closeDialog: () => ({
      open: false,
    }),

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

    closeConfirm: () => ({ confirm: { ...state.confirm, open: false } }),
  };
  return cases[action.type] && cases[action.type]();
};

export default dialogReducer;
