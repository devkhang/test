import React from "react";
import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@material-ui/core";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import { styles } from "./style";
import NumberFormat from "react-number-format";
import { Loading } from "@vna/lib/dist/components";

const mtpType = [
  "recordsManagement.burialFeeOne",
  "recordsManagement.burialFeeMont",
];

const renderGrid = (type: number) => {
  return type === 0 //1lan
    ? [
        { name: "sumSubsidies", label: "burialFee.oneSubsidy" },
        { name: "deadMoney", label: "burialFee.deadMoneyMonth" },
      ]
    : [
        { name: "sumSubsidy", label: "burialFee.sumSubsidy" },
        { name: "sumAllowance", label: "burialFee.sumAllowance" },
        { name: "month3", label: "burialFee.3Month" },
        { name: "deadMoney", label: "burialFee.deadMoney" },
      ];
};

const Step3 = ({ dispatch, step3, loading }: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const classes = styles();
  const renderUi = renderGrid(step3?.type);

  return (
    <>
      <h3>{translate("burialFee.inforBurialFee")}</h3>
      <br />
      <Loading loading={loading}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>{translate("burialFee.type")}</InputLabel>
              <Select
                label={translate("burialFee.type")}
                value={`${step3?.type !== undefined ? step3?.type : ""}`}
                onChange={(e) =>
                  dispatch({
                    type: "onChange",
                    name: "type",
                    value: e?.target?.value,
                  })
                }
              >
                {mtpType.map((key: any, index: number) => (
                  <MenuItem key={key} value={index}>
                    {translate(mtpType[index])}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label={translate("recordsManagement.decidedPTDHIp")}
              value={step3?.decided}
              onChange={(e) =>
                dispatch({
                  type: "onChange",
                  name: "decided",
                  value: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label={translate("recordsManagement.decidedDateIp")}
                inputFormat="dd/MM/yyyy"
                value={step3?.decidedDate || null}
                renderInput={(params: any) => (
                  <TextField {...params} fullWidth helperText={false} />
                )}
                onChange={(e) =>
                  dispatch({ type: "onChange", name: "decidedDate", value: e })
                }
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label={translate("burialFee.decidedPerson")}
              value={step3?.decidedPerson}
              onChange={(e) =>
                dispatch({
                  type: "onChange",
                  name: "decidedPerson",
                  value: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} marginTop={2}>
          {[0, 1].includes(step3?.type) &&
            renderUi.map((i: any) => {
              return (
                <Grid item xs={12} sm={3}>
                  <NumberFormat
                    customInput={TextField}
                    thousandsGroupStyle="thousand"
                    value={step3[i.name] || ""}
                    decimalSeparator="."
                    displayType="input"
                    label={translate(i?.label)}
                    type="text"
                    fullWidth
                    className={classes.disabled}
                    disabled
                    thousandSeparator={true}
                    allowNegative={false}
                    onChange={(e) =>
                      dispatch({
                        type: "onChange",
                        name: "mtp",
                        value: e.target.value,
                      })
                    }
                  />
                </Grid>
              );
            })}
          <Grid item xs={12} sm={3}>
            <NumberFormat
              customInput={TextField}
              thousandsGroupStyle="thousand"
              value={step3?.fee}
              decimalSeparator="."
              displayType="input"
              label={translate("burialFee.mtpMoney")}
              type="text"
              fullWidth
              thousandSeparator={true}
              allowNegative={false}
              onChange={(e) =>
                dispatch({
                  type: "onChange",
                  name: "fee",
                  value: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label={translate("burialFee.stopDate")}
                inputFormat="dd/MM/yyyy"
                value={step3?.stopDate || null}
                renderInput={(params: any) => (
                  <TextField {...params} fullWidth helperText={false} />
                )}
                onChange={(e) =>
                  dispatch({ type: "onChange", name: "stopDate", value: e })
                }
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label={translate("burialFee.mtpDate")}
                inputFormat="dd/MM/yyyy"
                value={step3?.startDate || null}
                renderInput={(params: any) => (
                  <TextField {...params} fullWidth helperText={false} />
                )}
                onChange={(e) =>
                  dispatch({ type: "onChange", name: "startDate", value: e })
                }
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Loading>
    </>
  );
};

export default Step3;
