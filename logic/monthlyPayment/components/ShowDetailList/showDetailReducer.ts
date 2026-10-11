import _ from "lodash";
import moment from "moment";
import { renderRows } from "../utils";

const showDetailReducer = ({ state, action, dispatch, props }: any) => {
  const { dataRows, category, detailItem } = props.data;
  const cases: any = {
    initial: () => {
      const typeCategory = !detailItem?.categoryId
        ? category[0]
        : category.find((i) => i.id === detailItem.categoryId);
      return {
        typeCategory,
        rows: dataRows,
        oldRows: _.cloneDeep(dataRows),
        showDialog: true,
      };
    },

    changeCategory: async () => {
      const { oldRows } = state;
      const res: any = {};
      const id = action.value;

      res.typeCategory = category.find((i) => i.id === id);
      const filterRow = oldRows.filter((i) => i.categoryId === id);
      res.rows = id === "All" ? oldRows : renderRows(filterRow);
      return { ...res };
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
      const { valueSearch, oldRows } = state;
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

      const rows = oldRows.filter(
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
      return { rows, whereSearch };
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
      const { oldRows, valueFilter } = state;
      const newRows = !_.isEmpty(valueFilter.genders)
        ? oldRows.filter((i) => (valueFilter.genders || []).includes(i.gender))
        : oldRows;
      return { rows: newRows };
    },
    closeDetail: () => ({
      valueSearch: {},
      editHead: {},
      anchorEl: {},
      showDialog: false,
    }),
  };
  return cases[action.type] && cases[action.type]();
};
export default showDetailReducer;
