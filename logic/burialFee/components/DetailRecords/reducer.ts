import Province from "api/Province";
import Category from "api/Category";
import Profile from "api/Profile";
import BurialFee from "api/BurialFee";
import Beneficiary from "api/Beneficiary";
import { get } from "src/hooks/useLocalStorage";
import _ from "lodash";

const step1Fields = ["district", "ward", "category", "profile"];

const getFormError = (fields, step1) => {
  const validFields: string[] = [];
  Object.keys(step1).forEach((key) => {
    if (step1[key] && fields.includes(key)) {
      validFields.push(key);
    }
  });
  return fields.length !== validFields.length;
};

const sumMoney = (array: any) => {
  return array.reduce((sum: any, item: any) => {
    sum.sumSubsidy = (+sum?.sumSubsidy || 0) + (+item?.subsidy || 0);
    sum.sumAllowance = (+sum?.sumAllowance || 0) + (+item?.allowance || 0);
    sum.month3 =
      (+sum.month3 || 0) +
      ((+item?.subsidy || 0) + (+item?.allowance || 0)) * 3;
    sum.sumSubsidies =
      (+sum.sumSubsidies || 0) +
      (+item?.subsidy || 0) +
      (+item?.allowance || 0);
    if (item.beneficiary === 1 && item.subsidyForm === 1) {
      sum.deadMoney =
        (+sum?.deadMoney || 0) +
        (+item?.subsidy || 0) +
        (+item?.allowance || 0);
    }
    return sum;
  }, {});
};

