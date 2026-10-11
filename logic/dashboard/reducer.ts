import Dashboard from "api/Dashboard";
import Year from "api/Year";

export default function monthlyPaymentReducer({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
}: any) {
  const cases: any = {
    initialLoad: async () => {
      dispatch("onLoading");
      await dispatch("getYears");
      dispatch("getTotalMeritoriousPerson");
      dispatch("getTotalCompletedProfile");
      dispatch("getTotalUnFinishedProfile");
      dispatch("getTotalAffiliatedUnit");
      dispatch("getMonthlyAllowanceCost");
      dispatch("getPeopleReceiveBenefit");
      dispatch("getPaymentProgress");
      return {
        loading: false,
      };
    },
    getYears: async () => {
      const { monthlyAllowanceCost, peopleReceiveBenefit, paymentProgress } =
        JSON.parse(JSON.stringify(state));
      const payload: any = {
        monthlyAllowanceCost,
        peopleReceiveBenefit,
        paymentProgress,
      };
      const { data, success } = await Year.get({
        where: { status: true },
        order: { year: "DESC" },
      });
      if (!success) {
        enqueueSnackbar(translate("common.errorMes"), { variant: "error" });
      } else {
        payload.years = data.items;
        payload.monthlyAllowanceCost.year = data.items[0].year;
        payload.peopleReceiveBenefit.year = data.items[0].year;
        payload.paymentProgress.year = data.items[0].year;
      }
      return {
        ...payload,
      };
    },
    getTotalMeritoriousPerson: async () => {
      const payload: any = {};
      const res = await Dashboard.getTotalMeritoriousPerson();
      payload.totalMeritoriousPerson = res.count;
      return {
        ...payload,
      };
    },
    getTotalCompletedProfile: async () => {
      const payload: any = {};
      const res = await Dashboard.getTotalCompletedProfile();
      payload.totalCompletedProfile = res.count;
      return {
        ...payload,
      };
    },
    getTotalUnFinishedProfile: async () => {
      const payload: any = {};
      const res = await Dashboard.getTotalUnFinishedProfile();
      payload.totalUnfinishedProfile = res.count;
      return {
        ...payload,
      };
    },
    getMonthlyAllowanceCost: async () => {
      const { monthlyAllowanceCost } = JSON.parse(JSON.stringify(state));
      const year = action.payload?.year;
      const payload: any = {
        monthlyAllowanceCost,
      };

      const res = await Dashboard.getMonthlyAllowanceCost(
        year || monthlyAllowanceCost.year
      );
      payload.monthlyAllowanceCost.data = res.data;
      payload.monthlyAllowanceCost.year = year;

      return {
        ...payload,
      };
    },
    getPeopleReceiveBenefit: async () => {
      const { peopleReceiveBenefit } = JSON.parse(JSON.stringify(state));
      const year = action.payload?.year;
      const payload: any = {
        peopleReceiveBenefit,
      };

      const res = await Dashboard.getPeopleReceiveBenefit(
        year || peopleReceiveBenefit.year
      );
      payload.peopleReceiveBenefit.data = res.data;
      payload.peopleReceiveBenefit.year = year;

      return {
        ...payload,
      };
    },
    getPaymentProgress: async () => {
      const { paymentProgress } = JSON.parse(JSON.stringify(state));
      const year = action.payload?.year;
      const payload: any = {
        paymentProgress,
      };

      const res = await Dashboard.getPaymentProgress(
        year || paymentProgress.year
      );
      payload.paymentProgress.data = res.data;
      payload.paymentProgress.year = year;

      return {
        ...payload,
      };
    },
    onChangeYear: async () => {
      dispatch("onLoading");
      const { actionType, value } = action.payload;
      await dispatch({ type: actionType, payload: { year: value } });
      return {
        loading: false,
      };
    },
    onLoading: () => ({ loading: true }),

    getTotalAffiliatedUnit: async () => {
      const payload: any = {};
      const { data } = await Dashboard.getTotalAffiliatedUnit();
      payload.totalAffiliatedUnit = data || 0;
      return {
        ...payload,
      };
    },
  };

  return cases[action.type] && cases[action.type]();
}
