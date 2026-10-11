import _ from "lodash";
import React from "react";
import {
  CachedOutlined as CachedOutlinedIcon,
  FileDownloadOutlined as FileDownloadOutlinedIcon,
  Delete as DeleteIcon,
  FileUploadOutlined as FileUploadOutlinedIcon,
} from "@material-ui/icons";
import { Grid, IconButton, Link } from "@material-ui/core";

import useLocales from "src/hooks/useLocales";
import { categoryExport, girdExport, categoryDowFile } from "../utils";
import { style } from "logic/recordsManagement";

const HeadSelect = (props) => {
  const { dispatch, categoryKey, doet } = props;
  const classes = style({});
  const { translate } = useLocales();

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ padding: "8px 0" }}
    >
      <Grid item>
        {categoryExport(categoryKey)?.map((item) =>
          girdExport({ ...item, translate, dispatch, classes })
        )}
      </Grid>
      <Grid item>
        {!!doet?.parentId && (
          <>
            <IconButton
              title={translate("common.refresh")}
              onClick={() => dispatch("refresh")}
            >
              <CachedOutlinedIcon />
            </IconButton>
            <IconButton
              title={translate("common.upFile")}
              onClick={() => dispatch("openDialogImport")}
              component="label"
            >
              {/* <input
            onChange={
              (e) => dispatch({ type: "import", e })
            }
            type="file"
            accept=".xls,.xlsx,.xlsm"
            hidden
          /> */}
              <FileUploadOutlinedIcon />
            </IconButton>
            <Link href={`${categoryDowFile(categoryKey)}`}>
              <IconButton title={translate("common.downFile")}>
                <FileDownloadOutlinedIcon />
              </IconButton>
            </Link>
            <IconButton
              title={translate("common.delete")}
              onClick={() =>
                dispatch({ type: "openConfirm", data: { name: "deleteAll" } })
              }
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default HeadSelect;
