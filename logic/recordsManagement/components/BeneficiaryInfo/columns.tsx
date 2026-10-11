import React from "react";
import {
  TextField,
  TableCell,
  Checkbox,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { gender, DateInput, relation } from "../utils";
import SaveIcon from "@material-ui/icons/Save";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import AddIcon from "@material-ui/icons/Add";
import CreateIcon from "@material-ui/icons/Create";
import ClearSharpIcon from "@material-ui/icons/ClearSharp";
import moment from "moment";
interface IRenderCeil {
  item: any;
  event: any;
  classes: any;
  column: {}[];
  rowIdx: number;
  colIdx: number;
  data: any;
}

const fomatDate =(date)=> {
  const Day = +moment(date).format("DD");
  const Month = +moment(date).format("MM");
  const Year = +moment(date).format("YYYY");
  return `${Day}/${Month}/${Year}`
}
export const columns = [
  {
    label: "#",
    renderCell: ({ item, event, rowIdx }: IRenderCeil) => (
      <TableCell key={rowIdx}>
        <Checkbox
          checked={!!item.isCheck}
          onChange={event("onCheckUser", { rowIdx })}
        />
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>{data.translate("common.fullName")}</TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className="name">
        {item?.fullName}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("userManager.dateOfBirth")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.dateOfBirth}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>{data.translate("common.gender")}</TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{gender[item?.gender] || ""}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx} className="address">
        {data.translate("recordsManagement.nativePlace")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className="address" title={item?.nativePlace}>
        {item?.nativePlace}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.province")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className="name">
        {item?.province?.value}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.district")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.district?.value}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.ward")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>{item?.ward?.value}</TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx} className="address">
        {data.translate("recordsManagement.address")}
      </TableCell>
    ),
    renderCell: ({ item, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx} className="address" title={item?.address}>
        {item?.address}
      </TableCell>
    ),
  },
];

export const columnsRelative = [
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>{data.translate("common.fullName")}</TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.fullName
        ) : (
          <TextField
            fullWidth
            value={item?.fullName || ""}
            onChange={event("onChange", { name: "fullName", item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("userManager.dateOfBirth")}
      </TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx, classes }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.dateOfBirth ? (
            fomatDate(item?.dateOfBirth)
          ) : (
            ""
          )
        ) : (
          <DateInput
            {...{
              event,
              item,
              name: "dateOfBirth",
              rowIdx,
              dispatch: "onChange",
              classes: classes?.textField,
            }}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>{data.translate("common.gender")}</TableCell>
    ),
    renderCell: ({
      item,
      event,
      rowIdx,
      colIdx,
      data,
      classes,
    }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          `${gender[item?.gender] || ""}`
        ) : (
          <FormControl fullWidth className={classes.textField}>
            <InputLabel>{data.translate("common.gender")}</InputLabel>
            <Select
              fullWidth
              label={data.translate("common.gender")}
              value={`${item?.gender !== undefined ? item?.gender : ""}`}
              onChange={event("onChange", { name: "gender", item, rowIdx })}
            >
              {Object.keys(gender).map((key: any) => (
                <MenuItem key={key} value={key}>
                  {gender[key]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.nativePlace")}
      </TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.nativePlace
        ) : (
          <TextField
            fullWidth
            value={item?.nativePlace || ""}
            onChange={event("onChange", { name: "nativePlace", item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.martyrsRelative")}
      </TableCell>
    ),
    renderCell: ({
      item,
      event,
      rowIdx,
      colIdx,
      data,
      classes,
    }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.relation
        ) : (
          <FormControl fullWidth className={classes.textField}>
            <InputLabel>
              {data.translate("recordsManagement.martyrsRelative")}
            </InputLabel>
            <Select
              label={data.translate("recordsManagement.martyrsRelative")}
              value={`${item?.relation !== undefined ? item?.relation : ""}`}
              onChange={event("onChange", {
                name: "relation",
                item,
                rowIdx,
              })}
            >
              {relation.map((value: any) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.currentAccommodation")}
      </TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.present
        ) : (
          <TextField
            fullWidth
            value={item?.present || ""}
            onChange={event("onChange", { name: "present", item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ colIdx, data }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {data.translate("recordsManagement.situation")}
      </TableCell>
    ),
    renderCell: ({ item, event, rowIdx, colIdx }: IRenderCeil) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          item?.note
        ) : (
          <TextField
            fullWidth
            value={item?.note || ""}
            onChange={event("onChange", { name: "note", item, rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, event, rowIdx }: IRenderCeil) => (
      <TableCell key={rowIdx} className="clsAction">
        <Button
          onClick={event("addRelative", { rowIdx })}
          sx={{ color: "#fff" }}
          title={data.translate("common.add")}
        >
          <AddIcon />
        </Button>
      </TableCell>
    ),
    renderCell: ({ item, event, rowIdx, data }: IRenderCeil) => {
      return (
        <TableCell key={rowIdx} className="clsAction fix">
          {item.isEdit ? (
            <>
              <IconButton
                title={data.translate("common.back")}
                onClick={event("editRelative", { rowIdx })}
              >
                <ArrowBackIcon sx={{ color: "#FF0000" }} />
              </IconButton>
              <IconButton
                title={data.translate("common.save")}
                onClick={event("saveRelative", { rowIdx, item })}
              >
                <SaveIcon sx={{ color: "primary.main" }} />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                title={data.translate("common.add")}
                onClick={event("editRelative", { rowIdx })}
              >
                <CreateIcon sx={{ color: "primary.main" }} />
              </IconButton>
              <IconButton
                title={data.translate("common.delete")}
                onClick={event("delete", {
                  item,
                })}
              >
                <ClearSharpIcon sx={{ color: "#FF0000" }} />
              </IconButton>
            </>
          )}
        </TableCell>
      );
    },
  },
];
