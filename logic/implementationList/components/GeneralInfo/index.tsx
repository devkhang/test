import {
  Grid,
  TextField,
  Autocomplete,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
import { styles } from "logic/monthlyPayment";
import { Date, paymentUnit } from "logic/monthlyPayment/components/utils";

export function GeneralInfo(props: any) {
  const {
    dispatch,
    data: { info, wards, codes, unit, err },
  } = props;
  const { translate } = useLocales();
  const classes = styles();
  return (
    <>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label={translate("paymentList.district")}
            value={info?.district?.value || ""}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={wards}
            getOptionLabel={(option: any) => option?.value || ""}
            onChange={(e, item) =>
              dispatch({
                type: "selectWard",
                item,
              })
            }
            value={info?.ward || {}}
            loading
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={translate("paymentList.ward")}
                error={err?.ward || false}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>{`${translate("paymentList.code")} (*)`}</InputLabel>
            <Select
              label={`${translate("paymentList.code")} (*)`}
              value={`${info?.code !== undefined ? info?.code : ""}`}
              onChange={(e) =>
                dispatch({
                  type: "changeInfo",
                  name: "code",
                  value: e.target.value,
                })
              }
              error={err?.code || false}
            >
              {codes.map((option: any) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Date
            {...{
              label: translate("paymentList.receiveDate"),
              value: info?.receiveDate,
              name: "receiveDate",
              dispatch: dispatch,
              type: "changeInfo",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            label={translate("paymentList.paymentUnit")}
            value={paymentUnit[info?.unit] || paymentUnit[unit] || ""}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            className={classes.note}
            label={translate("recordsManagement.note")}
            multiline
            value={info?.executeNote || ""}
            fullWidth
            onChange={(e) =>
              dispatch({
                type: "changeInfo",
                name: "executeNote",
                value: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
    </>
  );
}
