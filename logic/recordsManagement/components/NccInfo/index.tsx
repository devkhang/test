import { useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Stack,
  InputAdornment,
  Input,
} from "@material-ui/core";
import { useReducer } from "@vna/lib/dist/commons";
import { useSnackbar } from "notistack";
import { nccInfoReducer } from "./nccInfoReducer";
import useLocales from "src/hooks/useLocales";
import NumberFormat from "react-number-format";

import { columns } from "./columns";
import { TextInput, Table, Date, gender } from "../utils";
import { styles } from "../styles";
import NCCmove from "./NCCmove";
import { Loading } from "@vna/lib/dist/components";

interface Props {
  profile: string;
  categoryKey: string;
  provinces: any;
  errors: any;
}

const initialState = {
  districts: [],
  wards: [],
  moves: [],
  ethnic: [],
  move: {},
  data: { disabilitiesChildren: [], htc: {} },
  rows: [],
  oldRows: [],
  loading: false,
  type: null,
};

export function NccInfo(props: Props) {
  const { provinces, categoryKey, profile, errors } = props;

  const classes = styles();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();

  const [state, dispatch] = useReducer({
    reducer: nccInfoReducer,
    name: "nccInfoReducer",
    initialState,
    enqueueSnackbar,
    translate,
    props,
  });

  useEffect(() => {
    dispatch("initial");
  }, [profile]);

  const { loading, rows, data, move, type, districts, wards, ethnic } = state;
  return (
    <>
      <h4 className={classes.title}>{translate("recordsManagement.title")}</h4>
      {(categoryKey === "HH" || categoryKey === "BT") && (
        <h4 className={classes.title3}>
          {translate("recordsManagement.declaration")}
        </h4>
      )}
      <Loading loading={loading} className={classes.loading}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={3}>
            <TextInput
              {...{
                label: translate("common.fullName"),
                required: true,
                value: data?.fullName,
                name: "fullName",
                dispatch,
                type: "changeNccInfo",
                err: errors?.fullName,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextInput
              {...{
                label: translate("recordsManagement.dateOfBirth"),
                value: data?.dateOfBirth,
                name: "dateOfBirth",
                dispatch,
                type: "changeNccInfo",
                err: errors?.dateOfBirth,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>{translate("common.gender")}</InputLabel>
              <Select
                label={translate("common.gender")}
                value={`${data?.gender !== undefined ? data?.gender : ""}`}
                onChange={(e) =>
                  dispatch({
                    type: "changeNccInfo",
                    name: "gender",
                    value: +e.target.value,
                  })
                }
              >
                {Object.keys(gender).map((key: any) => (
                  <MenuItem key={key} value={key}>
                    {gender[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {categoryKey === "LS" && (
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label={translate("recordsManagement.deadTime")}
                value={data?.dead || ""}
                onChange={(e) =>
                  dispatch({
                    type: "changeNccInfo",
                    name: "dead",
                    value: e.target.value,
                  })
                }
              />
            </Grid>
          )}
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={ethnic}
              getOptionLabel={(option: any) => option?.name || ""}
              onChange={(e, item) =>
                dispatch({
                  type: "changeSelect",
                  name: "ethnic",
                  item,
                })
              }
              value={data?.ethnic || {}}
              loading
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={translate("common.ethnic")}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextInput
              {...{
                label: translate("recordsManagement.identityCard"),
                value: data?.identityCard,
                name: "identityCard",
                dispatch,
                type: "changeNccInfo",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Date
              {...{
                label: translate("recordsManagement.supplyDate"),
                value: data?.date,
                name: "date",
                dispatch,
                type: "changeNccInfo",
              }}
            />
          </Grid>
          {categoryKey !== "LS" && (
            <Grid item xs={12} sm={3}>
              <Autocomplete
                options={provinces}
                getOptionLabel={(option: any) => option?.value || ""}
                onChange={(e, item) =>
                  dispatch({ type: "changeSelect", name: "place", item })
                }
                value={data?.place || {}}
                loading
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label={translate("recordsManagement.place")}
                  />
                )}
              />
            </Grid>
          )}
          {categoryKey === "LS" && (
            <>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.enlistmentDate"),
                    value: data?.enlistmentDate,
                    name: "enlistmentDate",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.level"),
                    value: data?.level,
                    name: "level",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.sacrificialUnit"),
                    value: data?.sacrificialUnit,
                    name: "sacrificialUnit",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.sacrificialPlace"),
                    value: data?.sacrificialPlace,
                    name: "sacrificialPlace",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.sacrificialCase"),
                    value: data?.sacrificialCase,
                    name: "sacrificialCase",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
            </>
          )}

          {categoryKey === "BB" && (
            <>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.enlistmentTime"),
                    value: data?.enlistmentDate,
                    name: "enlistmentDate",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.enlistmentUnit"),
                    value: data?.enlistmentUnit,
                    name: "enlistmentUnit",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.demobilizationTime"),
                    value: data?.demobilizationTime,
                    name: "demobilizationTime",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.demobilizationUnit"),
                    value: data?.demobilizationUnit,
                    name: "demobilizationUnit",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.demobilizationRank"),
                    value: data?.demobilizationRank,
                    name: "demobilizationRank",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  className={classes.txtField}
                  value=""
                  label={translate("recordsManagement.CATime")}
                  InputProps={{
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Input
                            className={classes.minWidth}
                            type="number"
                            value={`${data?.CATime1}` || ""}
                            onChange={(e) =>
                              dispatch({
                                type: "changeNccInfo",
                                name: "CATime1",
                                value: +e.target.value || null,
                              })
                            }
                          />
                          {translate("statisticReport.year")}
                        </InputAdornment>
                        <InputAdornment position="end">
                          <Input
                            className={classes.minWidth}
                            type="number"
                            value={`${data?.CATime2}` || ""}
                            onChange={(e) =>
                              dispatch({
                                type: "changeNccInfo",
                                name: "CATime2",
                                value: +e.target.value || null,
                              })
                            }
                          />
                          {translate("statisticReport.month")}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  className={classes.txtField}
                  label={translate("recordsManagement.CTTime")}
                  value=""
                  InputProps={{
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Input
                            className={classes.minWidth}
                            type="number"
                            value={`${data?.CTTime1}` || ""}
                            onChange={(e) =>
                              dispatch({
                                type: "changeNccInfo",
                                name: "CTTime1",
                                value: +e.target.value || null,
                              })
                            }
                          />
                          {translate("statisticReport.year")}
                        </InputAdornment>
                        <InputAdornment position="end">
                          <Input
                            className={classes.minWidth}
                            type="number"
                            value={`${data?.CTTime2}` || ""}
                            onChange={(e) =>
                              dispatch({
                                type: "changeNccInfo",
                                name: "CTTime2",
                                value: +e.target.value || null,
                              })
                            }
                          />
                          {translate("statisticReport.month")}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  className={classes.txtField}
                  label={translate("recordsManagement.KKTime")}
                  value=""
                  InputProps={{
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <Input
                            className={classes.minWidth}
                            type="number"
                            value={`${data?.KKTime1}` || ""}
                            onChange={(e) =>
                              dispatch({
                                type: "changeNccInfo",
                                name: "KKTime1",
                                value: +e.target.value || null,
                              })
                            }
                          />
                          {translate("statisticReport.year")}
                        </InputAdornment>
                        <InputAdornment position="end">
                          <Input
                            className={classes.minWidth}
                            type="number"
                            value={`${data?.KKTime2}` || ""}
                            onChange={(e) =>
                              dispatch({
                                type: "changeNccInfo",
                                name: "KKTime2",
                                value: +e.target.value || null,
                              })
                            }
                          />
                          {translate("statisticReport.month")}
                        </InputAdornment>
                      </>
                    ),
                  }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "AQ" && (
            <>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.enlistmentTime"),
                    value: data?.enlistmentDate,
                    name: "enlistmentDate",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.organ"),
                    value: data?.unit,
                    name: "unit",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.rank"),
                    value: data?.rank,
                    name: "rank",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.injuredPlace"),
                    value: data?.injuredPlace,
                    name: "injuredPlace",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.injuredCase"),
                    value: data?.injuredCase,
                    name: "injuredCase",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.injuredCondition"),
                    value: data?.injuredCondition,
                    name: "injuredCondition",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "HH" && (
            <>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.enlistmentTime"),
                    value: data?.enlistmentDate,
                    name: "enlistmentDate",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.proof"),
                    value: data?.proof,
                    name: "proof",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.organ"),
                    value: data?.unit,
                    name: "unit",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.disabilityCondition"),
                    value: data?.disabilityCondition,
                    name: "disabilityCondition",
                    dispatch,
                    type: "changeNccInfo",
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Loading>
      {categoryKey === "HH" && (
        <>
          <h4 className={classes.title}>
            {translate("recordsManagement.declarationCD")}
          </h4>
          <Table
            {...{
              loading: loading,
              columns,
              rows,
              data: data?.disabilitiesChildren,
              classes,
              dispatch,
            }}
          />
        </>
      )}
      {categoryKey === "BT" && (
        <>
          <h4 className={classes.title}>
            {translate("recordsManagement.declarationTC")}
          </h4>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={3}>
              <TextInput
                {...{
                  label: translate("recordsManagement.decidedNum"),
                  value: data?.htc?.decided,
                  name: "decided",
                  dispatch,
                  type: "changeNccInfo",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Date
                {...{
                  label: translate("recordsManagement.decisionDate"),
                  value: data?.htc?.decidedDate,
                  name: "decidedDate",
                  dispatch,
                  type: "changeNccInfo",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextInput
                {...{
                  label: translate("recordsManagement.supplyOrgan"),
                  value: data?.htc?.organ,
                  name: "organ",
                  dispatch,
                  type: "changeNccInfo",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <NumberFormat
                fullWidth
                customInput={TextField}
                label={translate("recordsManagement.subsidy")}
                thousandsGroupStyle="thousand"
                value={data?.htc?.subsidy || ""}
                decimalSeparator="."
                displayType="input"
                type="text"
                thousandSeparator={true}
                allowNegative={false}
                onChange={(e) =>
                  dispatch({
                    type: "changeNccInfo",
                    name: "subsidy",
                    value: e.target.value,
                  })
                }
              />
            </Grid>
          </Grid>
        </>
      )}

      <h3 className={classes.title}>
        {translate("recordsManagement.titleNCCMove")}
      </h3>
      <NCCmove
        dispatch={dispatch}
        data={{ provinces, move, type, districts, wards }}
      />
    </>
  );
}
