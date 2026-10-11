import * as React from "react";
import { Grid, Backdrop } from "@material-ui/core";
import DashboardLayout from "src/layouts/dashboard";
import {
  MeritoriousPerson,
  CompletedProfile,
  UnfinishedProfile,
  AffiliatedUnit,
  PeopleReceiveBenefitChart,
  MonthlyAllowanceCostChart,
  ContactBox,
  PaymentProgress,
} from "logic/dashboard";
import { CircularProgress } from "@material-ui/core";
import { useEffect } from "react";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import { reducer } from "logic/dashboard";

const initialState = {
  loading: false,
  years: [],
  totalMeritoriousPerson: 0,
  totalCompletedProfile: 0,
  totalUnfinishedProfile: 0,
  totalAffiliatedUnit: 0,
  monthlyAllowanceCost: {
    year: "",
    data: {},
  },
  peopleReceiveBenefit: {
    year: "",
    data: {},
  },
  paymentProgress: {
    year: "",
    data: [],
  },
};

export default function Profile() {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer({
    reducer,
    name: reducer.name,
    initialState,
    translate,
    enqueueSnackbar,
  });

  useEffect(() => {
    dispatch("initialLoad");
  }, []);

  const {
    loading,
    totalMeritoriousPerson,
    totalCompletedProfile,
    totalUnfinishedProfile,
    totalAffiliatedUnit,
    years,
    monthlyAllowanceCost,
    peopleReceiveBenefit,
    paymentProgress,
  } = state;

  return (
    <DashboardLayout breadcrumbs={{ url: "dashboard", name: "dashboard" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={12}>
        <Grid item xs={12} sm={6} md={3}>
          <MeritoriousPerson
            translate={translate}
            total={totalMeritoriousPerson}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <CompletedProfile
            translate={translate}
            total={totalCompletedProfile}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <UnfinishedProfile
            translate={translate}
            total={totalUnfinishedProfile}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AffiliatedUnit translate={translate} total={totalAffiliatedUnit} />
        </Grid>
      </Grid>

      <Grid container spacing={3} marginY={4}>
        <Grid item xs={12} sm={6}>
          <PeopleReceiveBenefitChart
            {...{ years, translate, dispatch }}
            year={peopleReceiveBenefit.year}
            data={peopleReceiveBenefit.data}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <MonthlyAllowanceCostChart
            {...{ years, translate, dispatch }}
            year={monthlyAllowanceCost.year}
            data={monthlyAllowanceCost.data}
          />
        </Grid>
      </Grid>

      <PaymentProgress
        {...{ years, translate, dispatch }}
        year={paymentProgress.year}
        data={paymentProgress.data}
      />

      <ContactBox {...{ translate }} />
    </DashboardLayout>
  );
}
