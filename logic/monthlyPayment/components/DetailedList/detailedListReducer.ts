import _, { forEach } from "lodash";
import moment from "moment";
import List from "api/List";
import Profile from "api/Profile";
import { ListPaid, convertCurrency, renderRows } from "../utils";

const setCheckedData = (listApi: any, checkedList: any) => {
  const data = (listApi || []).map((item: any) => {
    const checkItem = (checkedList || []).find(
      (i) => item.id === i.id && i.prefers === item.prefers
    );
    return _.isEmpty(checkItem) ? item : { ...item, isCheck: true };
  });
  return data;
};

const setDataPrefers = (dataProfiles) => {
  const dataPrefers: any = [];
  if (!_.isEmpty(dataProfiles)) {
    dataProfiles.forEach((item) => {
      const profile = item.profiles;

      profile.prefers?.forEach((prefer) => {
        //if (prefer.paid !== null)
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

const setDataProfiles = (rowsChecked) => {
  let profileArr: any = [];
  rowsChecked.forEach((row) => {
    const filterArr = profileArr.filter((p) => row.id === p.id);

    if (filterArr.length > 0) {
      const preferIds = filterArr.map((n) => n.prefers).flat();
      const filterIds = filterArr.map((n) => n.id);
      const newArr = profileArr.filter((pa) => !filterIds.includes(pa.id));

      profileArr = [
        ...newArr,
        {
          id: row.id,
          prefers: [...preferIds, row.prefersId],
        },
      ];
    } else profileArr.push({ id: row.id, prefers: [row.prefersId] });
  });

  return profileArr;
};

const detailedListReducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any) => {
  const { form, province, district, ward, listId, doet, lastMonthItem } = props;

  const doetFilter = !doet.parentId
    ? { doet_id: doet.id }
    : { unitId: doet.id };

  const districtParams = district?.key === "0" ? {} : { district };
  const wardParams = ward?.key === "0" ? {} : { ward };

  const newState = {
    rows: [],
    oldRows: [],
    prefers: [],
    oldPrefers: [],
    rowsChecked: [],
    typeCategory: "All",
    checkAll: false,
  };

  const cases: any = {
    initial: async () => {
      const res: any = {};
      if (!!listId) {
        dispatch("onLoading");

        if (!!lastMonthItem) {
          const dataProfiles = _.get(lastMonthItem, "profile") || [];
          const dataPrefers = dataProfiles.map((p) => ({
            ...p,
            paid: ListPaid.Added,
          }));

          res.rows = renderRows(dataPrefers);
          res.oldRows = _.cloneDeep(res.rows);

          res.rowsChecked = dataPrefers;
          res.oldRowsChecked = _.cloneDeep(res.rowsChecked);
          res.total = convertCurrency(lastMonthItem.total);

          const profiles = setDataProfiles(dataPrefers);

          const { success } = await List.put(listId, {
            profiles,
            profile: dataPrefers,
            total: lastMonthItem.total,
            categoryId: lastMonthItem.categoryId,
          });
        } else dispatch("reloadLists");
      }
      return { ...newState, ...res, loading: false };
    },

    selectUnit: async () => {
      const { rowsChecked, page } = state;
      const { value } = action;
      const res: any = {};

      res.typeCategory = value;
      const categoryId =
        value === "All"
          ? {}
          : {
              categoryId: { value: [value], operation: "in" },
            };

      dispatch("onLoading");
      const { data, success } = await Profile.get({
        where: {
          ...categoryId,
          ...doetFilter,
          province,
          ...districtParams,
          ...wardParams,
        },
      });

      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
        return { loading: false };
      }
      const profiles = _.get(data, "items") || [];
      const ids = profiles.map((i) => i.id);

      const dataList = await List.addProfiles(listId, { ids }, form);
      const listApi = _.get(dataList, "data", []);

      res.oldPrefers = setCheckedData(listApi, rowsChecked);
      res.prefers = _.cloneDeep(res.oldPrefers);
      res.checkAll = _.isEmpty(res.prefers)
        ? false
        : res.prefers.every((i: any) => !!i.isCheck);

      // dispatch({
      //   type: "onPaging",
      //   pageNumber: page.page,
      //   pageSize: page.pageSize,
      //   filter: prefers,
      // });

      return { ...res, loading: false };
    },

    onCheck: () => {
      const {
        data: { item, rowIdx, name },
        ele,
      } = action;
      const { prefers, rowsChecked } = state;

      const res: any = {};
      const value = ele.target.checked;

      if (name === "checkAll") {
        for (let i = 0; i < prefers.length; i++) {
          prefers[i] = {
            ...prefers[i],
            isCheck: value,
            paid: ListPaid.Added,
          };
        }
        res.checkAll = value;
        res.rowsChecked = value ? _.cloneDeep(prefers) : [];
      } else {
        prefers[rowIdx] = { ...item, isCheck: value, paid: ListPaid.Added };
        res.checkAll = prefers.every((item: any) => !!item.isCheck);

        const indxRowCheck = (rowsChecked || []).findIndex(
          (r) => item?.id == r.id && item?.prefers == r.prefers
        );

        indxRowCheck !== -1
          ? rowsChecked.splice(indxRowCheck, 1)
          : rowsChecked.push({ ...item, paid: ListPaid.Added });
      }
      return { prefers, rowsChecked, ...res };
    },

    reloadLists: async () => {
      const res: any = {};
      dispatch("onLoading");
      dispatch("refreshFilter");
      const listResponse = await List.getDetail(listId, {
        relation: `["listProfiles","listProfiles.profiles"]`,
        where: "prefers",
      });

      if (!listResponse.success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      } else {
        const dataProfiles = _.get(listResponse, "data.listProfiles") || [];
        const dataPrefers = setDataPrefers(dataProfiles);

        res.rows = renderRows(dataPrefers);
        res.oldRows = _.cloneDeep(res.rows);

        res.rowsChecked = dataPrefers;
        res.oldRowsChecked = _.cloneDeep(res.rowsChecked);

        const totalMoney = _.get(listResponse, "data.total");
        res.total = convertCurrency(totalMoney);
      }
      return { ...newState, ...res, loading: false };
    },

    save: async () => {
      const { rowsChecked, typeCategory } = state;
      const total = rowsChecked.reduce(
        (total, i) => total + +i.subsidy + +i.allowance,
        0
      );

      const checkIds = rowsChecked.map((i) => i.categoryId);
      const checkSameId = checkIds.every(
        (id) => id === rowsChecked[0].categoryId
      );

      const categoryId =
        typeCategory === "All" || !checkSameId ? null : typeCategory;
      const profiles = setDataProfiles(rowsChecked);

      dispatch("onLoading");

      const { success } = await List.put(listId, {
        profiles,
        profile: rowsChecked,
        total,
        categoryId,
      });

      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        enqueueSnackbar(translate("common.loadSuccess"), {
          variant: "success",
        });
        dispatch("reloadLists");
      }
      return { show: false, loading: false };
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
        data: { name, renderRows },
      } = action;
      const { editHead, valueSearch } = state;
      valueSearch[name] = !editHead[renderRows][name] ? valueSearch[name] : "";
      !!editHead[renderRows][name] &&
        dispatch({ type: "onSearch", data: { name, renderRows } });
      editHead[renderRows][name] = !editHead[renderRows][name];
      return { editHead, valueSearch };
    },

    onSearch: async () => {
      const {
        data: { name, renderRows },
        ele,
      } = action;
      const { valueSearch, oldRows, oldPrefers } = state;
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
      const rowsFilter = (
        renderRows === "prefers" ? oldPrefers : oldRows
      ).filter(
        (i) =>
          (i.name || "")
            .toLowerCase()
            .includes((whereSearch.name || "").toLowerCase()) &&
          (i.prefers || "")
            .toLowerCase()
            .includes((whereSearch.prefers || "").toLowerCase()) &&
          (i.dateOfBirth || "")
            .toLowerCase()
            .includes((whereSearch.dateOfBirth || "").toLowerCase())
      );
      return { [renderRows]: rowsFilter, whereSearch };
    },

    onChangeFilter: () => {
      const {
        data: { index, name },
        ele,
      } = action;
      const { genders } = state;
      const dataFilter: any = state.dataFilter || {};
      const value = ele.target.checked;
      if (name === "genders") {
        genders[index] = { ...genders[index], isfilter: value };
        const values = genders
          .filter((item: any) => item.isfilter === true)
          .map((i: any) => i.id);
        dataFilter.genders = { name: "genders", value: values };
      }

      const items: any = Object.values(dataFilter).filter(
        (item: any) => item.value.length > 0
      );

      const valueFilter = {
        ...items.reduce((obj: any, item: any) => {
          obj[item.name] = item.value;
          return obj;
        }, {}),
      };

      return { genders, valueFilter, dataFilter };
    },

    filter: async () => {
      const { renderRows } = action.data;
      const { valueFilter, oldRows, oldPrefers } = state;
      const newRows = !_.isEmpty(valueFilter.genders)
        ? (renderRows === "prefers" ? oldPrefers : oldRows).filter((i) =>
            (valueFilter.genders || []).includes(i.gender)
          )
        : oldRows;
      return { [renderRows]: newRows };
    },

    refreshFilter: () => {
      const { genders } = state;
      const newGenders = genders.map((i) => ({ ...i, isfilter: false }));
      const newObj = {
        editHead: { rows: {}, prefers: {} },
        valueSearch: {},
        valueFilter: {},
        dataFilter: {},
        whereSearch: {},
      };
      return { ...newObj, genders: newGenders };
    },

    onPaging: () => {
      const { pageNumber, pageSize, filter } = action;
      const { oldPrefers } = state;
      const arr = filter ? filter : oldPrefers;
      const newArr =
        pageSize === null
          ? arr
          : arr.slice(pageSize * pageNumber, pageSize * (pageNumber + 1));
      return {
        prefers: newArr,
        page: {
          count: Math.ceil(arr.length / pageSize),
          page: pageNumber,
          pageSize,
        },
      };
    },
    onLoading: () => ({ loading: true }),
    showModal: () => {
      dispatch({ type: "selectUnit", value: "All" });
      return { show: true };
    },
    closeModal: async () => {
      dispatch("refreshFilter");
      return { show: false, loading: false };
    },
  };
  return cases[action.type] && cases[action.type]();
};
export default detailedListReducer;
