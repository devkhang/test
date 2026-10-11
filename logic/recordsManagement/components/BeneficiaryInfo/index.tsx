import { useEffect } from "react";
import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import { useReducer } from "@vna/lib/dist/commons";
import {
  Grid,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Checkbox,
  Button,
} from "@material-ui/core";
import { beneficiaryInfoReducer } from "./beneficiaryInfoReducer";
import {
  TextInput,
  UploadFile,
  Date,
  gender,
  relation,
  beneficiaryObjects,
} from "../utils";
import { styles } from "../styles";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import { columns, columnsRelative } from "./columns";
import TableRelative from "./TableRelative";

interface Props {
  profile: string;
  categoryKey: string;
  provinces: any;
  doet: any;
  isAdd: any;
  errors: any;
}

const initialState = {
  data: { beneficiary: false, relative: false },
  oldData: {},
  users: [],
  files: [],
  provinces: [],
  districts: [],
  wards: [],
  disabled: true,
  checked: false,
  checkRelative: false,
  loading: false,
  relative: "",
  list: [],
  open: false,
  oldId: "",
  isEdit: false,
  isAdd: false,
  rowsRe: [],
  // oldRows: [],
};

export function BeneficiaryInfo(props: Props) {
  const { categoryKey, profile, errors } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
  const classes = styles();

  const [state, dispatch] = useReducer({
    name: "beneficiaryInfoReducer",
    reducer: beneficiaryInfoReducer,
    enqueueSnackbar,
    translate,
    initialState,
    props,
  });

  const {
    rowsRe,
    data,
    users,
    files,
    disabled,
    relative,
    checked,
    checkRelative,
    loading,
    provinces,
    districts,
    wards,
    list,
    open,
    isEdit,
  } = state;

  useEffect(() => {
    dispatch("initial");
  }, [profile]);

  return (
    <>
      <h4 className={classes.title}>{translate("recordsManagement.title")}</h4>
      {categoryKey !== "LS" && (
        <FormControl component="fieldset">
          <RadioGroup row value={relative}>
            <FormControlLabel
              value="infoBeneficiary"
              control={
                <Radio
                  onChange={() =>
                    dispatch({ type: "setRelative", name: "beneficiary" })
                  }
                />
              }
              label={translate("recordsManagement.beneficiaryInfo")}
            />
            <FormControlLabel
              value="infoRelative"
              control={
                <Radio
                  onChange={() =>
                    dispatch({ type: "setRelative", name: "relative" })
                  }
                />
              }
              label={translate("recordsManagement.relativeInfo")}
            />
          </RadioGroup>
        </FormControl>
      )}

      {categoryKey !== "LS" ? (
        <h3 className={classes.title}>
          {data.relative
            ? translate("recordsManagement.relativeInfo")
            : translate("recordsManagement.beneficiaryInfo")}
        </h3>
      ) : (
        <h3 className={classes.title2}>
          {translate("recordsManagement.declarationInfo")}
        </h3>
      )}
      <Grid container spacing={5}>
        {categoryKey !== "LS" && (
          <Grid container item spacing={5}>
            {data.beneficiary && categoryKey !== "LS" && !isEdit && (
              <Grid xs={12} sm={4} className={classes.gridItem}>
                <FormControlLabel
                  label={translate("recordsManagement.useNccInfo")}
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={() => {
                        dispatch("handleCheck");
                      }}
                    />
                  }
                />
              </Grid>
            )}
            {relative === "infoRelative" && !!profile && categoryKey !== "LS" && (
              <Grid xs={12} sm={4} className={classes.gridItem}>
                <FormControlLabel
                  label={translate("recordsManagement.useNthInfo")}
                  control={
                    <Checkbox
                      checked={checkRelative}
                      onChange={() => {
                        dispatch("checkRelative");
                      }}
                    />
                  }
                />
              </Grid>
            )}
            {!!profile && (data.relative || data.beneficiary) && (
              <Grid xs={12} sm={4} className={classes.gridItem}>
                <Button
                  disabled={disabled}
                  variant="text"
                  onClick={() =>
                    dispatch({
                      type: "addNew",
                      name: data.beneficiary ? "beneficiary" : "relative",
                    })
                  }
                >
                  {translate("common.add")}
                </Button>
              </Grid>
            )}
            {!!profile && data.beneficiary && (
              <Grid xs={12} sm={4} className={classes.gridItem}>
                <Button
                  variant="text"
                  onClick={() =>
                    dispatch({
                      type: "showList",
                      name: "beneficiary",
                    })
                  }
                >
                  {translate("recordsManagement.beneficiaryList")}
                </Button>
              </Grid>
            )}
            {!!profile && data.relative && (
              <Grid xs={12} sm={4} className={classes.gridItem}>
                <Button
                  variant="text"
                  onClick={() =>
                    dispatch({
                      type: "showList",
                      name: "relative",
                    })
                  }
                >
                  {translate("recordsManagement.relativeList")}
                </Button>
              </Grid>
            )}
          </Grid>
        )}
        <Grid item xs={12} sm={3}>
          <TextInput
            {...{
              label: translate("common.fullName"),
              disabled,
              required: true,
              value: data?.fullName,
              name: "fullName",
              dispatch,
              type: "changeNthInfo",
              err: errors?.bFullName,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextInput
            {...{
              label: translate("userManager.dateOfBirth"),
              disabled,
              value: data?.dateOfBirth,
              name: "dateOfBirth",
              dispatch,
              type: "changeNthInfo",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel>{translate("common.gender")}</InputLabel>
            <Select
              label={translate("common.gender")}
              disabled={disabled}
              value={`${data?.gender !== undefined ? data?.gender : ""}`}
              onChange={(e) =>
                dispatch({
                  type: "changeNthInfo",
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
        <Grid item xs={12} sm={3}>
          <TextInput
            {...{
              label: translate("recordsManagement.identityCard"),
              disabled,
              required: false,
              value: data?.identityCard,
              name: "identityCard",
              dispatch,
              type: "changeNthInfo",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Date
            {...{
              label: translate("recordsManagement.supplyDate"),
              disable: disabled,
              value: data?.date,
              name: "date",
              dispatch,
              type: "changeNthInfo",
              classes: classes?.textField,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={provinces}
            getOptionLabel={(option: any) => option?.value || ""}
            onChange={(e, item) =>
              dispatch({ type: "changePlace", name: "place", item })
            }
            value={data?.place || {}}
            disabled={disabled}
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
        <Grid item xs={12} sm={3}>
          <TextInput
            {...{
              label: translate("recordsManagement.nativePlace"),
              disabled,
              value: data?.nativePlace,
              name: "nativePlace",
              dispatch,
              type: "changeNthInfo",
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={provinces}
            getOptionLabel={(option: any) => option?.value || ""}
            onChange={(e, item) =>
              dispatch({
                type: "selectAuto",
                name: "province",
                item,
              })
            }
            value={data?.province || {}}
            disabled={disabled}
            loading
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={translate("recordsManagement.province")}
                className={classes.textField}
                error={errors?.bProvince}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={districts}
            getOptionLabel={(option: any) => option?.value || ""}
            onChange={(e, item) =>
              dispatch({
                type: "selectAuto",
                name: "district",
                item,
              })
            }
            value={data?.district || {}}
            disabled={disabled}
            loading
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={translate("recordsManagement.district")}
                className={classes.textField}
                error={errors?.bDistrict}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Autocomplete
            options={wards}
            getOptionLabel={(option: any) => option?.value || ""}
            onChange={(e, item) =>
              dispatch({
                type: "selectAuto",
                name: "ward",
                item,
              })
            }
            value={data?.ward || {}}
            disabled={disabled}
            loading
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={translate("recordsManagement.ward")}
                className={classes.textField}
                error={errors?.bWard}
              />
            )}
          />
        </Grid>
        {(data.beneficiary ||
          (!data.relative && !data.beneficiary) ||
          (categoryKey === "LS" && !!profile)) && (
          <Grid item xs={12} sm={3}>
            <TextInput
              {...{
                label: translate("recordsManagement.address"),
                disabled,
                required: false,
                value: data?.address,
                name: "address",
                dispatch,
                type: "changeNthInfo",
              }}
            />
          </Grid>
        )}
        {data.relative && categoryKey !== "LS" && (
          <Grid item xs={12} sm={3}>
            <Date
              {...{
                label: translate("recordsManagement.dateOfNccDeath"),
                disable: disabled,
                value: data?.dateOfNccDeath,
                name: "dateOfNccDeath",
                dispatch,
                type: "changeNthInfo",
                classes: classes?.textField,
                //err: errors?.bDateOfNccDeath,
              }}
            />
          </Grid>
        )}
        {!data.isNcc && (
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>{translate("recordsManagement.relation")}</InputLabel>
              <Select
                label={translate("recordsManagement.relation")}
                disabled={disabled}
                value={`${data?.relation !== undefined ? data?.relation : ""}`}
                //error={errors?.bRelation}
                onChange={(e) =>
                  dispatch({
                    type: "changeNthInfo",
                    name: "relation",
                    value: e.target.value,
                  })
                }
              >
                {relation.map((value: any) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
        {data.relative && (
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>
                {translate("recordsManagement.beneficiaryObj")}
              </InputLabel>
              <Select
                label={translate("recordsManagement.beneficiaryObj")}
                disabled={disabled}
                value={`${
                  data?.beneficiaryObj !== undefined ? data?.beneficiaryObj : ""
                }`}
                onChange={(e) =>
                  dispatch({
                    type: "changeNthInfo",
                    name: "beneficiaryObj",
                    value: e.target.value,
                  })
                }
              >
                {beneficiaryObjects.map((value: any) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>
      {/* <h3 className={classes.title}>
        {translate("recordsManagement.suggestionBoard")}
      </h3>
      <Loading loading={loading}>
        <CommonTable
          columns={columns}
          rows={users}
          data={{ translate }}
          event={(type: string, data: any) =>
            (ele: any, ...rest: any) => {
              dispatch({ type, data, ele, rest });
            }}
          classes={classes}
        />
      </Loading> */}

      {data.relative && categoryKey !== "LS" && (
        <>
          <h3 className={classes.title}>
            {translate("recordsManagement.attachments")}
          </h3>
          <Grid xs={12} sm={4}>
            <UploadFile {...{ files: files, name: "files", dispatch }} />
          </Grid>
        </>
      )}
      {categoryKey === "LS" && (
        <>
          <h3 className={classes.title}>
            {translate("recordsManagement.listRelative")}
          </h3>
          <CommonTable
            columns={columnsRelative}
            rows={rowsRe}
            data={{ translate }}
            event={(type: string, data: any) =>
              (ele: any, ...rest: any) => {
                dispatch({ type, data, ele, rest });
              }}
            classes={classes}
          />
        </>
      )}

      <TableRelative
        open={open}
        loading={loading}
        list={
          !!data.beneficiary
            ? list.filter((i) => !!i.beneficiary)
            : list.filter((i) => !!i.relative)
        }
        dispatch={dispatch}
      />
    </>
  );
}
