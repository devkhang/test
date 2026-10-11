import _ from "lodash";
import {
  TableCell,
  Button,
  IconButton,
  TextField,
  Checkbox,
  Stack,
  MenuItem,
  Popover,
  Card,
  Box,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";
import {
  AddOutlined as AddOutlinedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
  CloudUpload as CloudUploadIcon,
  SaveOutlined as SaveOutlinedIcon,
  CloseOutlined as CloseOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  FilterList as FilterListIcon,
} from "@material-ui/icons";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import moment from "moment";
import { type } from "./utils";
import { get } from "src/hooks/useLocalStorage";
import { cdn } from "services/aws/aws.service";

const popverFilter =
  ({ label, name }: any) =>
  ({ data, event, classes }: any) => {
    const { anchorEl } = data;
    const anchor = anchorEl?.type;
    const dataFilter = (data?.typeFilter || []).filter(
      (item: any) => !!item.isfilter
    );

    return (
      <>
        <TableCell key={"typeFiter"} className={`${name}`}>
          <span>{data.translate(label)}</span>
          <IconButton sx={{ cursor: "pointer" }} onClick={event("openPopver")}>
            <FilterListIcon
              className={`${dataFilter.length > 0 ? classes.red : ""}`}
            />
          </IconButton>
        </TableCell>
        <Popover
          key={"typeFiter"}
          open={!!anchor}
          anchorEl={anchor}
          onClose={event("closePopver")}
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
              onClick={event("onFilter")}
            >
              {data.translate("common.searchs")}
            </Button>
            <Box className="box">
              <FormGroup>
                {(data.typeFilter || []).map((item: any, index: any) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={item.isfilter}
                        onChange={event("onCheckFilter", {
                          item,
                          index,
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

export const columns = [
  {
    isHide: true,
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="check" key={index}>
        <Checkbox
          checked={!!data.checkAll}
          onChange={event("onCheck", { name: "checkAll" })}
        />
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, event, colIdx }: any) => (
      <TableCell className="check" key={colIdx}>
        <Checkbox
          checked={!!item?.isCheck}
          onChange={event("onCheck", { name: "check", rowIdx, item })}
        />
      </TableCell>
    ),
  },
  {
    isHideMoet: true,
    label: "#",
    headerClass: "check",
    renderCell: ({ rowIdx }) => (
      <TableCell key={rowIdx} className="stt">
        {rowIdx + 1}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="no" key={index}>
        {data.translate("formManager.numberSymbols")}
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, event, colIdx }: any) => (
      <TableCell className="textField" key={colIdx}>
        {!item.isEdit ? (
          item.no
        ) : (
          <TextField
            size="small"
            value={item?.no || ""}
            onChange={event("onChange", { name: "no", rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    // renderHeader: ({ index, data, event }: any) => (
    //   <TableCell className="documentType" key={index}>
    //     {data.translate("formManager.documentType")}
    //   </TableCell>
    // ),
    renderHeader: popverFilter({
      label: "formManager.documentType",
      name: "type",
    }),
    renderCell: ({ item, rowIdx, event, colIdx }: any) => (
      <TableCell className="textField" key={colIdx}>
        {!item.isEdit ? (
          type[item.type]
        ) : (
          <TextField
            size="small"
            fullWidth
            value={item?.type}
            select
            onChange={event("onChange", { name: "type", rowIdx })}
          >
            {type.map((item: any, index: number) => (
              <MenuItem key={index} value={index}>
                {type[index]}
              </MenuItem>
            ))}
          </TextField>
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="" key={index}>
        {data.translate("formManager.documentNames")}
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, event, colIdx }: any) => (
      <TableCell className="textField" key={colIdx}>
        {!item.isEdit ? (
          item?.name || ""
        ) : (
          <TextField
            size="small"
            fullWidth
            value={item?.name}
            onChange={event("onChange", { name: "name", rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="" key={index}>
        {data.translate("formManager.agencyIssued")}
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, event, colIdx }: any) => (
      <TableCell className="textField" key={colIdx}>
        {!item.isEdit ? (
          item?.content || ""
        ) : (
          <TextField
            size="small"
            fullWidth
            value={item?.content}
            onChange={event("onChange", { name: "content", rowIdx })}
          />
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="" key={index}>
        {data.translate("formManager.dateIssued")}
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, event, colIdx }: any) => (
      <TableCell className="textField" key={colIdx}>
        {!item.isEdit ? (
          item?.publishDate ? (
            moment(item?.publishDate).format("L")
          ) : (
            ""
          )
        ) : (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack>
              <DesktopDatePicker
                inputFormat="dd/MM/yyyy"
                value={item?.publishDate || null}
                onChange={event("onChange", { name: "publishDate", rowIdx })}
                renderInput={(params: any) => (
                  <TextField
                    {...params}
                    fullWidth
                    className=""
                    size="small"
                    helperText={false}
                  />
                )}
              />
            </Stack>
          </LocalizationProvider>
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ index, data, event }: any) => (
      <TableCell className="attachedFile" key={index}>
        {data.translate("formManager.attachedFile")}
      </TableCell>
    ),
    renderCell: ({ item, rowIdx, event, colIdx }: any) => (
      <TableCell className="attachedFile" key={colIdx}>
        {!item.isEdit ? (
          // <Button onClick={event("openLink", { item, rowIdx })}>
          //   {item?.file[0]?.name}
          // </Button>
          <a target="_blank" href={`${item?.file[0]?.url}`}>{item?.file[0]?.name}</a>
        ) : (
          <label>
            <input
              type="file"
              onChange={event("onChange", { rowIdx, name: "file" })}
              hidden
            />
            {!item.file ? (
              <IconButton className="btnUpFile" component="span">
                <CloudUploadIcon fontSize="medium" />
              </IconButton>
            ) : (
              <a>{item?.file[0]?.name}</a>
            )}
          </label>
        )}
      </TableCell>
    ),
  },
  {
    renderHeader: ({ data, event, index }: any) => (
      <TableCell key={index} className="action fix">
        {!(data.workUnit === "Moet-superAdmin") ? (
          data.translate("common.action")
        ) : (
          <Button onClick={event("addNew")}>
            <AddOutlinedIcon />
          </Button>
        )}
      </TableCell>
    ),
    renderCell: ({ item, colIdx, event, data, rowIdx }: any) => (
      <TableCell key={colIdx} className="action fix">
        {!(data.workUnit === "Moet-superAdmin") && (
          <IconButton className="BtnEdit" onClick={event("openLink", { item })}>
            <VisibilityOutlinedIcon />
          </IconButton>
        )}

        {!!item.isEdit && data.workUnit === "Moet-superAdmin" && (
          <>
            <IconButton
              className="BtnEdit"
              onClick={event("save", { item, rowIdx })}
            >
              <SaveOutlinedIcon />
            </IconButton>
            <IconButton
              className="btnDelete"
              onClick={event("setEdit", { item, rowIdx })}
            >
              <CloseOutlinedIcon />
            </IconButton>
          </>
        )}

        {!item.isEdit && data.workUnit === "Moet-superAdmin" && (
          <>
            <IconButton
              className="BtnEdit"
              onClick={event("setEdit", { item, rowIdx })}
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
