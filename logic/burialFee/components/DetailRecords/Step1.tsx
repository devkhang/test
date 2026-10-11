import React from "react";
import { Autocomplete, Button, Grid, TextField } from "@material-ui/core";
import moment from "moment";
import { styles } from "./style";
import { ShowDetailRecord } from "logic/recordsManagement/components";
import _ from "lodash";
import { Loading } from "@vna/lib/dist/components";

const Step1 = ({
  step1,
  doet,
  wards,
  categories,
  profiles,
  dispatch,
  listRelative,
  translate,
  loading,
}: any) => {
  const classes = styles();

  const profile = step1.profile;
  const fullAddress = profile
    ? `${profile?.address || ""}, ${profile?.ward?.value || ""}, ${
        profile?.district?.value || ""
      }, ${profile?.province?.value || ""}`
    : "";

  const deadTime = listRelative[0]?.dateOfNccDeath
    ? moment(listRelative[0]?.dateOfNccDeath).format("L")
    : profile?.infoNcc[0]?.dead;

  return (
    <>
      <h3> {translate("steps.recordInfo")}</h3>
      <br />
      {!!step1?.showBT && (
        <>
          <Button
            variant="contained"
            className={classes.btn}
            onClick={() => dispatch("showDetail")}
          >
            {translate("burialFee.review")}
          </Button>
          <br />
        </>
      )}
      <Loading loading={loading}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled={!!step1.isEdit}
              label={translate("common.district")}
              value={doet?.district?.value || ""}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={wards}
              value={step1.ward || {}}
              getOptionLabel={(option: any) => option.value || ""}
              onChange={(e, value) => {
                dispatch({ type: "onChangeWard", payload: { value } });
              }}
              disabled={!!step1.isEdit}
              disableClearable
              loadingText="Đang tải..."
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={translate("common.ward")}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={categories}
              value={step1.category || {}}
              getOptionLabel={(option: any) => option.name || ""}
              onChange={(e, value) => {
                dispatch({ type: "onChangeCategory", payload: { value } });
              }}
              disabled={!!step1.isEdit}
              disableClearable
              loadingText="Đang tải..."
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={translate("paymentList.category")}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={profiles}
              value={step1.profile || {}}
              getOptionLabel={(option: any) => {
                const value =
                  (option?.code || "") + "-" + (option?.fullName || "");
                return _.isEmpty(value.replace(/-/g, "")) ? "" : value;
              }}
              onChange={(e, value) => {
                dispatch({ type: "onChangeProfile", payload: { value } });
              }}
              disabled={!!step1.isEdit}
              disableClearable
              loadingText="Đang tải..."
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={translate("recordsManagement.code")}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} marginTop={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              label={translate("common.fullName")}
              value={step1.profile?.fullName || ""}
              className={classes.disabled}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              label={translate("userManager.dateOfBirth")}
              value={step1.profile?.dateOfBirth || ""}
              className={classes.disabled}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              label={translate("recordsManagement.nativePlace")}
              value={step1.profile?.nativePlace || ""}
              className={classes.disabled}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              label={translate("burialFee.deadTime")}
              value={deadTime || ""}
              className={classes.disabled}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} marginTop={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              disabled
              label={translate("recordsManagement.address")}
              value={fullAddress}
              className={classes.disabled}
            />
          </Grid>
        </Grid>
      </Loading>
      <ShowDetailRecord
        showDetail={step1?.showDetail || 0}
        row={{ id: step1?.profile?.id || "" }}
        categoryKey={
          categories.find((i) => i?.id === step1?.profile?.categoryId)?.key ||
          ""
        }
      />
    </>
  );
};

export default Step1;
