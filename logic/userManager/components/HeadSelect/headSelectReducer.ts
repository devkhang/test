import _ from "lodash";
import { get } from "src/hooks/useLocalStorage";
import Doet from "api/Doet";

export default function headSelectReducer({
  state,
  action,
  dispatch,
  enqueueSnackbar,
  translate,
  props,
}: any) {
  const { deliverItem, deliverSearchItem, deliverImpoItem } = props;
  const doet = get("infoDomain");
  const user = get("user");
  const token = get("token");
  const cases: any = {
    initial: async () => {
      const isDomain = user?.unitId === user?.doet; //nếu tài khoản có domain
      const { data, success } = await Doet.getItems(token, {
        where: isDomain ? { parentId: doet?.id } : { id: user?.unitId },
      });

      const res: any = {};
      if (!data.success) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      } else {
        const temps = _.get(data, "data.items") || [];
        res.doets = isDomain ? [doet, ...temps] : [...temps];
        res.doet = res.doets[0] || {};
        deliverItem && deliverItem({ item: res.doet });
      }

      return res;
    },

    onSelect: () => {
      const { item } = action;
      deliverItem && deliverItem({ item });
      return { doet: item };
    },

    reset: () => {
      deliverSearchItem && deliverSearchItem({ name: "reset" });
      return { valueSearch: "" };
    },

    deleteAll: () => {
      deliverSearchItem &&
        deliverSearchItem({ name: "openConfirm", type: "deleteAll" });
    },

    import: () => {
      const { e } = action;
      const file = e.target.files[0];
      deliverImpoItem && deliverImpoItem({ item: file, name: "importFile" });
    },
  };
  return cases[action.type] && cases[action.type]();
}
