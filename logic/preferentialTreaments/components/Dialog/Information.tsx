import React from "react";
import _ from "lodash";
import {
  Grid,
  Typography,
  TextField,
  Switch,
  MenuItem,
  Box,
  FormControlLabel,
  FormGroup,
  Checkbox,
} from "@material-ui/core";
import NumberFormat from "react-number-format";

import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import { subsidyForms, beneficiary } from "../../util";

export default function Information(props: any) {
  const {
    data: { categories, valueTab },
    dispatch,
    row,
  } = props;
  const { translate } = useLocales();

  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <Box sx={{ padding: "8px 0" }}>
        <Typography> Thông tin</Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label={translate("preferentialTreament.name")}
            value={row?.name || ""}
            onChange={(e) => dispatch({ type: "onChange", name: "name", e })}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            label={translate("preferentialTreament.NCC")}
            value={row?.categoryId || ""}
            onChange={(e) =>
              dispatch({ type: "onChange", name: "categoryId", e })
            }
          >
            {(categories || []).map((item: any, index: number) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            InputProps={{
              readOnly: true,
            }}
            label={translate("preferentialTreament.subsidyForm")}
            value={translate(subsidyForms[+valueTab]?.name || "")}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            select
            label={translate("preferentialTreament.beneficiary")}
            value={`${row?.beneficiary == undefined ? "" : row?.beneficiary}`}
            onChange={(e) =>
              dispatch({ type: "onChange", name: "beneficiary", e })
            }
          >
            {beneficiary.map((item: any, index: number) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <NumberFormat
            customInput={TextField}
            thousandsGroupStyle="thousand"
            value={row?.subsidy || ""}
            decimalSeparator="."
            displayType="input"
            type="text"
            InputProps={{
              readOnly: valueTab === 0,
            }}
            fullWidth
            label={translate("preferentialTreament.subsidy")}
            thousandSeparator={true}
            allowNegative={false}
            onChange={(e) => dispatch({ type: "onChange", name: "subsidy", e })}
          />
        </Grid>
        <Grid item xs={6}>
          <NumberFormat
            customInput={TextField}
            thousandsGroupStyle="thousand"
            value={row?.allowance || ""}
            decimalSeparator="."
            displayType="input"
            type="text"
            InputProps={{
              readOnly: valueTab === 0,
            }}
            fullWidth
            label={translate("preferentialTreament.allowance")}
            thousandSeparator={true}
            allowNegative={false}
            onChange={(e) =>
              dispatch({ type: "onChange", name: "allowance", e })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <FormGroup row>
            <FormControlLabel
              labelPlacement="start"
              label={translate("common.active")}
              control={
                <Switch
                  checked={!!row.status}
                  onClick={(e) =>
                    dispatch({ type: "onChange", e, name: "status" })
                  }
                />
              }
            />
          </FormGroup>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label={translate("preferentialTreament.code")}
            value={row?.code || ""}
            error={!!row?.errorCode}
            onChange={(e) => dispatch({ type: "onChange", name: "code", e })}
            onBlur={() =>
              dispatch({ type: "checkCode", data: { code: row?.code || "" } })
            }
          />
        </Grid>
      </Grid>
    </>
  );
}
