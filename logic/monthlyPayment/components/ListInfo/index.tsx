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
import { Date, Field, paymentUnit } from "../utils";

export function ListInfo(props: any) {
  const { dispatch, info, wards, period } = props;
  const { translate } = useLocales();
  const classes = styles();
  return (
    <>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>{translate("paymentList.code")}</InputLabel>
            <Select
              label={translate("paymentList.code")}
              value={`${info?.code !== undefined ? info?.code : ""}`}
              onChange={(e) =>
                dispatch({
                  type: "changeInfo",
                  name: "code",
                  value: e.target.value,
                })
              }
            >
              {period.map((val: any) => (
                <MenuItem key={val} value={val}>
                  {val}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Date
            {...{
              label: translate("paymentList.foundedDate"),
              value: info?.foundedDate,
              name: "foundedDate",
              dispatch: dispatch,
              type: "changeInfo",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
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
        <Grid item xs={12} sm={2}>
          <Autocomplete
            options={wards}
            getOptionLabel={(option: any) => option?.value || ""}
            onChange={(e, item) =>
              dispatch({
                type: "changeInfo",
                name: "ward",
                value: item,
              })
            }
            value={info?.ward || {}}
            loading
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={translate("paymentList.ward")}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>{translate("paymentList.paymentUnit")}</InputLabel>
            <Select
              label={translate("paymentList.paymentUnit")}
              value={`${info?.unit !== undefined ? info?.unit : ""}`}
              onChange={(e) =>
                dispatch({
                  type: "changeInfo",
                  name: "unit",
                  value: +e.target.value,
                })
              }
            >
              {Object.keys(paymentUnit).map((key: any) => (
                <MenuItem key={key} value={key}>
                  {paymentUnit[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={12}>
          <TextField
            className={classes.note}
            label={translate("recordsManagement.note")}
            multiline
            value={info?.note || ""}
            fullWidth
            onChange={(e) =>
              dispatch({
                type: "changeInfo",
                name: "note",
                value: e.target.value,
              })
            }
          />
        </Grid>
      </Grid>
    </>
  );
}
