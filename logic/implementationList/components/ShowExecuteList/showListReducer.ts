import _ from "lodash";
import moment from "moment";
const showListReducer = ({ state, action, dispatch, props }: any) => {
  const { dataRows } = props.data;

  const cases: any = {
    initial: () => {
      return { rows: dataRows, oldRows: dataRows, showDialog: true };
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
          (i.dateOfBirth || "")
            .toLowerCase()
            .includes((whereSearch.dateOfBirth || "").toLowerCase()) &&
          (i.name || "")
            .toLowerCase()
            .includes((whereSearch.receiver || "").toLowerCase())
      );
      return { rows };
    },
    closeDetail: () => ({ valueSearch: {}, editHead: {}, showDialog: false }),
  };
  return cases[action.type] && cases[action.type]();
};
export default showListReducer;
