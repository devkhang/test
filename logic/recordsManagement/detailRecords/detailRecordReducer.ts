import Province from "api/Province";
import Profile from "api/Profile";
import Record from "api/Record";
import _ from "lodash";
import { get } from "src/hooks/useLocalStorage";

const infoDomain = get("infoDomain") || {};
const moetId = !infoDomain.parentId ? infoDomain.id : infoDomain.parentId;

const infoBeneficiaryValidate = (data, categoryKey) => {
  let error = true;
  const keys =
    !data.relative || categoryKey === "LS"
      ? [
          "fullName",
          //"dateOfBirth",
          // "gender",
          //"nativePlace",
          "province",
          "district",
          "ward",
          //"relation",
        ]
      : [
          "fullName",
          //"dateOfBirth",
          "province",
          "district",
          "ward",
          "dateOfNccDeath",
        ];

  const err: any = {
    bFullName: !data.fullName,
    bDateOfBirth: !data.dateOfBirth,
    //bGender: data.gender == undefined,
    //bNativePlace: !data.nativePlace,
    bProvince: !data.province,
    bDistrict: !data.district,
    bWard: !data.ward,
    //bDateOfNccDeath: !data.dateOfNccDeath,
    //bRelation: !data.relation,
  };

  for (let i = 0; i < keys.length; i++) {
    if (["province", "district", "ward"].includes(keys[i])) {
      if (_.isEmpty(data[keys[i]])) {
        return { error: false, err };
      }
    } else {
      if (
        data[keys[i]] === undefined ||
        data[keys[i]] === null ||
        data[keys[i]] === ""
      ) {
        return { error: false, err };
      }
    }
  }

  return { error, err };
};

const nccInfoValidate = (data) => {
  const error = !!data.fullName && !!data.dateOfBirth;

  const err: any = {
    fullName: !data.fullName,
    dateOfBirth: !data.dateOfBirth,
  };
  return { error, err };
};

const infoValidate = (data, categoryKey) => {
  const error = !!data.code && data.code !== `${categoryKey}-`;
  const err: any = { code: !data.code || data.code === `${categoryKey}-` };
  return { error, err };
};

const infoAddressValidate = (data) => {
  const error = !!data.district && !!data.province && !!data.ward;
  const err: any = {
    district: !data.district,
    province: !data.province,
    ward: !data.ward,
  };
  return { error, err };
};

const checkExistUser = (data, listRelation) => {
  const listIsExist = listRelation.map((user) =>
    user?.fullName === data.fullName && user?.dateOfBirth === data.dateOfBirth
      ? user
      : {}
  );

  const isExist =
    data.fullName === listIsExist[0]?.fullName &&
    data.gender === listIsExist[0]?.gender &&
    data.dateOfBirth === listIsExist[0]?.dateOfBirth &&
    data.nativePlace === listIsExist[0]?.nativePlace;
  return isExist;
};

const validateHandleStep = (name, categoryKey) => {
  const data = _.get(globalThis.reducers, `${name}.data`) || {};
  switch (name) {
    case "nccInfoReducer":
      return nccInfoValidate(data);
    case "addressInfoReducer":
      return infoAddressValidate(data);
    case "beneficiaryInfoReducer":
      return infoBeneficiaryValidate(data, categoryKey);
  }
};

const getName = (activeStep) => {
  switch (activeStep) {
    case 1:
      return "nccInfoReducer";
    case 2:
      return "addressInfoReducer";
    case 4:
      return "beneficiaryInfoReducer";
  }
};

const detailRecordsReducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
  steps,
}: any) => {
  const { categoryKey, categoryId, row, doet } = props;

  const cases: any = {
    initial: async () => {
      const { provinces } = state;
      const newState = {
        err: {},
        isAdd: false,
        activeStep: 0,
        currentStep: 0,
        completed: {
          0: false,
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
        },
      };
      const restData: any = {};
      restData.profile = row.id;
      if (_.isEmpty(provinces)) {
        const dataProvince = await Province.get({});
        restData.provinces = dataProvince.data || [];
      }
      if (!!row.id) {
        const { data } = await Profile.getDetail(row.id, {});
        const point = _.get(data, "point");
        for (let i = 0; i <= point; i++) {
          newState.completed = { ...newState.completed, [i]: true };
        }
        restData.currentStep = point;
        restData.point = point;
      }
      return {
        ...newState,
        ...restData,
        open: true,
      };
    },

    changeNthInfo: () => {
      const { name, value } = action;
      const { infoBeneficiary } = state;
      infoBeneficiary[name] = value;
      return { infoBeneficiary };
    },

    onClickStepper: () => {
      const { activeStep, currentStep } = state;
      const { idx } = action;
      if (currentStep > idx) {
        const name = getName(activeStep);
        const isValid = validateHandleStep(name, categoryKey);
        if (!isValid?.error) {
          dispatch({ type: "confirmOpen", name: "confirmHandleStep" });
          return { index: idx };
        }
        if (!!isValid?.error) {
          const data = _.get(globalThis.reducers, `${name}.data`) || {};
          if (name === "nccInfoReducer")
            dispatch({
              type: !!data.id ? "editNccInfo" : "saveNccInfo",
              nccInfo: data,
            });
          if (name === "addressInfoReducer")
            dispatch({
              type: !!data.id ? "editAddress" : "saveAddress",
              infoAddress: data,
            });
          if (name === "beneficiaryInfoReducer")
            dispatch(!!data.id ? "editBeneficiary" : "saveBeneficiary");
          dispatch({ type: "handleStep", idx });
        } else dispatch({ type: "handleStep", idx });
      }
      if (currentStep === idx) dispatch({ type: "handleStep", idx });
    },
    handleStep: () => {
      const { idx } = action;
      return { confirmHandleStep: false, activeStep: idx };
    },

    handleComplete: () => {
      const { completed, activeStep } = state;
      const newCompleted = completed;
      newCompleted[activeStep - 1] = true;
      return { completed: { ...completed, ...newCompleted } };
    },

    continue: () => {
      const { name } = action;
      const { completed, activeStep } = state;
      const newActive =
        activeStep === steps.length - 1
          ? steps.findIndex((step: any, i: any) => !(i in completed))
          : activeStep + 1;

      switch (newActive) {
        case 1:
          return dispatch({ type: "handleStep1", name, newActive });
        case 2:
          return dispatch({ type: "handleStep2", name, newActive });
        case 3:
          return dispatch({ type: "handleStep3", name, newActive });
        case 4:
          return categoryKey !== "LS"
            ? dispatch({ type: "handleStep4", name, newActive })
            : dispatch({ type: "handleStep5", name, newActive });
        case 5:
          return categoryKey !== "LS"
            ? dispatch({ type: "handleStep5", name, newActive })
            : dispatch({ type: "handleStep4", name, newActive });
        case -1:
          return dispatch("savePrenferetial");
      }
    },

    handleStep1: () => {
      const { name, newActive } = action;
      const { activeStep, profile, err } = state;
      const info = _.get(globalThis.reducers, "recordsInfoReducer.data") || {};
      const infoValid: any = infoValidate(info, categoryKey);
      if (!!info.isErrorCode) {
        enqueueSnackbar(translate("recordsManagement.notCorrect"), {
          variant: "error",
        });
        return { activeStep, confirmSave: false };
      } else if (!!infoValid.error) {
        !!row.id || !!profile
          ? dispatch({ type: "editInfo", info })
          : dispatch({ type: "saveProfile", info });
          // ? dispatch({type: "edditInfoCode", info})
          // : dispatch({type: "saveProfileCode", info});
        return !!name
          ? { open: false, confirmSave: false } //save -> back viewlist
          : { activeStep: newActive, currentStep: newActive }; //continue
      } else {
        enqueueSnackbar(translate("recordsManagement.notEnough"), {
          variant: "error",
        });
        return {
          activeStep,
          confirmSave: false,
          err: { ...err, ...infoValid.err },
        };
      }
    },

    handleStep2: () => {
      const { name, newActive } = action;
      const { activeStep, err } = state;
      const nccInfo = _.get(globalThis.reducers, "nccInfoReducer.data") || {};
      const nccInfoValid = nccInfoValidate(nccInfo);
      if (!!nccInfoValid.error) {
        !!row.id
          ? dispatch({ type: "editNccInfo", nccInfo })
          : dispatch({ type: "saveNccInfo", nccInfo });
      } else {
        enqueueSnackbar(
          translate(
            nccInfo.dateOfBirth > nccInfo.dead
              ? "recordsManagement.errorDeadTime"
              : "recordsManagement.notEnough"
          ),
          {
            variant: "error",
          }
        );
        return {
          activeStep,
          confirmSave: false,
          err: { ...err, ...nccInfoValid.err },
        };
      }
      return !!name
        ? { open: false, confirmSave: false }
        : { activeStep: newActive, currentStep: newActive };
    },

    handleStep3: () => {
      const { name, newActive } = action;
      const { activeStep, err } = state;
      const infoAddress =
        _.get(globalThis.reducers, "addressInfoReducer.data") || {};
      const infoAddressValid = infoAddressValidate(infoAddress);
      if (!!infoAddressValid.error) {
        !!row.id
          ? dispatch({ type: "editAddress", infoAddress })
          : dispatch({ type: "saveAddress", infoAddress });
        return !!name
          ? { open: false, confirmSave: false }
          : { activeStep: newActive, currentStep: newActive };
      } else {
        enqueueSnackbar(translate("recordsManagement.notEnough"), {
          variant: "error",
        });
        return {
          activeStep,
          confirmSave: false,
          err: { ...err, ...infoAddressValid.err },
        };
      }
    },

    handleStep4: () => {
      const { name, newActive } = action;
      !!row.id ? dispatch("editFiles") : dispatch("saveFiles");
      return !!name
        ? { open: false, confirmSave: false }
        : { activeStep: newActive, currentStep: newActive };
    },

    handleStep5: async () => {
      const { name, newActive } = action;
      const { activeStep, isAdd, err } = state;
      const infoBeneficiary =
        _.get(globalThis.reducers, "beneficiaryInfoReducer.data") || {};
      const infoBeneficiaryValid = infoBeneficiaryValidate(
        infoBeneficiary,
        categoryKey
      );
      if (!!infoBeneficiaryValid.error) {
        const listRelation =
          _.get(globalThis.reducers, "beneficiaryInfoReducer.list") || [];
        const isExist =
          categoryKey === "LS" || !isAdd
            ? false
            : checkExistUser(infoBeneficiary, listRelation);
        if (!!isExist) {
          enqueueSnackbar(translate("recordsManagement.isExistUser"), {
            variant: "error",
          });
          return { activeStep, confirmSave: false };
        } else {
          !!row.id && !isAdd && infoBeneficiary.id
            ? dispatch("editBeneficiary")
            : dispatch("saveBeneficiary");
          return !!name
            ? { open: false, confirmSave: false }
            : { activeStep: newActive, currentStep: newActive };
        }
      } else {
        enqueueSnackbar(translate("recordsManagement.notEnough"), {
          variant: "error",
        });
        return {
          activeStep,
          confirmSave: false,
          err: { ...err, ...infoBeneficiaryValid.err },
        };
      }
    },

    saveProfile: async () => {
      const { info } = action;
      const res: any = {};
      if (!!info.code) {
        dispatch("onLoading");
        const dataApi = await Profile.post({
          code: info.code,
          categoryId,
          point: 0,
          doet_id: moetId,
          unitId: doet.id,
        });
        if (!dataApi.success) {
          enqueueSnackbar(translate("common.errorMes"), {
            variant: "error",
          });
        } else {
          res.profile = dataApi.data.id;
          const { success } = await Record.createInfo(
            {
              ...info,
              profile: res.profile,
            },
            "infos"
          );
          if (success) {
            enqueueSnackbar(translate("common.loadSuccess"), {
              variant: "success",
            });
            dispatch("handleComplete");
          } else
            enqueueSnackbar(translate("common.errorMes"), {
              variant: "error",
            });
        }
      }
      return { ...res, loading: false };
    },

    editInfo: async () => {
      const { info } = action;
      const { profile } = state;
      const [dataProfile, dataRecord] = await Promise.all([
        Profile.put(profile, {
         code: info.code,
        }),
        Record.editInfo(info.id, { ...info }, "info")
      ])
      if (dataProfile.success && dataRecord.success ) {
        enqueueSnackbar(translate("common.updateMes"), {
          variant: "success",
        });
      }
      if (!!info.code) {
        dispatch("onLoading");
        const { success } = await Record.editInfo(
          info.id,
          { ...info },
          "infos"
        );
        if (success) {
          enqueueSnackbar(translate("common.updateMes"), {
            variant: "success",
          });
        } else
          enqueueSnackbar(translate("common.errorMes"), {
            variant: "error",
          });
      }
      return { loading: false };
    },

    saveNccInfo: async () => {
      const { profile } = state;
      const { nccInfo } = action;
      const move = _.get(globalThis.reducers, "nccInfoReducer.move") || {};
      const moves =
        _.get(globalThis.reducers, "reducers.nccInfoReducer.moves") || [];
      const point = move?.type === 0 ? 6 : move?.type === 1 ? 7 : 1;
      const index = moves.findIndex((i: any) => i.type === move.type);
      let tem: any = [];
      if (index === -1) {
        tem = [...moves, move];
      } else {
        moves[index] = move;
        tem = moves;
      }

      dispatch("onLoading");
      const [dataRecord, dataProfile] = await Promise.all([
        Record.createInfo({ ...nccInfo, profile }, "infoNccs"),
        Profile.put(profile, {
          point: point,
          fullName: nccInfo.fullName,
          dateOfBirth: nccInfo.dateOfBirth,
          gender: nccInfo.gender,
          move: tem,
        }),
      ]);
      if (dataRecord.success && dataProfile.success) {
        enqueueSnackbar(translate("common.addMes"), {
          variant: "success",
        });
        dispatch("handleComplete");
      } else
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      return { loading: false };
    },

    editNccInfo: async () => {
      const { profile } = state;
      const { nccInfo } = action;
      const move = _.get(globalThis.reducers, "nccInfoReducer.move") || {};
      const moves = _.get(globalThis.reducers, "nccInfoReducer.moves") || [];
      const point = move?.type === 0 ? 6 : move?.type === 1 ? 7 : 1;
      const pointObj = point === 1 ? {} : { point };

      const index = moves.findIndex((i: any) => i.type === move.type);
      let tem: any = [];
      if (index === -1) {
        tem = [...moves, move];
      } else {
        moves[index] = move;
        tem = moves;
      }

      dispatch("onLoading");
      if (!nccInfo.id) {
        dispatch({ type: "saveNccInfo", nccInfo });
      } else {
        const [dataProfile, dataRecord] = await Promise.all([
          Profile.put(profile, {
            ...pointObj,
            fullName: nccInfo.fullName,
            dateOfBirth: nccInfo.dateOfBirth,
            gender: nccInfo.gender,
            move: tem,
          }),
          Record.editInfo(nccInfo.id, { ...nccInfo }, "infoNccs"),
        ]);
        if (dataProfile.success && dataRecord.success) {
          enqueueSnackbar(translate("common.updateMes"), {
            variant: "success",
          });
        } else
          enqueueSnackbar(translate("common.errorMes"), {
            variant: "error",
          });
      }
      return { loading: false };
    },

    saveAddress: async () => {
      const { infoAddress } = action;
      const { profile } = state;
      dispatch("onLoading");
      const [dataAddress, dataProfile] = await Promise.all([
        Record.createInfo({ ...infoAddress, profile }, "infoAddress"),
        Profile.put(!!row.id ? row.id : profile, {
          point: 2,
          ...infoAddress,
        }),
      ]);
      if (dataAddress.success && dataProfile.success) {
        enqueueSnackbar(translate("common.addMes"), {
          variant: "success",
        });
        dispatch("handleComplete");
      } else
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      return { loading: false };
    },

    editAddress: async () => {
      const { infoAddress } = action;
      const { profile } = state;
      dispatch("onLoading");
      if (!infoAddress.id) {
        dispatch({ type: "saveAddress", infoAddress });
      } else {
        const newAddress = _.cloneDeep(infoAddress);
        delete newAddress.id;

        const [dataAddress, dataProfile] = await Promise.all([
          Record.editInfo(infoAddress.id, { ...infoAddress }, "infoAddress"),
          Profile.put(!!row.id ? row.id : profile, { ...newAddress }),
        ]);

        if (dataAddress.success && dataProfile.success) {
          enqueueSnackbar(translate("common.updateMes"), {
            variant: "success",
          });
        } else
          enqueueSnackbar(translate("common.errorMes"), {
            variant: "error",
          });
      }
      return { loading: false };
    },

    saveFiles: async () => {
      const { profile } = state;
      const files = _.get(globalThis.reducers, "importFileReducer");
      const point = categoryKey !== "LS" ? 3 : 4;
      dispatch("onLoading");
      const [dataFiles, dataProfile] = await Promise.all([
        Record.createInfo({ ...files, profile }, "files"),
        Profile.put(profile, { point }),
      ]);
      dispatch("handleComplete");
      return { loading: false };
    },

    editFiles: async () => {
      const files = _.get(globalThis.reducers, "importFileReducer") || {};
      dispatch("onLoading");
      if (!files.id) {
        dispatch("saveFiles");
      } else {
        const { success } = await Record.editInfo(
          files.id,
          { ...files },
          "files"
        );
      }
      return { loading: false };
    },

    saveBeneficiary: async () => {
      const { profile } = state;
      const infoBeneficiary = _.get(
        globalThis.reducers,
        "beneficiaryInfoReducer.data"
      );

      const params = _.cloneDeep(infoBeneficiary);
      delete params.status;
      delete params.id;

      const files = _.get(globalThis.reducers, "beneficiaryInfoReducer.files");
      const point = categoryKey !== "LS" ? 4 : 3;
      dispatch("onLoading");
      const [dataAddress, dataProfile] = await Promise.all([
        Record.createInfo(
          categoryKey === "LS"
            ? { ...params, files, profile, relative: true }
            : { ...params, files, profile },
          "infoBeneficiaries"
        ),
        Profile.put(profile, { point }),
      ]);
      if (dataAddress.success && dataProfile.success) {
        enqueueSnackbar(translate("common.addMes"), {
          variant: "success",
        });
        dispatch("handleComplete");
      } else
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });

      return { loading: false };
    },

    editOldBeneficiary: async () => {
      const oldId = _.get(globalThis.reducers, "beneficiaryInfoReducer.oldId");
      const { success } = await Record.editInfo(
        oldId,
        { status: false },
        "infoBeneficiaries"
      );
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      }
      return { loading: false };
    },

    editBeneficiary: async () => {
      const infoBeneficiary =
        _.get(globalThis.reducers, "beneficiaryInfoReducer.data") || {};
      const files = _.get(globalThis.reducers, "beneficiaryInfoReducer.files");
      const oldId = _.get(globalThis.reducers, "beneficiaryInfoReducer.oldId");

      if (!!oldId) {
        dispatch("editOldBeneficiary");
      }
      const { success } = await Record.editInfo(
        infoBeneficiary.id,
        { ...infoBeneficiary, files },
        "infoBeneficiaries"
      );
      if (success) {
        enqueueSnackbar(translate("common.updateMes"), {
          variant: "success",
        });
      } else
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });

      return { loading: false };
    },

    savePrenferetial: async () => {
      const { profile } = state;
      const dataPrenferetial = _.get(
        globalThis.reducers,
        "preferentialReducer"
      );

      const [dataPrefers, dataProfile] = await Promise.all([
        Profile.putPrenferetial(profile, {
          prefers: [...dataPrenferetial.prefers],
        }),
        Profile.put(profile, {
          other: dataPrenferetial.other,
          point: 5,
          attachment: dataPrenferetial.files || [],
        }),
      ]);

      if (!dataPrefers.success && !dataProfile.success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
        return;
      }
      dispatch("handleComplete");
      return { open: false, confirmSave: false };
    },

    isAdd: () => ({ isAdd: action.name === "add" ? true : false }),
    onLoading: () => ({ loading: true }),
    showModal: () => ({ open: true }),
    closeModal: () => {
      return { open: false, confirmCancel: false };
    },
    confirmOpen: () => {
      const { name } = action;
      return { [name]: true };
    },
    closeConfirm: () => {
      const { name } = action;
      return { [name]: false };
    },
  };
  return cases[action.type] && cases[action.type]();
};
export default detailRecordsReducer;
