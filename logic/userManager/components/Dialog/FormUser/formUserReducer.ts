import _ from "lodash";
import Province from "api/Province";
import User from "api/User";
import Media from "api/Media";

const getWorkUnit = (roles: any, value: any, dataDoet) => {
  const role = roles.find((item) => item.id === +value);
  let workUnit: any = null;
  switch (role?.role) {
    case "leader":
      return (workUnit = !dataDoet?.parentId ? "Moet-leader" : "Doet-leader");
    case "expert":
      return (workUnit = !dataDoet?.parentId ? "Moet-expert" : "Doet-expert");
    case "employee":
      return (workUnit = !dataDoet?.parentId
        ? "Moet-employee"
        : "Doet-employee");

    default:
      workUnit = null;
  }
  return workUnit;
};

const validation = (row: any) => {
  if (
    _.isEmpty(row.username) ||
    _.isEmpty(row.realRole) ||
    _.isEmpty(row.fullName) ||
    row.dateOfBirth === null ||
    _.isEmpty(`${row.roleId}`)
  ) {
    return true;
  }
  return;
};

export default function formUserReducer({
  state,
  action,
  dispatch,
  enqueueSnackbar,
  translate,
  props,
}: any) {
  const {
    onClose,
    onClick,
    data: { row, roles, type, unitId, dataDoet },
  } = props;

  const cases: any = {
    initial: async () => {
      const { provinces, errors, loads } = state;

      const restData: any = {};
      if (_.isEmpty(provinces)) {
        const dataProvince = await Province.get({});
        restData.provinces = dataProvince.data || [];
      }

      if (!_.isEmpty(row.province)) {
        const { data } = await Province.getDistrict(row.city?.key || "");
        restData.districts = data || [];
      }

      if (!_.isEmpty(row.district)) {
        const { data } = await Province.getWard(row.district?.key || "");
        restData.wards = data || [];
      }
      const dataRoles = roles.filter((item) => item.role !== "superAdmin");

      return {
        row,
        ...restData,
        roles: dataRoles,
        loads: { ...loads, loading: false, loadingAvatar: false },
        type,
        errors: { ...errors, isError: false, isErrorCode: false },
      };
    },

    checkUsername: async () => {
      const { e } = action;
      const { errors } = state;
      const value = e.target.value;

      const dataApi = await User.checkUser({ username: value });

      if (dataApi.existed) {
        return { errors: { ...errors, isErrorCode: true } };
      }
      return { errors: { ...errors, isErrorCode: false } };
    },

    onChange: () => {
      const { name, value } = action;
      const { row, roles }: any = state;
      row[name] = value;

      if (name === "role") {
        row.workUnit = getWorkUnit(roles, value, dataDoet);
        row[name] = +value;
      }
      if (name === "gender") {
        row[name] = +value;
      }

      return { row };
    },

    selectAuto: async () => {
      const { name, item } = action;
      const { row, loads } = state;
      row[name] = item;

      const res: any = {};

      if (name === "province") {
        dispatch({ type: "onLoads", name: "district" });
        const id = `${item?.key || ""}/district`;

        const { data } = await Province.getDetail(id, {});

        res.districts = data || [];
        res.wards = [];
        res.loads = { ...loads, district: false };
        row.district = null;
        row.ward = null;
      }

      if (name === "district") {
        dispatch({ type: "onLoads", name: "ward" });
        const id = `${item?.key || ""}/ward`;

        const { data } = await Province.getDetail(id, {});

        res.wards = data || [];
        res.loads = { ...loads, ward: false };
        row.ward = null;
      }
      return { ...res, row };
    },

    uploadAvatar: async () => {
      const { e, name } = action;
      const { row } = state;
      let formData = new FormData();
      for (const key of Object.keys(e)) {
        formData.append("file", e[key]);
      }
      const dataApi: any = await Media.post(formData);

      if (dataApi.data) {
        row[name] = _.get(dataApi, "data.public_url") || "";

        enqueueSnackbar(translate("userManager.messAddAvatar"), {
          variant: "success",
        });
      } else {
        const code = dataApi.errors.code;
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }

      return { row, loadingAvatar: false };
    },

    addNew: async () => {
      const { row, errors, loads } = state;
      const isError = validation(row);
      if (isError || errors.isErrorCode) {
        enqueueSnackbar(translate("userManager.messCompulsory"), {
          variant: "error",
        });
        return { errors: { ...errors, isError: true } };
      }
      const params = {
        ...row,
        password: "12345678",
        unitId: unitId,
        doet_id: unitId, //hard theo id select form
      };

      dispatch({ type: "onLoads", name: "loading" });
      const dataApi = await User.post(params);
      const res: any = {};

      if (dataApi.success) {
        res.row = {};
        const role = roles.find((item: any) => item.id === row.role);
        const data = {
          ...row,
          role,
          id: dataApi.data.id,
        };
        const name = "saveNew";
        onClick && onClick(data, name);
        onClose && onClose();
      } else if (dataApi.errors) {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }

      return { ...res, loads: { ...loads, loading: false } };
    },

    update: async () => {
      const { row, loads } = state;
      const id = row.id;

      dispatch({ type: "onLoads", name: "loading" });
      const dataApi = await User.put(id, row);
      const res: any = {};

      if (dataApi.success) {
        res.row = {};
        const role = !!row.role?.id
          ? row.role
          : roles.find((item) => item.id === row.role);
        const data = { ...row, role: role };
        const name = "update";
        onClick && onClick(data, name);
        onClose && onClose();
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }

      return { ...res, loads: { ...loads, loading: false } };
    },

    onLoads: () => {
      const { name } = action;
      const { loads } = state;
      return { loads: { ...loads, [name]: true } };
    },
  };

  return cases[action.type] && cases[action.type]();
}
