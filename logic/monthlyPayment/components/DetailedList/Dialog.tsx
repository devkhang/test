import {
  Grid,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import FormDialog from "logic/components/dialogs/FormDialog";
import useLocales from "src/hooks/useLocales";
import { styles } from "logic/monthlyPayment/styles";
import { columns } from "./columns";
import { CommonTable, Loading } from "@vna/lib/dist/components";

export function Dialog(props: any) {
  const {
    dispatch,
    prefers,
    code,
    category,
    typeCategory,
    page,
    show,
    editHead,
    anchorEl,
    genders,
    valueSearch,
    checkAll,
    loading,
  } = props.data;
  const { district, ward } = props.address;
  const { translate } = useLocales();
  const classes = styles();

  return (
    <FormDialog
      fullWidth
      maxWidth={"xl"}
      open={show}
      onClose={() => dispatch("closeModal")}
      onYes={() => dispatch("save")}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            disabled
            variant="filled"
            label={translate("common.district")}
            value={district?.value}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            disabled
            variant="filled"
            label={translate("common.ward")}
            value={ward?.value}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>{translate("paymentList.category")}</InputLabel>
            <Select
              label={translate("paymentList.category")}
              title={category[typeCategory]?.name || ""}
              value={`${typeCategory !== undefined ? typeCategory : ""}`}
              onChange={(e) =>
                dispatch({
                  type: "selectUnit",
                  value: e.target.value,
                })
              }
            >
              {category.map((item: any) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            fullWidth
            disabled
            variant="filled"
            label={translate("paymentList.code")}
            value={code}
          />
        </Grid>
      </Grid>

      <br />
      <Loading loading={loading}>
        <CommonTable
          columns={columns}
          rows={prefers}
          data={{
            renderRows: "prefers",
            translate,
            valueSearch,
            dispatch,
            checkAll,
            editHead,
            anchorEl,
            genders,
            classes,
          }}
          page={{
            ...page,
            onChange: (event: any, pageNumber: any, pageSize: any) => {
              dispatch({
                type: "onPaging",
                pageNumber,
                pageSize,
              });
            },
          }}
          event={(type: string, data: any) =>
            (ele: any, ...rest: any) => {
              dispatch({ type, data, ele, rest });
            }}
          classes={classes}
        />
      </Loading>
    </FormDialog>
  );
}
