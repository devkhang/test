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
  Switch,
  Card,
  TextField,
} from "@material-ui/core";
import {
  FilterList as FilterListIcon,
  AddOutlined as AddOutlinedIcon,
  VpnKeyOutlined as VpnKeyOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
  SearchOutlined as SearchOutlinedIcon,
} from "@material-ui/icons";

import { gender } from "./util";
import { get } from "src/hooks/useLocalStorage";

const user = get("user");

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
          className={`${name} ${name === "name" ? "fix" : ""}`}
        >
          <span>{data.translate(label)}</span>
          <IconButton
            sx={{ cursor: "pointer" }}
            onClick={event("openPopver", { name })}
          >
            {name === "roles" && (
              <FilterListIcon
                className={`${color("roles") ? classes.red : ""}`}
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
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <Card className={classes.card}>
            <Button
              sx={{ width: "95%", minWidth: "fit-content" }}
              onClick={event("onFilter", { name })}
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
                    label={item.name}
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
      placeholder={data.translate("common.search")}
      InputProps={{
        startAdornment: <SearchOutlinedIcon />,
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
          checked={!!item.isCheck}
          onChange={event("onCheck", { name: "check", rowIdx })}
        />
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="name fix" key={index}>
        {textSearch({
          data,
          event,
          name: "fullName",
          label: "common.fullName",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} className="name fix">
        {item.fullName}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="position" key={index}>
        {textSearch({
          data,
          event,
          name: "username",
          label: "common.username",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx}>{item.username}</TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="position" key={index}>
        {textSearch({
          data,
          event,
          name: "realRole",
          label: "common.position",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} className="position" title={item.realRole}>
        {item.realRole}
      </TableCell>
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
    renderHeader: popverFilter({
      label: "userManager.typeUser",
      name: "roles",
    }),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx}>{_.get(item, "role.name")}</TableCell>
    ),
  },
  {
    renderHeader: ({ event, index, data }: any) => (
      <TableCell key={index}>
        <span>{data.translate("common.status")}</span>
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, colIdx, event }: any) => (
      <TableCell key={colIdx}>
        <Switch
          checked={!item?.status}
          onClick={event("statusUser", { item, rowIdx })}
        />
      </TableCell>
    ),
  },
  {
    renderHeader: ({ event, index }: any) => (
      <TableCell key={index} className="clsAction fix">
        <Button onClick={event("openDialog", { name: "addNew" })}>
          <AddOutlinedIcon />
        </Button>
      </TableCell>
    ),
    renderCell: ({ item, colIdx, event, data }: any) => (
      <TableCell key={colIdx} className="clsActionBD fix">
        <>
          <IconButton
            title={data.translate("changePassword.resetPass")}
            className="BtnKey"
            onClick={event("resetPass", item)}
          >
            <VpnKeyOutlinedIcon />
          </IconButton>

          <IconButton
            title={data.translate("common.update")}
            className="BtnEdit"
            onClick={event("openDialog", { name: "update", item })}
          >
            <EditOutlinedIcon />
          </IconButton>

          {!["superAdmin"].includes(item?.role?.role) && item?.id !== user.id && (
            <IconButton
              title={data.translate("common.delete")}
              className="btnDelete"
              onClick={event("openConfirm", { name: "delete", item })}
            >
              <CloseOutlinedIcon />
            </IconButton>
          )}
        </>
      </TableCell>
    ),
  },
];
