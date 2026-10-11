import React from "react";
import _ from "lodash";
import {
  TextField,
  TableCell,
  IconButton,
  Select,
  Input,
  InputLabel,
  MenuItem,
  FormControl,
  Chip,
  Checkbox,
  ListItemText,
} from "@material-ui/core";

import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import { convertCurrency } from "logic/monthlyPayment/components/utils";

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
      size="small"
      className="textSearch"
      placeholder={data.translate("common.search")}
      InputProps={{
        startAdornment: <SearchOutlinedIcon />,
        endAdornment: (
          <IconButton
            onClick={event("setEditHead", {
              name,
            })}
          >
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
    label: "#",
    headerClass: "clsStatus",
    renderCell: ({ item, rowIdx, event, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>
        <Checkbox
          checked={!!item.isCheck}
          onChange={event("onCheck", { rowIdx })}
        />
      </TableCell>
    ),
  },

  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell key={index}>
        {textSearch({
          data,
          event,
          name: "eduPrefers",
          label: "paymentList.preferential",
        })}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }) => (
      <TableCell key={colIdx} title={item?.name}>
        {item?.name || ""}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data }: any) => (
      <TableCell key={index} className="clsStatus">
        {data.translate("paymentList.receiver")}
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, colIdx, data, event }: IRenderCeil) => (
      <TableCell key={colIdx}>
        <FormControl className="block">
          <InputLabel>
            {data.translate("recordsManagement.selected")}
          </InputLabel>
          <Select
            multiple
            fullWidth
            disabled={!item.isCheck}
            value={item?.receivers || []}
            onChange={event("onChange", { rowIdx })}
            input={
              <Input
                id="select-multiple-checkbox"
                placeholder={data.translate("recordsManagement.selected")}
              />
            }
            renderValue={(selected) => (selected || []).join(", ")}
          >
            {(data.children || []).map((child) => (
              <MenuItem key={child.id} value={child.fullName}>
                <Checkbox
                  checked={(item?.receivers || []).indexOf(child.fullName) > -1}
                />
                <ListItemText primary={child.fullName} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        {!!item.subsidy ? convertCurrency(item?.subsidy) : "0"}
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
        {!!item.allowance ? convertCurrency(item?.allowance) : "0"}
      </TableCell>
    ),
  },
];
