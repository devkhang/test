import _ from "lodash";
import {
  TableCell,
  Checkbox,
  Popover,
  IconButton,
  Button,
  Box,
  FormGroup,
  FormControlLabel,
  Card,
  TextField,
  Stack,
} from "@material-ui/core";
import {
  FilterList as FilterListIcon,
  SearchOutlined as SearchOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
} from "@material-ui/icons";
import { gender, convertCurrency } from "../utils";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";

interface IRenderCeil {
  item: any;
  event: any;
  classes: any;
  column: {}[];
  rowIdx: number;
  colIdx: number;
  data: any;
  index: any;
}

const popverFilter =
  ({ label, name, isSearch }: any) =>
  ({ data, event, classes }: any) => {
    const { anchorEl }: any = data;

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
      size="small"
      fullWidth
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
    isHide: true,
    renderHeader: ({ index, data, event }: IRenderCeil) => (
      <TableCell className="clsCheckH fix" key={index}>
        <Checkbox
          checked={!!data.checkAll}
          onChange={event("onCheck", { name: "checkAll" })}
        />
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, event, colIdx }: IRenderCeil) => (
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
      <TableCell key={index} className="clsName">
        {textSearch({
          data,
          event,
          name: "name",
          label: "common.fullName",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className={!!item.isFather ? "color" : "clsName"}>
        {item?.name}
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

    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.dateOfBirth}</TableCell>
    ),
  },
  {
    renderHeader: popverFilter({
      label: "common.gender",
      name: "genders",
    }),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{gender[item?.gender] || ""}</TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell key={index}>
        {textSearch({
          data,
          event,
          name: "prefers",
          label: "paymentList.preferential",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx} title={item.prefers} className="prefers">
        {item.prefers}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: IRenderCeil) => (
      <TableCell key={index} className="clsStatus">
        {data.translate("recordsManagement.subsidy")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx} className="clsStatus">
        {!!item.isFather
          ? ""
          : !!item.subsidy
          ? convertCurrency(item?.subsidy)
          : "0"}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: IRenderCeil) => (
      <TableCell key={index} className="clsStatus">
        {data.translate("paymentList.allowance")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx} className="clsStatus">
        {!!item.isFather
          ? ""
          : !!item.allowance
          ? convertCurrency(item?.allowance)
          : "0"}
      </TableCell>
    ),
  },
];
