import _ from "lodash";
import Year from "api/Year";

const yearReducer = ({ state, action, props, orther }: any) => {
  const { enqueueSnackbar, translate } = orther;
  const { onChangeYear, onChangeCategory } = props;

  const cases: any = {
    initial: async () => {
      const { data, success } = await Year.get({
        where: { status: true },
        order: { year: "DESC" },
      });
      const res: any = {};
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        res.years = data.items;
        res.year = res.years[0];
        onChangeYear && onChangeYear(res.year);
      }
      return { ...res, loading: false };
    },

    onSelectYear: () => {
      const { e } = action;
      const value = e.target.value;
      onChangeYear && onChangeYear(value);

      return { year: value };
    },

    onSelectCategory: () => {
      const { item } = action;
      onChangeCategory && onChangeCategory(item);
    },
  };
  return cases[action.type] && cases[action.type]();
};

export default yearReducer;
