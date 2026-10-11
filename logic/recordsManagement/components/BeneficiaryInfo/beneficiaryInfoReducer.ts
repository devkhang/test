import _ from "lodash";
import Province from "api/Province";
import Upload from "api/Upload";
import Beneficiary from "api/Beneficiary";
import Profile from "api/Profile";
import { uuidv4 } from "../utils";

const infoValidate = (data) => {
  const empty =
    !data.fullName &&
    data.gender == undefined &&
    !data.dateOfBirth &&
    !data.nativePlace;
  return empty;
};
const uniqueUser = (arr) => {
  let newArr: any = [];
  arr.forEach((item: any) => {
    const tmp = newArr.find(
      (i: any) =>
        item.fullName === i.fullName && item.dateOfBirth === i.dateOfBirth
    );
    if (_.isEmpty(tmp)) {
      newArr.push(item);
    }
  });
  return newArr;
};

export const beneficiaryInfoReducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any): any => {
  const { profile, provinces, isAdd, categoryKey, doet } = props;
  const cases: any = {
    initial: async () => {
      const relation = ["infoBeneficiary"];
      const res: any = {};

      if (categoryKey === "LS") {
        res.disabled = false;
        res.data = {
          relative: true,
          beneficiary: false,
        };
      }

      dispatch("onLoading");
      if (!_.isEmpty(provinces)) {
        const dataProvince = await Province.get({});
        res.provinces = dataProvince.data || [];
      } else {
        res.provinces = provinces;
      }
      // res.users = [];

      if (!!profile) {
        const beneficiaryInfo = await Profile.get({
          where: { id: profile },
          relation: JSON.stringify(relation),
        });

        if (!beneficiaryInfo.success) {
          enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
        } else {
          res.list = _.get(
            beneficiaryInfo,
            "data.items[0].infoBeneficiary",
            []
          );
          res.data = res.list.filter((item) =>
            categoryKey === "LS" ? !!item.relative : !!item.status
          )[0] || {
            beneficiary: false,
            relative: false,
          };
          res.initialData = _.cloneDeep(res.data);
          res.rowsRe = res.list.filter((i) => !i.relative) || [];

          res.files = _.get(res.data, "files", []);
          res.data?.isNcc ? (res.checked = true) : (res.checked = false);

          if (!!res.data?.id) {
            res.relative = !!res.data.relative
              ? "infoRelative"
              : !!res.data.beneficiary
              ? "infoBeneficiary"
              : "";
          }
          res.disabled = categoryKey === "LS" ? false : !res.relative;

          if (!_.isEmpty(res.data.province)) {
            const id = res.data.province?.key || "";
            const dataDistrict = await Province.getDistrict(id);
            res.districts = dataDistrict.data || [];
          }
          if (!_.isEmpty(res.data.district)) {
            const id = res.data.district?.key || "";
            const dataWard = await Province.getWard(id);
            res.wards = dataWard.data || [];
          }
        }
      }

      return { ...state, ...res, loading: false };
    },

    handleCheck: async () => {
      const { checked, data } = state;
      dispatch("onLoading");
      const profileInfo = await Profile.get({
        where: { id: profile },
        relation: JSON.stringify(["infoNcc", "infoAddress"]),
      });

      if (!!checked) {
        return {
          checked: !checked,
          data: { beneficiary: true, relative: false },
        };
      } else {
        const getNccInfo = _.get(profileInfo, "data.items[0].infoNcc[0]") || {};
        const getNccAddress =
          _.get(profileInfo, "data.items[0].infoAddress[0]") || {};

        return {
          checked: !checked,
          data: {
            ...getNccAddress,
            ...getNccInfo,
            beneficiary: true,
            relative: false,
            isNcc: true,
            relation: "isNcc",
            id: data.id,
          },
        };
      }
    },

    checkRelative: () => {
      const { checkRelative, oldData } = state;
      if (!!checkRelative) {
        return {
          checkRelative: !checkRelative,
          data: { beneficiary: false, relative: true },
        };
      } else {
        if (!oldData.fullName) {
          enqueueSnackbar(translate("recordsManagement.emptyNth"), {
            variant: "error",
          });
          return;
        } else {
          delete oldData.id;
          delete oldData.isNcc;
          delete oldData.status;
          return {
            checkRelative: !checkRelative,
            data: { ...oldData, relative: true, beneficiary: false },
            files: [],
          };
        }
      }
    },

    // onCheckUser: async () => {
    //   const { users } = state;
    //   const { data, ele } = action;
    //   const value = ele.target.checked;
    //   const newUsers = users.map((item) => ({ ...item, isCheck: false }));
    //   newUsers[data.rowIdx] = { ...newUsers[data.rowIdx], isCheck: value };

    //   const selectUser = _.cloneDeep(users[data.rowIdx]);

    //   delete selectUser.status;
    //   delete selectUser.isNcc;
    //   delete selectUser.id;
    //   delete selectUser.relation;
    //   delete selectUser.dateOfNccDeath;

    //   const row = value
    //     ? selectUser
    //     : {
    //         beneficiary: state.data.beneficiary,
    //         relative: state.data.relative,
    //       };

    //   const res: any = {};
    //   if (!_.isEmpty(row?.province)) {
    //     const id = row.province?.key || "";
    //     const dataDistrict = await Province.getDistrict(id);
    //     res.districts = dataDistrict.data || [];
    //   }
    //   if (!_.isEmpty(row?.district)) {
    //     const id = row?.district?.key || "";
    //     const dataWard = await Province.getWard(id);
    //     res.wards = dataWard.data || [];
    //   }

    //   return {
    //     data: row,
    //     users: newUsers,
    //     ...res,
    //   };
    // },

    changePlace: () => {
      const { name, item } = action;
      const { data } = state;
      data[name] = item;
      return { data };
    },

    selectAuto: async () => {
      const { name, item } = action;
      const { data } = state;
      const res: any = {};

      data[name] = item;
      if (name === "province") {
        const id = item?.key || "";
        const { data: dataApi } = await Province.getDistrict(id);
        res.districts = dataApi || [];
        res.wards = [];
        data.district = null;
        data.ward = null;
      }

      if (name === "district") {
        const id = item?.key || "";
        const { data: dataApi } = await Province.getWard(id);
        res.wards = dataApi || [];
        data.ward = null;
      }

      return { ...res, data };
    },

    changeNthInfo: async () => {
      const { name, value } = action;
      const { data, filter } = state;
      const res: any = {};
      data[name] = value;

      // const include = [
      //   "fullName",
      //   "gender",
      //   "dateOfBirth",
      //   //"nativePlace",
      // ].includes(name);

      // if (infoValidate(data)) {
      //   res.users = [];
      // } else {
      //   if (include) {
      //     res.filter =
      //       name === "gender"
      //         ? { ...filter, gender: value }
      //         : name === "dateOfBirth"
      //         ? {
      //             ...filter,
      //             dateOfBirth: {
      //               value: `%${moment(value, "YYYY-MM-DD").format(
      //                 "YYYY-MM-DD"
      //               )}%`,
      //               operation: "like",
      //             },
      //           }
      //         : {
      //             ...filter,
      //             [name]: { value: `%${value}%`, operation: "like" },
      //           };

      //     const newFilter = Object.keys(res.filter).filter((item) => {
      //       if (item === "gender") return res.filter.gender !== "";
      //       if (item === "dateOfBirth")
      //         return res.filter[item]?.value !== "%Invalid date%";
      //       return res.filter[item]?.value !== "%%";
      //     });
      //     let newValue: any = {};
      //     for (let i = 0; i < newFilter.length; i++) {
      //       newValue = {
      //         ...newValue,
      //         [newFilter[i]]: res.filter[newFilter[i]],
      //       };
      //     }

      //     dispatch("onLoading");
      //     const dataApi = await Beneficiary.get({
      //       pageSize: 10,
      //       pageNumber: 0,
      //       where: {
      //         beneficiary: data.beneficiary,
      //         relative: categoryKey === "LS" ? true : data.relative,
      //         province: doet?.province,
      //         ...newValue,
      //       },
      //     });
      //     if (dataApi.success) {
      //       const arr = _.get(dataApi, "data.items") || [];
      //       res.users = uniqueUser(arr);
      //     }
      //   }
      // }
      return { ...res, data, loading: false };
    },

    handleDropFile: async () => {
      const { data } = action;
      const { files } = state;
      const res: any = {};

      if (data[0]?.size > 8 * 1024 * 1024) {
        enqueueSnackbar(translate("recordsManagement.sizeErr"), {
          variant: "error",
        });
        return {};
      } else {
        const uploadApi = await Upload.uploadFile(data);
        if (!uploadApi.success) {
          enqueueSnackbar(translate("recordsManagement.errorMessage"), {
            variant: "error",
          });
          return;
        } else {
          enqueueSnackbar(uploadApi.message, {
            variant: "success",
          });

          const newData = {
            ...data[0],
            name: uploadApi.data.public_id || "",
            size: data[0].size,
            id: uuidv4(),
            url: uploadApi.data.public_url,
          };
          res.files = [...files, newData];
        }
      }
      return { ...res };
    },

    setRelative: async () => {
      const { name } = action;
      const { data, initialData } = state;
      const res: any = {};

      if (name === "beneficiary") {
        const tmp = !!initialData.beneficiary ? initialData : {};
        if (!!profile) {
          res.oldData = _.cloneDeep(data);
          res.data = {
            relative: false,
            beneficiary: true,
            id: data.id,
            ...tmp,
          };
        }
        return {
          relative: "infoBeneficiary",
          //users: [],
          disabled: false,
          data: { ...data, beneficiary: true, relative: false },
          ...res,
        };
      }
      if (name === "relative") {
        const tmp = !!initialData.relative ? initialData : {};
        res.oldData = _.cloneDeep(data);
        return {
          ...res,
          relative: "infoRelative",
          //users: [],
          files: [],
          disabled: false,
          data: {
            relative: true,
            beneficiary: false,
            //isNcc: data.isNcc, id: data.id,
            isNcc: false,
            ...tmp,
          },
          checked: false,
        };
      }
    },

    addNew: () => {
      const { name } = action;
      isAdd && isAdd("add");
      if (name === "beneficiary") {
        return {
          isAdd: true,
          //users: [],
          checked: false,
          data: {
            relative: false,
            beneficiary: true,
          },
        };
      } else {
        return {
          isAdd: true,
          files: [],
          //users: [],
          data: {
            relative: true,
            beneficiary: false,
          },
        };
      }
    },

    showList: () => {
      const { name } = action;
      isAdd && isAdd("edit");
      return { open: true };
    },
    editStatus: () => {
      const { list, data } = state;
      const {
        data: { item, rowIdx },
        ele,
      } = action;
      const chooseList = !!data.beneficiary
        ? list.filter((i) => !!i.beneficiary)
        : list.filter((i) => !!i.relative);
      const value = ele.target.checked;
      const newList = chooseList.map((i) => ({ ...i, status: false }));
      newList[rowIdx] = { ...newList[rowIdx], status: value };
      return {
        files: item.files,
        list: newList,
        data: newList[rowIdx],
        oldId: data.id,
        checked: newList[rowIdx].isNcc,
        isEdit: false,
      };
    },
    editInfo: () => {
      const { item } = action.data;
      isAdd && isAdd("edit");
      return { open: false, data: item, files: item.files, isEdit: true };
    },

    addRelative: async () => {
      const { rowsRe } = state;
      return { rowsRe: [{ isEdit: true }, ...rowsRe], loading: false };
    },

    onChange: () => {
      const {
        data: { name, rowIdx, item },
        ele,
      } = action;
      const { rowsRe } = state;

      if (name === "dateOfBirth") {
        if (!!ele && ele.toDateString() !== "Invalid Date") {
          rowsRe[rowIdx][name] = ele;
        }
      } else {
        const value = ele?.target?.value;
        item[name] = value;
        rowsRe[rowIdx] = item;
      }
      return { rowsRe };
    },

    saveRelative: async () => {
      const { rowsRe } = state;
      const { rowIdx, item } = action.data;
      const res: any = {};

      !!rowsRe[rowIdx].id
        ? dispatch({ type: "saveBeneficiary", name: "put", item })
        : dispatch({ type: "saveBeneficiary", name: "post", item });
      rowsRe[rowIdx] = { ...rowsRe[rowIdx], isEdit: false, id: uuidv4() };
      res.oldrowsRe = _.cloneDeep(rowsRe);

      return { ...res, rowsRe, loading: false };
    },

    editRelative: () => {
      const { rowsRe, oldRows } = state;
      const { rowIdx } = action.data;
      if (!rowsRe[rowIdx].id && !!rowsRe[rowIdx].isEdit) {
        rowsRe.splice(rowIdx, 1);
      } else {
        rowsRe[rowIdx].isEdit = !rowsRe[rowIdx].isEdit;
        if (!rowsRe[rowIdx].isEdit && !!rowsRe[rowIdx].id) {
          rowsRe[rowIdx] = _.cloneDeep(
            oldRows.find((item: any) => rowsRe[rowIdx].id === item.id)
          );
        }
      }
      return { rowsRe };
    },

    // deleteRelation: () => {
    //   const { list } = state;
    //   const { item } = action.data;
    //   return { list: list.filter((v: any) => v.id !== item.id) };
    // },

    delete: async () => {
      const { rowsRe } = state;
      const { item } = action.data;
      return { rowsRe: rowsRe.filter((v: any) => v.id !== item.id) };
    },

    saveBeneficiary: async () => {
      const { name, item } = action;
      dispatch("onLoading");
      const { success, message } =
        name === "post"
          ? await Beneficiary.post({
              ...item,
              relative: false,
              profile: profile,
            })
          : await Beneficiary.put(item.id, { ...item });
      if (success) {
        enqueueSnackbar(translate("common.loadSuccess"), {
          variant: "success",
        });
      } else
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      return { loading: false };
    },

    removeItem: () => {
      const { file } = action;
      const { files } = state;
      const filteredItems = (files || []).filter((i: any) => i !== file);
      return { files: filteredItems };
    },
    removeAll: () => ({ files: [] }),
    onLoading: () => ({ loading: true }),
    closeDialog: () => ({ open: false }),
  };
  return cases[action.type] && cases[action.type]();
};
