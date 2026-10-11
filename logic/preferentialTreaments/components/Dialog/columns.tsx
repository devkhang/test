import _ from "lodash";
import {
  TableCell,
  Button,
  IconButton,
  TextField,
  MenuItem,
} from "@material-ui/core";
import {
  AddOutlined as AddOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  SaveOutlined as SaveOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
  ChevronRight as ChevronRightIcon,
} from "@material-ui/icons";
import NumberFormat from "react-number-format";

import { subsidyForms, beneficiary } from "../../util";

export const columns = [
  {
    renderHeader: ({ data, index, event }: any) => (
      <TableCell key={index} className="show">
        {"#"}
      </TableCell>
    ),
    renderCell: ({ rowIdx, colIdx, event, item }: any) => (
      <TableCell className="show" key={colIdx}>
        {!item.isGrand && (
          <IconButton
            className={!!item.show ? "open" : "close"}
            onClick={event("show", { rowIdx })}
          >
            <ChevronRightIcon />
          </IconButton>
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, index, event }: any) => (
      <TableCell key={index} className="name">
        {data.translate("preferentialTreament.name")}
      </TableCell>
    ),
    renderCell: ({ rowIdx, colIdx, item, event }: any) => (
      <TableCell key={colIdx} className={!!item.isGrand ? "child" : ""}>
        {!item.isEdit ? (
          item.name
        ) : (
          <TextField
            fullWidth
            className="textField"
            variant="filled"
            value={item.name || ""}
            onChange={event("onChangeChild", { rowIdx, name: "name" })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, index, event }: any) => (
      <TableCell key={index} className="subsidy">
        {data.translate("preferentialTreament.subsidy")}
      </TableCell>
    ),
    renderCell: ({ rowIdx, colIdx, item, event }: any) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          `${item.subsidy || ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        ) : (
          <NumberFormat
            customInput={TextField}
            thousandsGroupStyle="thousand"
            value={item?.subsidy || ""}
            decimalSeparator="."
            displayType="input"
            type="text"
            fullWidth
            className="textField"
            variant="filled"
            thousandSeparator={true}
            allowNegative={false}
            onChange={event("onChangeChild", { rowIdx, name: "subsidy" })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, index, event }: any) => (
      <TableCell key={index} className="allowance">
        {data.translate("preferentialTreament.allowance")}
      </TableCell>
    ),
    renderCell: ({ rowIdx, colIdx, item, event }: any) => (
      <TableCell key={colIdx}>
        {!item.isEdit ? (
          `${item.allowance || ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        ) : (
          <NumberFormat
            customInput={TextField}
            thousandsGroupStyle="thousand"
            value={item.allowance || ""}
            decimalSeparator="."
            displayType="input"
            fullWidth
            className="textField"
            variant="filled"
            type="text"
            thousandSeparator={true}
            allowNegative={false}
            onChange={event("onChangeChild", { rowIdx, name: "allowance" })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, index, event }: any) => (
      <TableCell key={index} className="persion">
        {data.translate("preferentialTreament.beneficiary")}
      </TableCell>
    ),
    renderCell: ({ rowIdx, colIdx, item, event }: any) => (
      <TableCell key={colIdx} className="beneficiary">
        {!item.isEdit ? (
          beneficiary[item.beneficiary]?.name || ""
        ) : (
          <TextField
            fullWidth
            className="textfieldSL"
            variant="filled"
            select
            value={`${item?.beneficiary == undefined ? "" : item?.beneficiary}`}
            onChange={event("onChangeChild", { rowIdx, name: "beneficiary" })}
          >
            {beneficiary.map((item: any, index: number) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      </TableCell>
    ),
  },

  {
    renderHeader: ({ event, index }: any) => (
      <TableCell className="action" key={index}>
        <Button
          onClick={event("add", { name: "addNew" })}
          className="clsBtnHead"
        >
          <AddOutlinedIcon />
        </Button>
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, event, colIdx, data }: any) => (
      <TableCell className="action" key={colIdx}>
        {!item.isEdit ? (
          <>
            {data.valueTab === 1 && !item.isGrand && (
              <IconButton
                className="btnSave"
                onClick={event("add", { rowIdx, name: "addChild", item })}
              >
                <AddOutlinedIcon />
              </IconButton>
            )}
            <IconButton
              className="btnSave"
              onClick={event("setEdit", { rowIdx })}
            >
              <EditOutlinedIcon />
            </IconButton>
            <IconButton
              className="btnDelete"
              onClick={event("openConfirm", { item: item, rowIdx })}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              className="btnSave"
              onClick={event("save", {
                item,
                rowIdx,
              })}
            >
              <SaveOutlinedIcon />
            </IconButton>
            <IconButton
              className="btnDelete"
              onClick={event("setEdit", { rowIdx })}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </>
        )}
      </TableCell>
    ),
  },
];
