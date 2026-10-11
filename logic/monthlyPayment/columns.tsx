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
  Stack,
} from "@material-ui/core";
import {
  FilterList as FilterListIcon,
  CachedOutlined as CachedOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
  SearchOutlined as SearchOutlinedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
} from "@material-ui/icons";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import { convertDateToString } from "@vna/lib/dist/commons/utils";
import {
  paymentUnit,
  convertCurrency,
} from "logic/monthlyPayment/components/utils";

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
        <TableCell key={name}>
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
            {name === "wards" && (
              <FilterListIcon
                className={`${color("wards") ? classes.red : ""}`}
              />
            )}
            {name === "unit" && (
              <FilterListIcon
                className={`${color("unit") ? classes.red : ""}`}
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
                    label={item.value}
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
  ) : name === "foundedDate" ? (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack>
        <DesktopDatePicker
          inputFormat="dd/MM/yyyy"
          value={data.valueSearch?.foundedDate || null}
          onChange={_.debounce(event("onSearch", { name }), 700)}
          renderInput={(params: any) => (
            <TextField
              {...params}
              fullWidth
              size="small"
              className="textSearch"
              helperText={false}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={event("setEditHead", { name })}>
                    <CloseOutlinedIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
          )}
        />
      </Stack>
    </LocalizationProvider>
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
    renderHeader: ({ index, data, event }: any) => (
      <TableCell key={index} className="code">
        {textSearch({
          data,
          event,
          name: "code",
          label: "paymentList.code",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} className="code">
        {item.code}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell key={index} className="date">
        {textSearch({
          data,
          event,
          name: "foundedDate",
          label: "paymentList.foundedDate",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx}>
        {convertDateToString(item.foundedDate)}
      </TableCell>
    ),
  },
  {
    renderHeader: popverFilter({
      label: "common.district",
      name: "districts",
    }),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} title={_.get(item, "district.value")}>
        {_.get(item, "district.value")}
      </TableCell>
    ),
  },

  {
    renderHeader: popverFilter({
      label: "common.ward",
      name: "wards",
    }),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} title={_.get(item, "ward.value")}>
        {_.get(item, "ward.value")}
      </TableCell>
    ),
  },
  {
    renderHeader: popverFilter({
      label: "paymentList.paymentUnit",
      name: "unit",
    }),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx}>{paymentUnit[item.unit]}</TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell key={index} className="clsStatus">
        {textSearch({
          data,
          event,
          name: "total",
          label: "paymentList.total",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: any) => (
      <TableCell key={colIdx} className="clsStatus">
        {!!item.total ? convertCurrency(item.total) : "0"}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ event, index }: any) => (
      <TableCell key={index} className="clsAction fix">
        <Button onClick={event("refresh")}>
          <CachedOutlinedIcon />
        </Button>
      </TableCell>
    ),
    renderCell: ({ data, item, colIdx, event }: any) => (
      <TableCell key={colIdx} className="clsActionBD fix">
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
