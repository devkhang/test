import React from "react";
import {
  Popover,
  TableCell,
  IconButton,
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  TextField,
} from "@material-ui/core";
import {
  EditOutlined as EditOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
  CachedOutlined as CachedOutlinedIcon,
  FilterList as FilterListIcon,
  SearchOutlined as SearchOutlinedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
} from "@material-ui/icons";
import _ from "lodash";

const popverFilter =
  ({ label, name, isSearch }: any) =>
  ({ data, event, classes }: any) => {
    const { anchorEl } = data;
    const anchor = anchorEl[name];

    const color = (name: any) => {
      const isFilter = (data[name] || []).filter(
        (item: any) => !!item.isfilter
      );
      if (isFilter.length > 0) return true;
      return false;
    };
    return (
      <>
        <TableCell key={name} className={`${name}`}>
          <span>{data.translate(label)}</span>
          <IconButton
            sx={{ cursor: "pointer" }}
            onClick={event("openPopver", { name })}
          >
            {name === "relation" && (
              <FilterListIcon
                className={`${color("relation") ? classes.red : ""}`}
              />
            )}
            {name === "categories" && (
              <FilterListIcon
                className={`${color("categories") ? classes.red : ""}`}
              />
            )}
          </IconButton>
        </TableCell>
        <Popover
          key={name}
          open={!!anchor}
          anchorEl={anchor}
          onClose={event("closePopver", { name })}
          anchorOrigin={{
            vertical: `${!isSearch ? "bottom" : "top"}`,
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Card className={classes.card}>
            <Button
              sx={{ width: "95%", minWidth: "fit-content" }}
              onClick={event("filter", { name })}
            >
              {data.translate("common.searchs")}
            </Button>
            <Box className="box">
              <FormGroup>
                {(data[name] || []).map((item: any, index: any) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={item.isfilter}
                        onChange={event("onChangeFilter", {
                          item,
                          index,
                          name,
                        })}
                      />
                    }
                    label={name === "relation" ? item : item.name}
                  />
                ))}
              </FormGroup>
            </Box>
          </Card>
        </Popover>
      </>
    );
  };

const textSearch = ({ data, event, name, label }: any) => {
  return !data.editHead[name] ? (
    <>
      <span>{data.translate(label)}</span>
      <IconButton onClick={event("setEditHead", { name })}>
        <SearchOutlinedIcon />
      </IconButton>
    </>
  ) : (
    //name === "dateOfBirth" ? (
    //   <LocalizationProvider dateAdapter={AdapterDateFns}>
    //     <Stack>
    //       <DesktopDatePicker
    //         inputFormat="dd/MM/yyyy"
    //         value={data.valueSearch?.dateOfBirth || null}
    //         onChange={_.debounce(event("onSearch", { name }), 700)}
    //         renderInput={(params: any) => (
    //           <TextField
    //             {...params}
    //             fullWidth
    //             className="textSearch"
    //             size="small"
    //             helperText={false}
    //             InputProps={{
    //               endAdornment: (
    //                 <IconButton onClick={event("setEditHead", { name })}>
    //                   <CloseOutlinedIcon fontSize="small" />
    //                 </IconButton>
    //               ),
    //             }}
    //           />
    //         )}
    //       />
    //     </Stack>
    //   </LocalizationProvider>
    // )
    <TextField
      className="textSearch"
      fullWidth
      size="small"
      placeholder={data.translate("common.search")}
      InputProps={{
        endAdornment: (
          <IconButton onClick={event("setEditHead", { name })}>
            <CloseOutlinedIcon fontSize="small" />
          </IconButton>
        ),
      }}
      onChange={_.debounce(event("onSearch", { name }), 700)}
    />
  );
};

const getName = (data: any, name) => {
  const user = (_.get(data, "profiles.infoBeneficiary") || []).find(
    (i) => !!i.status
  );

  return name === "relation" ? user?.relation : user?.fullName;
};

export const columns = [
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="clsCheckH fix" key={index}>
        <Checkbox
          checked={!!data.checkAll}
          onChange={event("onCheck", { name: "checkAll" })}
        />
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, event, colIdx }: any) => (
      <TableCell className="clsCheckBd fix" key={colIdx}>
        <Checkbox
          checked={!!item?.isCheck}
          onChange={event("onCheck", { name: "check", rowIdx })}
        />
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }) => (
      <TableCell key={index} className="code">
        {textSearch({
          data,
          event,
          name: "code",
          label: "recordsManagement.code",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx} className="code">
        {item?.profiles?.code || ""}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }) => (
      <TableCell key={index} className="fullName">
        {textSearch({
          data,
          event,
          name: "fullName",
          label: "burialFee.nccName",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx} className="fullName">
        {item?.profiles?.fullName}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }) => (
      <TableCell key={index} className="dateOfBirth">
        {textSearch({
          data,
          event,
          name: "dateOfBirth",
          label: "userManager.dateOfBirth",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx}>{item?.profiles?.dateOfBirth}</TableCell>
    ),
  },
  {
    renderHeader: popverFilter({
      label: "burialFee.nccObject",
      name: "categories",
    }),
    renderCell: ({ item, colIdx, data }) => (
      <TableCell key={colIdx}>
        {(data?.categories || []).find(
          (i) => i.id === item?.profiles?.categoryId
        )?.name || ""}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }) => (
      <TableCell key={index}>
        {textSearch({
          data,
          event,
          name: "beneficiary",
          label: "burialFee.beneficiary",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx, rowIdx, data }) => (
      <TableCell key={colIdx}>{getName(item, "fullName")}</TableCell>
    ),
  },
  {
    renderHeader: popverFilter({
      label: "burialFee.relationship",
      name: "relation",
    }),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx}>{getName(item, "relation")}</TableCell>
    ),
  },
  {
    renderHeader: ({ event, index }) => (
      <TableCell key={index} className="clsAction fix">
        <Button onClick={event("refresh")}>
          <CachedOutlinedIcon />
        </Button>
      </TableCell>
    ),
    renderCell: ({ item, colIdx, event }) => (
      <TableCell key={colIdx} className="clsActionBD fix">
        <IconButton onClick={event("showDetail", { item })}>
          <VisibilityOutlinedIcon />
        </IconButton>

        <IconButton className="BtnEdit" onClick={event("openModal", { item })}>
          <EditOutlinedIcon />
        </IconButton>

        <IconButton
          className="btnDelete"
          onClick={event("openConfirm", { name: "delete", item })}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </TableCell>
    ),
  },
];
