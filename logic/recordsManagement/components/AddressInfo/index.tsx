import { useEffect } from "react";
import { Grid, TextField, Autocomplete } from "@material-ui/core";
import useLocales from "src/hooks/useLocales";
import { useSnackbar } from "notistack";
import { useReducer } from "@vna/lib/dist/commons";
import { addressInfoReducer } from "./addressInfoReducer";
import { TextInput } from "../utils";
import { styles } from "../styles";
import { Loading } from "@vna/lib/dist/components";

interface Props {
  profile: string;
  categoryKey: string;
  doet: any;
  errors: any;
}

const initialState = {
  data: {},
  districts: [],
  wards: [],
  loading: false,
};

export function AddressInfo(props: Props) {
  const { categoryKey, profile, errors } = props;
  const { translate } = useLocales();
  const classes = styles();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer({
    reducer: addressInfoReducer,
    name: "addressInfoReducer",
    initialState,
    translate,
    enqueueSnackbar,
    props,
  });

  useEffect(() => {
    dispatch("initial");
  }, [profile]);

  const { data, districts, wards, loading } = state;
  return (
    <>
      <h4 className={classes.title}>{translate("recordsManagement.title")}</h4>
      <Loading loading={loading} className={classes.loading}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={categoryKey === "LS" ? 12 : 6}>
            <TextInput
              {...{
                label: translate("recordsManagement.nativePlace"),
                value: data?.nativePlace,
                name: "nativePlace",
                dispatch: dispatch,
                type: "changeAddress",
              }}
            />
          </Grid>
          {categoryKey !== "LS" && (
            <Grid item xs={12} sm={6}>
              <TextInput
                {...{
                  label: translate("recordsManagement.address"),
                  value: data?.address,
                  name: "address",
                  dispatch: dispatch,
                  type: "changeAddress",
                }}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label={translate("recordsManagement.province")}
              value={data?.province?.value || ""}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Autocomplete
              options={districts}
              getOptionLabel={(option: any) => option?.value || ""}
              onChange={(e, item) =>
                dispatch({
                  type: "onSelect",
                  name: "district",
                  item,
                })
              }
              value={data?.district || {}}
              loading
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={translate("recordsManagement.district")}
                  error={errors?.district}
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
                  type: "onSelect",
                  name: "ward",
                  item,
                })
              }
              value={data?.ward || {}}
              loading
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label={translate("recordsManagement.ward")}
                  error={errors?.ward}
                />
              )}
            />
          </Grid>
        </Grid>
      </Loading>
    </>
  );
}
