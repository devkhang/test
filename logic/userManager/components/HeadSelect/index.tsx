import React, { useEffect } from "react";
import {
  IconButton,
  Grid,
  TextField,
  Link,
  Autocomplete,
} from "@material-ui/core";

import {
  CachedOutlined as CachedOutlinedIcon,
  FileDownloadOutlined as FileDownloadOutlinedIcon,
  FileUploadOutlined as FileUploadOutlinedIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

import headSelectReducer from "./headSelectReducer";
import { useSnackbar } from "notistack";
import useLocales from "src/hooks/useLocales";
import { useReducer } from "@vna/lib/dist/commons";

const initialState = {
  doets: [],
  doet: {},
};

export default function HeadSelect(props: any) {
  const { deliverImpoItem } = props;
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [state, dispatch] = useReducer({
    reducer: headSelectReducer,
    naem: headSelectReducer.name,
    initialState,
    translate,
    enqueueSnackbar,
    props,
  });

  const { doets, doet } = state;

  useEffect(() => {
    dispatch("initial");
  }, []);

  return (
    <Grid container sx={{ padding: "20px 8px" }} justifyContent="space-between">
      <Grid item xs={12} sm={6} key={1}>
        <Autocomplete
          options={doets || []}
          getOptionLabel={(option: any) => option.name || ""}
          onChange={(e, item) => dispatch({ type: "onSelect", item })}
          value={doet || {}}
          loading
          loadingText="Đang tải..."
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={translate("userManager.workUnit")}
              margin="dense"
              style={{ height: "2.5em", marginTop: "0" }}
              SelectProps={{
                MenuProps: {
                  className: "",
                },
              }}
            />
          )}
        />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        key="3"
        justifyContent="flex-end"
        sx={{ display: "flex" }}
      >
        <IconButton
          title={translate("userManager.refresh")}
          onClick={() => dispatch("reset")}
        >
          <CachedOutlinedIcon />
        </IconButton>
        <IconButton
          title={translate("userManager.upFile")}
          className="import"
          onClick={() => deliverImpoItem({ name: "importFile" })}
        >
          <FileUploadOutlinedIcon />
        </IconButton>
        <Link href={`${process.env.templateUrl}`}>
          <IconButton title={translate("userManager.dowFile")}>
            <FileDownloadOutlinedIcon />
          </IconButton>
        </Link>
        <IconButton
          onClick={() => dispatch("deleteAll")}
          title={translate("common.delete")}
        >
          <DeleteIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}
