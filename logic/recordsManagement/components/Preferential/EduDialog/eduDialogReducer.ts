import _ from "lodash";
import Preferential from "api/Preferential";
import Category from "api/Category";
import Profile from "api/Profile";
import { unaccent } from "logic/recordsManagement/util";
import { AddAlarmRounded } from "@material-ui/icons";

export default function eduDialogReducer({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any) {
  const { deliverItem } = props;
  const { year, categoryKey, profile, prefers } = props.data;

  const cases: any = {
    initial: async () => {
      const dataCategory = await Category.get({
        where: { unitId: null, status: true },
        order: { index: "ASC" },
      }); //get categoryId chung.

      const categories = _.get(dataCategory, "data.items");
      const category =
        _.get(
          categories.find((item) => categoryKey === item.key),
          "id"
        ) || null;

      const [preferData, beneficData] = await Promise.all([
        Preferential.get({
          where: {
            beneficiary: { value: [5], operation: "in" },
            subsidyForm: { value: [2], operation: "in" },
            yearId: { value: [year?.id || ""], operation: "in" },
            categoryId: { value: [category], operation: "in" },
          },
        }),
        Profile.get({
          where: { id: profile },
          relation: JSON.stringify(["infoBeneficiary"]),
        }),
      ]);

      const res: any = {};
      if (!preferData.success || !beneficData.success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        const prefersApi = _.get(preferData.data, "items") || [];
        res.oldRows = prefersApi.map((i) => {
          const tmp = prefers.find((p) => p.id === i.id);
          return !!tmp ? tmp : i;
        });
        res.eduPrefers = _.cloneDeep(res.oldRows);
        const arr = _.get(beneficData.data, "items[0].infoBeneficiary") || [];
        res.children = arr.filter((i) =>
          ["Con nuôi", "Con đẻ"].includes(i.relation)
        );
      }
      return {
        open: true,
        ...res,
      };
    },

    onCheck: () => {
      const {
        data: { rowIdx },
        ele,
      } = action;
      const { eduPrefers } = state;
      const value = ele.target.checked;
      if (!value) {
        eduPrefers[rowIdx].receivers = [];
      }
      eduPrefers[rowIdx] = {
        ...eduPrefers[rowIdx],
        isCheck: value,
      };
      return { eduPrefers };
    },

    onChange: () => {
      const {
        ele,
        data: { rowIdx },
      } = action;
      const { eduPrefers } = state;
      const value = ele.target.value;
      eduPrefers[rowIdx].receivers = value;

      return { eduPrefers };
    },

    onSearch: () => {
      const { oldRows } = state;
      const { ele } = action;
      const value = ele?.target?.value;
      const eduPrefers = oldRows.filter((item: any) => {
        return unaccent(item?.name || "")
          .replace(/ /g, "")
          .includes(unaccent(value || "").replace(/ /g, ""));
      });

      return { eduPrefers };
    },

    setEditHead: () => {
      const {
        data: { name },
      } = action;
      const { editHead, oldRows, valueSearch } = state;
      const res: any = {};
      res.valueSearch = !editHead[name] ? valueSearch : "";
      if (!!editHead.name) {
        res.eduPrefers = oldRows;
      }

      return {
        valueSearch,
        editHead: { [name]: !editHead[name] },
      };
    },

    onSubmit: async () => {
      const { eduPrefers } = state;
      const selectPrefers = eduPrefers.filter((i) => i.isCheck);
      const newPrefers = prefers.filter((i) => i.beneficiary !== 5);
      const prefersArr = [...newPrefers, ...selectPrefers];
      deliverItem && deliverItem(prefersArr);
      dispatch("closeDialog");
    },

    closeDialog: () => ({
      open: false,
      eduPrefers: [],
      editHead: {},
    }),
  };
  return cases[action.type] && cases[action.type]();
}
