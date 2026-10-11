import _ from "lodash";
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
  FilterList as FilterListIcon,
  AddOutlined as AddOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
  SearchOutlined as SearchOutlinedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  CachedOutlined as CachedOutlinedIcon,
} from "@material-ui/icons";
import { gender } from "./util";

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
        <TableCell
          key={name}
          className={`${name} ${
            ["code", "fullName"].includes(name) ? "fix" : ""
          }`}
        >
          <span>{data.translate(label)}</span>
          <IconButton
            sx={{ cursor: "pointer" }}
            onClick={event("openPopver", { name })}
          >
            {name === "districts" && (
              <FilterListIcon
                className={`${color("districts") ? classes.red : ""}`}
              />
            )}
            {name === "status" && (
              <FilterListIcon
                className={`${color("status") ? classes.red : ""}`}
              />
            )}
            {name === "genders" && (
              <FilterListIcon
                className={`${color("genders") ? classes.red : ""}`}
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
                    label={
                      name === "districts"
                        ? item.value
                        : name === "status"
                        ? data.translate(item.name)
                        : item.name
                    }
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

export const columns = [
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="clsCheck fix" key={index}>
        <Checkbox
          checked={!!data.checkAll}
          onChange={event("onCheck", { name: "checkAll" })}
        />
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, event, colIdx }: any) => (
      <TableCell className="clsCheck fix" key={colIdx}>
        <Checkbox
          checked={!!item.isCheck}
          onChange={event("onCheck", { name: "check", rowIdx })}
        />
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="code fix" key={index}>
        {textSearch({
          data,
          event,
          name: "code",
          label: "recordsManagement.code",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} className="code fix">
        {item.code}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="fullName fix" key={index}>
        {textSearch({
          data,
          event,
          name: "fullName",
          label: "common.fullName",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} className="fullName fix">
        {item.fullName}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell key={index} className="dateOfBirth">
        {textSearch({
          data,
          event,
          name: "dateOfBirth",
          label: "userManager.dateOfBirth",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx}>{item?.dateOfBirth}</TableCell>
    ),
  },
  {
    renderHeader: popverFilter({
      label: "common.gender",
      name: "genders",
    }),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx}>
        {Object.values(gender)[item.gender] || ""}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="nativePlace" key={index}>
        {textSearch({
          data,
          event,
          name: "nativePlace",
          label: "recordsManagement.nativePlace",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} className="nativePlace" title={item?.nativePlace}>
        {item?.nativePlace}
      </TableCell>
    ),
  },
  {
    renderHeader: popverFilter({
      label: "recordsManagement.residence",
      name: "districts",
    }),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} title={_.get(item, "district.value")}>
        {_.get(item, "district.value")}
      </TableCell>
    ),
  },
  {
    isHide: "isMartyrs",
    renderHeader: ({ index, data, event }: any) => (
      <TableCell key={index} className="nativePlace">
        {textSearch({
          data,
          event,
          name: "address",
          label: "recordsManagement.address",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell
        className="nativePlace"
        key={colIdx}
        title={_.get(item, "address", "")}
      >
        {_.get(item, "address") || ""}
      </TableCell>
    ),
  },
  {
    renderHeader: popverFilter({
      label: "common.status",
      name: "status",
    }),
    renderCell: ({ data, item, colIdx }: any) => (
      <TableCell
        key={colIdx}
        className={
          item.point == 6
            ? "clsStatus"
            : item.point >= 4
            ? "txtColor"
            : "clsStatus"
        }
      >
        {data.translate(
          item.point == 6
            ? "recordsManagement.comeStt"
            : item.point >= 4
            ? "common.finish"
            : "common.updating"
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, event, index }: any) => (
      <TableCell key={index} className="clsAction fix">
        {!data.doet?.parentId ? (
          <Button onClick={event("refresh")}>
            <CachedOutlinedIcon />
          </Button>
        ) : (
          <Button onClick={event("openDialog", { name: "addNew" })}>
            <AddOutlinedIcon />
          </Button>
        )}
      </TableCell>
    ),
    renderCell: ({ data, item, colIdx, event }: any) => (
      <TableCell key={colIdx} className="clsAction fix">
        <IconButton onClick={event("showDetail", { item })}>
          <VisibilityOutlinedIcon />
        </IconButton>
        {!!data.doet?.parentId && (
          <>
            <IconButton
              className="BtnEdit"
              onClick={event("openDialog", { name: "update", item })}
            >
              <EditOutlinedIcon />
            </IconButton>
            <IconButton
              className="btnDelete"
              onClick={event("openConfirm", { name: "delete", item })}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </>
        )}
      </TableCell>
    ),
  },
];
