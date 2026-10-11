import { Grid, TextField, MenuItem, Box, Button } from "@material-ui/core";
import _ from "lodash";
import useLocales from "src/hooks/useLocales";
import { styles } from "logic/monthlyPayment/styles";
import { subsidyForms } from "../utils";

export default function HeadSelect(props: any) {
  const {
    dispatch,
    data: { years, year, subsidyForm, doets, doet, type },
  } = props;
  const { translate } = useLocales();
  const classes = styles();
  const isDoet = !!doet.parentId;

  return (
    <Box className={isDoet ? "" : classes.container}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5}>
          <TextField
            select
            fullWidth
            title={doet?.name || ""}
            label={translate("common.unit")}
            className={classes.textField}
            value={`${doet?.id === 0 ? 0 : doet?.id || null}`}
            onChange={(e) =>
              dispatch({
                type: "onSelect",
                name: "doet",
                value: e.target.value,
              })
            }
          >
            {doets.map((item: any) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            fullWidth
            label={translate("recordsManagement.paymentMode")}
            className={classes.textField}
            value={`${subsidyForm == undefined ? "" : subsidyForm}`}
            onChange={(e) =>
              dispatch({
                type: "onSelect",
                name: "subsidyForm",
                value: e.target.value,
              })
            }
          >
            {subsidyForms.map((item: any, index: number) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item sm={2}></Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            select
            fullWidth
            label={translate("common.year")}
            className={classes.textField}
            value={year}
            onChange={(e) =>
              dispatch({
                type: "onSelect",
                name: "year",
                value: e.target.value,
              })
            }
          >
            {(years || []).map((item: any, index: number) => (
              <MenuItem key={index} value={item}>
                {item.year}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
      {isDoet && (
        <Box className={classes.contain}>
          <Button
            variant="contained"
            color="success"
            className={classes.btn}
            onClick={() =>
              dispatch({ type: "openDialog", data: { name: "addNew" } })
            }
          >
            {translate("common.add")}
          </Button>
          <Button
            color="error"
            variant="outlined"
            className={classes.btnDel}
            onClick={() =>
              dispatch({ type: "openConfirm", data: { name: "deleteAll" } })
            }
          >
            {translate("common.delete")}
          </Button>
          {!type && (
            <Button
              color="success"
              variant="outlined"
              className={classes.btnExp}
              onClick={() => dispatch("exports")}
            >
              {translate("paymentList.printList")}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
