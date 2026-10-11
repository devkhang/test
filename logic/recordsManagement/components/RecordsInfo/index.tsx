import { useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { recordsInfoReducer } from "./recordsInfoReducer";
import { columnsCM, columns, columnCM } from "./columns";
import { useReducer } from "@vna/lib/dist/commons";

import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import {
  TextInput,
  Table,
  Date,
  convertRewards,
  objects,
  burialGrave,
} from "../utils";
import { styles } from "../styles";
import { Loading } from "@vna/lib/dist/components";

interface Props {
  profile: string;
  categoryKey: string;
  errors: any;
}

const initialState = {
  data: { inprogressRevolution: [], inprogressJailed: [] },
  rowsCM: [],
  rows: [],
  oldRowsCM: [],
  oldRows: [],
  loading: false,
  err: {},
};

export function RecordsInfo(props: Props) {
  const { categoryKey, profile, errors } = props;
  const classes = styles();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const [state, dispatch] = useReducer({
    reducer: recordsInfoReducer,
    name: "recordsInfoReducer",
    initialState,
    translate,
    enqueueSnackbar,
    props,
  });

  useEffect(() => {
    dispatch("initial");
  }, [profile, categoryKey]);

  const { loading, data, rowsCM, rows, err } = state;
  return (
    <>
      <h4 className={classes.title}>{translate("recordsManagement.title")}</h4>
      <Loading loading={loading} className={classes.loading}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label={translate("recordsManagement.code")}
              required={true}
              value={data?.code || ""}
              error={data?.isErrorCode || errors?.code}
              helperText={
                data?.isErrorCode
                  ? translate("recordsManagement.isExisted")
                  : ""
              }
              onBlur={(e) =>
                dispatch({ type: "checkCode", value: e.target.value })
              }
              onChange={(e) =>
                dispatch({
                  type: "changeRecords",
                  name: "code",
                  value: e.target.value,
                })
              }
            />
          </Grid>
          {(categoryKey === "LT" || categoryKey === "TKN") && (
            <>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.dateJoinClan"),
                    value: data?.dateJoinClan,
                    name: "dateJoinClan",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.date"),
                    value: data?.date,
                    name: "date",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.position"),
                    value: data?.position,
                    name: "position",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.organ"),
                    value: data?.organ,
                    name: "organ",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.retire"),
                    value: data?.retire,
                    name: "retire",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "LT" && (
            <>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.startDateRevolution"),
                    value: data?.startDateRevolution,
                    name: "startDateRevolution",
                    dispatch: dispatch,
                    type: "changeRecords",
                    classes: classes?.textField,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.endDateRevolution"),
                    value: data?.endDateRevolution,
                    name: "endDateRevolution",
                    dispatch: dispatch,
                    type: "changeRecords",
                    classes: classes.textField,
                  }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "TKN" && (
            <>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.roleRevolution"),
                    value: data?.roleRevolution,
                    name: "roleRevolution",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.takeOfficeDate"),
                    value: data?.takeOfficeDate,
                    name: "takeOfficeDate",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "LS" && (
            <>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.degreeTQGC"),
                    value: data?.degree,
                    name: "degree",
                    dispatch: dispatch,
                    type: "changeRecords",
                    err: errors?.degree,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.decidedTQGC"),
                    value: data?.decided,
                    name: "decided",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.timeDegree"),
                    value: data?.decidedDate,
                    name: "decidedDate",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.deathCertificateNum"),
                    value: data?.deathCertificateNum,
                    name: "deathCertificateNum",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.deathCertificateDate"),
                    value: data?.deathCertificateDate,
                    name: "deathCertificateDate",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.of"),
                    value: data?.of,
                    name: "of",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>
                    {translate("recordsManagement.objectTo")}
                  </InputLabel>
                  <Select
                    label={translate("recordsManagement.objectTo")}
                    value={`${data?.object !== undefined ? data?.object : ""}`}
                    onChange={(e) =>
                      dispatch({
                        type: "changeRecords",
                        name: "object",
                        value: e.target.value,
                      })
                    }
                  >
                    {objects.map((value: any) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>
                    {translate("recordsManagement.burialGrave")}
                  </InputLabel>
                  <Select
                    label={translate("recordsManagement.burialGrave")}
                    value={`${
                      data?.burialGrave !== undefined ? data?.burialGrave : ""
                    }`}
                    onChange={(e) =>
                      dispatch({
                        type: "changeRecords",
                        name: "burialGrave",
                        value: e.target.value,
                      })
                    }
                  >
                    {burialGrave.map((value: any) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}
          {(categoryKey === "BM" ||
            categoryKey === "AHLL" ||
            categoryKey === "AHKC") && (
            <>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate(
                      categoryKey === "BM"
                        ? "recordsManagement.organManagerHsg"
                        : "recordsManagement.organManager"
                    ),
                    value: data?.organManager,
                    name: "organManager",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.decidedPTDH"),
                    value: data?.decided,
                    name: "decided",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.decidedDate"),
                    value: data?.decidedDate,
                    name: "decidedDate",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
            </>
          )}
          {(categoryKey === "AHLL" || categoryKey === "AHKC") && (
            <Grid item xs={12} sm={3}>
              <TextInput
                {...{
                  label: translate("recordsManagement.decisionKind"),
                  value: data?.decisionKind,
                  name: "decisionKind",
                  dispatch: dispatch,
                  type: "changeRecords",
                }}
              />
            </Grid>
          )}
          {categoryKey === "AQ" && (
            <>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate(
                      "recordsManagement.injuredCertificateNumber"
                    ),
                    value: data?.injured,
                    name: "injured",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.injuredVerifyDate"),
                    value: data?.verifyDate,
                    name: "verifyDate",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.injuredDate"),
                    value: data?.injuredDate,
                    name: "injuredDate",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.inspectionNum"),
                    value: data?.inspectionNum,
                    name: "inspectionNum",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.inspectionDate"),
                    value: data?.inspectionDate,
                    name: "inspectionDate",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.inspectionBoard"),
                    value: data?.inspectionBoard,
                    name: "inspectionBoard",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "BB" && (
            <>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate(
                      "recordsManagement.sickSoldierCertificateNumber"
                    ),
                    value: data?.injured,
                    name: "injured",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.sickSoldierVerifyDate"),
                    value: data?.verifyDate,
                    name: "verifyDate",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
            </>
          )}
          {(categoryKey === "BB" || categoryKey === "HH") && (
            <>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.medicalAssessmentNum"),
                    value: data?.medicalAssessmentNum,
                    name: "medicalAssessmentNum",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.medicalAssessmentDate"),
                    value: data?.medicalAssessmentDate,
                    name: "medicalAssessmentDate",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.of"),
                    value: data?.of,
                    name: "of",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "BB" && (
            <Grid item xs={12} sm={3}>
              <TextInput
                {...{
                  label: translate("recordsManagement.medicalCondition"),
                  value: data?.medicalCondition,
                  name: "medicalCondition",
                  dispatch: dispatch,
                  type: "changeRecords",
                }}
              />
            </Grid>
          )}
          {categoryKey === "HH" && (
            <>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.certificationNum"),
                    value: data?.certificationNum,
                    name: "certificationNum",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.certificationDate"),
                    value: data?.certificationDate,
                    name: "certificationDate",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.ofCDHH"),
                    value: data?.ofCDHH,
                    name: "ofCDHH",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
            </>
          )}
          {(categoryKey === "KC" || categoryKey === "CC") && (
            <>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>
                    {translate("recordsManagement.reward")}
                  </InputLabel>
                  <Select
                    label={translate("recordsManagement.reward")}
                    value={`${data?.reward !== undefined ? data?.reward : ""}`}
                    onChange={(e) =>
                      dispatch({
                        type: "changeRecords",
                        name: "reward",
                        value: +e.target.value,
                      })
                    }
                  >
                    {Object.keys(convertRewards)
                      .filter((i: any) =>
                        categoryKey === "KC"
                          ? !["9", "10", "11"].includes(i)
                          : ["9", "10", "11"].includes(i)
                      )
                      .map((key: any) => (
                        <MenuItem key={key} value={key}>
                          {convertRewards[key]}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextInput
                  {...{
                    label: translate("recordsManagement.decidedPTDH"),
                    value: data?.decided,
                    name: "decided",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.decidedDate"),
                    value: data?.decidedDate,
                    name: "decidedDate",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
            </>
          )}
          {categoryKey === "KC" && (
            <>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.startDateKC"),
                    value: data?.startDateRevolution,
                    name: "startDateRevolution",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Date
                  {...{
                    label: translate("recordsManagement.endDateKC"),
                    value: data?.endDateRevolution,
                    name: "endDateRevolution",
                    dispatch: dispatch,
                    type: "changeRecords",
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>

        {(categoryKey === "LT" ||
          categoryKey === "BM" ||
          categoryKey === "AHLL" ||
          categoryKey === "AHKC") && (
          <TextField
            className={classes.note}
            label={translate("recordsManagement.note")}
            multiline
            value={data?.note || ""}
            fullWidth
            onChange={(e) =>
              dispatch({
                type: "changeRecords",
                name: "note",
                value: e.target.value,
              })
            }
          />
        )}
        {(categoryKey === "TKN" || categoryKey === "LS") && (
          <TextField
            className={classes.note}
            label={translate("recordsManagement.revolutionCM")}
            multiline
            value={data?.note || ""}
            fullWidth
            onChange={(e) =>
              dispatch({
                type: "changeRecords",
                name: "note",
                value: e.target.value,
              })
            }
          />
        )}
        {categoryKey === "CC" && (
          <TextField
            className={classes.note}
            label={translate("recordsManagement.situation")}
            multiline
            value={data?.note || ""}
            fullWidth
            onChange={(e) =>
              dispatch({
                type: "changeRecords",
                name: "note",
                value: e.target.value,
              })
            }
          />
        )}
      </Loading>
      {categoryKey === "HH" && (
        <>
          <h3 className={classes.title}>
            {translate("recordsManagement.revolutionKC")}
          </h3>
          <Table
            {...{
              loading: loading,
              columns: columnCM,
              rows: rowsCM,
              data: data?.inprogressRevolution,
              errors: err,
              classes,
              dispatch,
            }}
          />
        </>
      )}
      {categoryKey === "BT" && (
        <>
          <h3 className={classes.title}>
            {translate("recordsManagement.inprogressRevolution")}
          </h3>
          <Table
            {...{
              loading: loading,
              columns: columnsCM,
              rows: rowsCM,
              data: data?.inprogressRevolution,
              errors: err,
              classes,
              dispatch,
            }}
          />
          <br />
          <h3 className={classes.title}>
            {translate("recordsManagement.inprogressJailed")}
          </h3>
          <Table
            {...{
              loading: loading,
              columns,
              rows,
              data: data?.inprogressJailed,
              errors: err,
              classes,
              dispatch,
            }}
          />
        </>
      )}
    </>
  );
}
