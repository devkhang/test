import _ from "lodash";
import {
  TableCell,
  Button,
  IconButton,
  TextField,
  Switch,
} from "@material-ui/core";
import {
  AddOutlined as AddOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  SearchOutlined as SearchOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
  ChevronRight as ChevronRightIcon,
} from "@material-ui/icons";
import NumberFormat from "react-number-format";

export const columns = [
  {
    label: "#",
    headerClass: "show",
    renderCell: ({ rowIdx, colIdx, event, item }: any) => (
      <TableCell className="show" key={colIdx}>
        {!item.parentId && (
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
      <TableCell key={index} className="status">
        {data.translate("common.status")}
      </TableCell>
    ),
    renderCell: ({ rowIdx, colIdx, item, event }: any) => (
      <TableCell key={colIdx}>
        {!item.parentId && (
          <Switch
            checked={item.status || false}
            onChange={event("onChange", { rowIdx, name: "status", item })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, index, event }: any) => (
      <TableCell key={index} className="name">
        {!data.editHead?.name ? (
          <>
            <span>{data.translate("preferentialTreament.name")}</span>
            <IconButton onClick={event("setEditHead")}>
              <SearchOutlinedIcon />
            </IconButton>
          </>
        ) : (
          <TextField
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton onClick={event("setEditHead")}>
                  <CloseOutlinedIcon fontSize="small" />
                </IconButton>
              ),
            }}
            onChange={_.debounce(event("onSearch"), 700)}
          />
        )}
      </TableCell>
    ),
    renderCell: ({ rowIdx, colIdx, item, event }: any) => (
      <TableCell
        title={item?.name}
        className={`${!!item.parentId ? "child" : ""} name`}
        key={colIdx}
      >
        {!item.isEdit ? (
          <span className="span">{item?.name}</span>
        ) : (
          <TextField
            fullWidth
            className="textField"
            variant="filled"
            value={item.name || ""}
            onChange={event("onChange", { rowIdx, name: "name" })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, index, event }: any) => (
      <TableCell key={index} className="allowance">
        {data.translate("preferentialTreament.subsidy")}
      </TableCell>
    ),
    renderCell: ({ rowIdx, colIdx, item, event }: any) => (
      <TableCell className={"allowance"} key={colIdx}>
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
            thousandSeparator={true}
            allowNegative={false}
            onChange={event("onChange", { rowIdx, name: "name" })}
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
      <TableCell className={"allowance"} key={colIdx}>
        {!item.isEdit ? (
          `${item.allowance || ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        ) : (
          <NumberFormat
            customInput={TextField}
            thousandsGroupStyle="thousand"
            value={item.allowance || ""}
            decimalSeparator="."
            displayType="input"
            type="text"
            thousandSeparator={true}
            allowNegative={false}
            onChange={event("onChange", { rowIdx, name: "name" })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, index, event }: any) => (
      <TableCell key={index} className="code">
        {data.translate("preferentialTreament.code")}
      </TableCell>
    ),
    renderCell: ({ rowIdx, colIdx, item, event }: any) => (
      <TableCell className={``} key={colIdx}>
        {item.code}
      </TableCell>
    ),
  },
  {
    isShow: true,
    renderHeader: ({ event, index, data }: any) => (
      <TableCell className="action" key={index}>
        <Button
          onClick={event("openDialog", { name: "addNew" })}
          className="clsBtnHead"
        >
          <AddOutlinedIcon />
        </Button>
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, event, colIdx, data }: any) => (
      <TableCell className="action" key={colIdx}>
        {!item.parentId && (
          <>
            <IconButton
              className="btnSave"
              onClick={event("openDialog", { name: "update", item })}
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
        )}
      </TableCell>
    ),
  },
];