const reducer = ({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any) => {
  const { deliverItem } = props;
  const { year, row, provinceId, categories, doet } = props.params;
  const user = get("user");

  const cases: any = {
    initialLoad: async () => {
      const payload: any = { step1: {}, step2: {}, step3: {} };
      dispatch("onLoading");
      const completed = !!row.id
        ? { 0: true, 1: true, 2: true }
        : { 0: false, 1: false, 2: false };
      if (!_.isEmpty(doet?.district)) {
        const id = doet?.district?.key;
        const dataWard = await Province.getWard(id);
        payload.wards = _.get(dataWard, "data");
        payload.step1 = { district: doet?.district };
      }
      if (!_.isEmpty(row)) {
        const dataProfile = await Profile.get({
          where: {
            categoryId: _.get(row, "profiles.categoryId") || null,
          },
          district: doet?.district,
          ward: _.get(row, "profiles.ward"),
          relation: `["infoBeneficiary", "infoNcc"]`,
        });

        const category = categories.find(
          (item) => item.id === row?.profiles?.categoryId
        );

        payload.profiles = _.get(dataProfile, "data.items") || [];
        const profile = payload.profiles.find(
          (item) => item.id === row?.profiles?.id
        );

        payload.step1 = {
          isEdit: true,
          district: doet?.district,
          ward: row?.profiles?.ward,
          category,
          profile: profile,
        };

        const sum = sumMoney(row?.profiles?.prefers || []);
        payload.step3 = {
          ...sum,
          type: row?.type,
          decided: row?.decided,
          decidedDate: row?.decidedDate,
          decidedPerson: row?.decidedPerson,
          fee: row?.fee || 0,
          stopDate: row?.stopDate,
          startDate: row?.startDate,
        };
      }

      return {
        completed,
        ...payload,
        currentStep: 0,
        loading: false,
      };
    },

    replace: async () => ({ openTB: true }),

    editStatus: async () => {
      const {
        data: { item },
      } = action;
      const { step1 } = state;

      const oldStatus = (step1?.profile?.infoBeneficiary || []).find(
        (i) => !!i.status
      );

      await Promise.all([
        Beneficiary.put(oldStatus.id, {
          status: false,
        }),
        Beneficiary.put(item.id, {
          status: true,
        }),
      ]);

      const newRows = (step1.profile?.infoBeneficiary || []).map((i: any) => {
        return item.id === i.id
          ? { ...i, status: true }
          : { ...i, status: false };
      });

      return {
        step1: {
          ...step1,
          profile: { ...step1.profile, infoBeneficiary: newRows },
        },
      };
    },

    onContinue: async () => {
      const { currentStep, step1, step3 } = state;
      dispatch("onLoading");
      if (currentStep === 0) {
        const hasError = getFormError(step1Fields, step1);

        if (hasError) {
          enqueueSnackbar(translate("recordsManagement.notEnough"), {
            variant: "error",
          });
          return { loading: false };
        } else dispatch("handleComplete");
      }

      if (currentStep === 1) {
        // const relative = (step1?.profile?.infoBeneficiary || []).find(
        //   (i) => !!i.status
        // );

        // const { data, success } = await Beneficiary.put(relative.id, {
        //   status: true,
        // });
        dispatch("handleComplete");
      }

      if (currentStep === 2) {
        const params = {
          type: step3?.type,
          decided: step3?.decided,
          decidedDate: step3?.decidedDate,
          decidedPerson: step3?.decidedPerson,
          stopDate: step3.stopDate,
          startDate: step3.startDate,
          fee: +`${step3.fee}`.replace(/,/g, ""),
          yearId: year.id,
          unitId: user.unitId,
          profilesId: _.get(step1, "profile.id") || null,
        };

        const { data, success } = !!step1.isEdit
          ? await BurialFee.put(row.id, params)
          : await BurialFee.post(params);

        if (!success) {
          enqueueSnackbar(translate("common.errorMes"), {
            variant: "error",
          });
          return { loading: false, currentStep: 2 };
        } else {
          enqueueSnackbar(
            translate(
              `${!!step1.isEdit ? "common.updateMes" : "common.addMes"}`
            ),
            {
              variant: "success",
            }
          );
          dispatch("handleComplete");
          deliverItem &&
            deliverItem({ data, name: !!step1.isEdit ? "update" : "addNew" });
        }
      }

      return {
        currentStep: currentStep === 2 ? 0 : currentStep + 1,
        loading: false,
      };
    },

    onSelectStep: () => {
      const { step } = action.payload;
      return {
        currentStep: step,
      };
    },

    handleComplete: () => {
      const { completed, currentStep } = state;
      const newCompleted = completed;
      newCompleted[currentStep] = true;
      return { completed: { ...completed, ...newCompleted } };
    },

    onChangeWard: async () => {
      const {
        payload: { value },
        name,
      } = action;
      const { step1, categories } = JSON.parse(JSON.stringify(state));
      const payload: any = { categories: categories };

      if (_.isEmpty(categories)) {
        const { data, success } = await Category.get({
          where: { unitId: provinceId },
          order: { index: "ASC" },
        });

        if (!success) {
          enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
        } else {
          payload.categories = data.items;
        }
      }

      step1.ward = name === "isEdit" ? step1.ward || {} : value;

      return {
        step1,
        ...payload,
      };
    },

    onChangeCategory: async () => {
      const {
        payload: { value },
        name,
      } = action;
      const payload: any = {};
      const { step1 } = JSON.parse(JSON.stringify(state));

      const { data, success } = await Profile.get({
        where: {
          categoryId: { value: [value.id], operation: "in" },
        },
        district: step1.district,
        ward: step1.ward,
        relation: `["infoBeneficiary","infoNcc"]`,
      });

      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      } else {
        payload.profiles = (data.items || []).filter((i: any) => {
          const tem = (i?.infoBeneficiary || []).filter(
            (t: any) => !!t?.relative
          );
          return tem.length > 0;
        });
      }

      const valueProfile = (payload.profiles || []).find(
        (item) => item.id === _.get(row, "profiles.id")
      );

      step1.category = name === "isEdit" ? step1.category : value;
      step1.profile = name === "isEdit" ? valueProfile : null;

      return {
        step1,
        ...payload,
      };
    },

    onChangeProfile: () => {
      const { value } = action.payload;
      const payload: any = {};
      const { step1, step2, step3 } = JSON.parse(JSON.stringify(state));

      step1.profile = value;
      step1.showBT = true;
      step2.infoBeneficiary = value.infoBeneficiary;
      const sum = sumMoney(value?.prefers || []);

      return {
        step1,
        step2,
        step3: { ...step3, ...sum },
        ...payload,
      };
    },

    onChange: () => {
      const { name, value } = action;
      const { step3 } = state;

      step3[name] = value;

      return { step3 };
    },

    showDetail: () => ({
      step1: { ...state.step1, showDetail: (state.step1?.showDetail || 0) + 1 },
    }),

    closeDialogTB: async () => ({ openTB: false }),

    onLoading: () => ({ loading: true }),
  };
  return cases[action.type] && cases[action.type]();
};

export default reducer;
