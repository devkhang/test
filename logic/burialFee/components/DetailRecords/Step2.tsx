import React from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import { styles } from "./style";
import moment from "moment";
import useLocales from "src/hooks/useLocales";
import { Loading } from "@vna/lib/dist/components";

const Step2 = ({ dispatch, listRelative, translate, loading }: any) => {
  const classes = styles();
  const mainBeneficiary = (listRelative || []).find(
    (beneficiary: any) => beneficiary.status
  );

  return (
    <>
      <h3>{translate("burialFee.inforReceiverBurialFee")}</h3>
      <br />
      <Button
        variant="contained"
        className={classes.btn}
        onClick={() => dispatch("replace")}
      >
        {translate("burialFee.replace")}
      </Button>
      <br />
      <Loading loading={loading}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label={translate("common.fullName")}
              value={mainBeneficiary?.fullName || ""}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              label={translate("userManager.dateOfBirth")}
              value={mainBeneficiary?.dateOfBirth || ""}
              className={classes.disabled}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              label={translate("common.gender")}
              value={mainBeneficiary?.gender === 1 ? "Nữ" : "Nam"}
              className={classes.disabled}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              label={translate("burialFee.relationship")}
              value={mainBeneficiary?.relation || ""}
              className={classes.disabled}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} marginTop={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              label={translate("recordsManagement.nativePlace")}
              value={mainBeneficiary?.nativePlace || ""}
              className={classes.disabled}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              label={translate("burialFee.province")}
              value={mainBeneficiary?.province?.value || ""}
              className={classes.disabled}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              label={translate("burialFee.district")}
              value={mainBeneficiary?.district?.value || ""}
              className={classes.disabled}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              disabled
              label={translate("burialFee.ward")}
              value={mainBeneficiary?.ward?.value || ""}
              className={classes.disabled}
            />
          </Grid>
        </Grid>
      </Loading>
    </>
  );
};

export default Step2;
