import React from "react";
import _ from "lodash";
import { IconButton, Box, TextField, MenuItem } from "@material-ui/core";
import {
  CachedOutlined as CachedOutlinedIcon,
  SearchOutlined as SearchOutlinedIcon,
  DeleteOutlineRounded as DeleteOutlineRoundedIcon,
  CloseOutlined as CloseOutlinedIcon,
} from "@material-ui/icons";
import useLocales from "src/hooks/useLocales";
import { styles } from "../style";

export default function Header(props: any) {
  const { dispatch, years, year, showInput, workUnit } = props;
  const { translate } = useLocales();
  const classes = styles();

  return (
    <Box className={classes.boxHead}>
      {!showInput ? (
        <IconButton
          onClick={() => dispatch("setEditShowInput")}
          className={`${!showInput ? "" : classes.displaynone}`}
        >
          <SearchOutlinedIcon />
        </IconButton>
      ) : (
        <TextField
          size="small"
          className={`${classes.texSearch} ${
            !showInput ? classes.displaynone : ""
          }`}
          placeholder={translate("common.search")}
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => dispatch("setEditShowInput")}>
                <CloseOutlinedIcon fontSize="small" />
              </IconButton>
            ),
          }}
          onChange={_.debounce((e) => dispatch({ type: "onSearch", e }), 700)}
        />
      )}
      {workUnit === "Moet-superAdmin" && (
        <IconButton
          onClick={() =>
            dispatch({ type: "openConfirm", data: { name: "deleteAll" } })
          }
        >
          <DeleteOutlineRoundedIcon />
        </IconButton>
      )}
      <IconButton onClick={() => dispatch("refresh")}>
        <CachedOutlinedIcon />
      </IconButton>
      <TextField
        select
        size="small"
        value={year || {}}
        onChange={(e) => dispatch({ type: "onSelectYear", e })}
        className="textField"
      >
        {(years || []).map((year: any, index: number) => (
          <MenuItem key={index} value={year}>
            {year?.year}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
