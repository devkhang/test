import _ from "lodash";
import { TableCell, IconButton } from "@material-ui/core";
import { CloseOutlined as CloseOutlinedIcon } from "@material-ui/icons";
import { categoryIPF, convertSelect } from "../../utils";
import { convertDateToString } from "@vna/lib/dist/commons/utils";

const cols = (key) => {
  const col = categoryIPF(key);
  return (col || []).map((column: any) => {
    if (!!column.isDate)
      return {
        renderHeader: ({ index, data }: any) => (
          <TableCell className={`${column.name}`} key={index}>
            {data.translate(column.label)}
          </TableCell>
        ),
        renderCell: ({ item, colIdx, data }: any) => (
          <TableCell
            key={colIdx}
            className={`${column.name} ${!!item.isError ? "red" : ""}`}
          >
            {convertDateToString(item[column?.name]) == "Invalid date"
              ? ""
              : convertDateToString(item[column?.name]) || ""}
          </TableCell>
        ),
      };
    if (!!column.isMoney)
      return {
        renderHeader: ({ index, data }: any) => (
          <TableCell className={`${column.name}`} key={index}>
            {data.translate(column.label)}
          </TableCell>
        ),
        renderCell: ({ item, colIdx, data }: any) => (
          <TableCell
            key={colIdx}
            className={`${column.name} ${!!item.isError ? "red" : ""}`}
          >
            {`${item[column?.name] || ""}`.replace(
              /\B(?=(\d{3})+(?!\d))/g,
              ","
            )}
          </TableCell>
        ),
      };
    if (!!column.isSelect)
      return {
        renderHeader: ({ index, data }: any) => (
          <TableCell className={`${column.name}`} key={index}>
            {data.translate(column.label)}
          </TableCell>
        ),
        renderCell: ({ item, colIdx, data }: any) => (
          <TableCell
            key={colIdx}
            className={`${column.name} ${!!item.isError ? "red" : ""}`}
          >
            {convertSelect(column?.name, item[column?.name]) || ""}
          </TableCell>
        ),
      };

    return {
      renderHeader: ({ index, data }: any) => (
        <TableCell
          className={`${column.name} ${!column?.ellipsis ? "" : "ellipsis"}`}
          key={index}
        >
          {data.translate(column.label)}
        </TableCell>
      ),
      renderCell: ({ item, colIdx, data }: any) => (
        <TableCell
          key={colIdx}
          className={`${column.name} ${!column?.ellipsis ? "" : "ellipsis"}
          ${!!item.isError ? "red" : ""}`}
          title={!column?.ellipsis ? false : _.get(item, `${column.name}`)}
        >
          {`${_.get(item, `${column.name}`) || ""}`}
        </TableCell>
      ),
    };
  });
};

export function columns(key) {
  const column = cols(key);
  return [
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="code fix" key={index}>
          {data.translate("recordsManagement.code")}
        </TableCell>
      ),
      renderCell: ({ item, colIdx }: any) => (
        <TableCell
          key={colIdx}
          className={`${!!item.isError ? "red code fix" : "code fix"}`}
        >
          {item.code}
        </TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="fullName fix" key={index}>
          {data.translate("common.fullName")}
        </TableCell>
      ),
      renderCell: ({ item, colIdx }: any) => (
        <TableCell
          key={colIdx}
          className={`${!!item.isError ? "red fullName fix" : "fullName fix"}`}
        >
          {item.fullName}
        </TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="" key={index}>
          {data.translate("recordsManagement.birthday")}
        </TableCell>
      ),
      renderCell: ({ item, colIdx }: any) => (
        <TableCell key={colIdx} className={`${!!item.isError ? "red" : ""}`}>
          {item?.dateOfBirth || ""}
        </TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="" key={index}>
          {data.translate("common.ethnic")}
        </TableCell>
      ),
      renderCell: ({ item, colIdx }: any) => (
        <TableCell key={colIdx} className={`${!!item.isError ? "red" : ""}`}>
          {item?.ethnic?.name || ""}
        </TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="" key={index}>
          {data.translate("common.gender")}
        </TableCell>
      ),
      renderCell: ({ item, colIdx }: any) => (
        <TableCell key={colIdx} className={`${!!item.isError ? "red" : ""}`}>
          {["Nam", "Nữ"][item.gender]}
        </TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="nativePlace" key={index}>
          {data.translate("recordsManagement.nativePlace")}
        </TableCell>
      ),
      renderCell: ({ item, colIdx, data }: any) => (
        <TableCell
          key={colIdx}
          title={item?.nativePlace}
          className={`${!!item.isError ? "red" : ""} nativePlace`}
        >
          {item?.nativePlace}
        </TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="" key={index}>
          {data.translate("common.city")}
        </TableCell>
      ),
      renderCell: ({ item, colIdx, data }: any) => (
        <TableCell key={colIdx} className={`${!!item.isError ? "red" : ""}`}>
          {item?.province?.value || ""}
        </TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="" key={index}>
          {data.translate("common.district")}
        </TableCell>
      ),
      renderCell: ({ item, colIdx, data }: any) => (
        <TableCell key={colIdx} className={`${!!item.isError ? "red" : ""}`}>
          {item?.district?.value || ""}
        </TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="" key={index}>
          {data.translate("common.ward")}
        </TableCell>
      ),
      renderCell: ({ item, colIdx, data }: any) => (
        <TableCell key={colIdx} className={`${!!item.isError ? "red" : ""}`}>
          {item?.ward?.value || ""}
        </TableCell>
      ),
    },

    // {
    //   renderHeader: ({ index, data }: any) => (
    //     <TableCell className="nativePlace" key={index}>
    //       {data.translate("recordsManagement.address")}
    //     </TableCell>
    //   ),
    //   renderCell: ({ item, colIdx, data }: any) => (
    //     <TableCell
    //       key={colIdx}
    //       title={item?.address}
    //       className={`${!!item.isError ? "red" : ""} nativePlace`}
    //     >
    //       {item?.address}
    //     </TableCell>
    //   ),
    // },

    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="fullName" key={index}>
          {`${data.translate("common.fullName")} NTH`}
        </TableCell>
      ),
      renderCell: ({ item, colIdx }: any) => (
        <TableCell key={colIdx}>{item.fullNameNTH}</TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell key={index}>
          {`${data.translate("recordsManagement.birthday")} NTH`}
        </TableCell>
      ),
      renderCell: ({ item, colIdx }: any) => (
        <TableCell key={colIdx}>{item.dateOfBirthNTH}</TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="" key={index}>
          {`${data.translate("common.gender")} NTH`}
        </TableCell>
      ),
      renderCell: ({ item, colIdx }: any) => (
        <TableCell key={colIdx}>{["Nam", "Nữ"][item.genderNTH]}</TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell key={index}>
          {`${data.translate("common.city")} NTH`}
        </TableCell>
      ),
      renderCell: ({ item, colIdx, data }: any) => (
        <TableCell key={colIdx}>{item?.provinceNTH?.value || ""}</TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell key={index}>
          {`${data.translate("common.district")} NTH`}
        </TableCell>
      ),
      renderCell: ({ item, colIdx, data }: any) => (
        <TableCell key={colIdx}>{item?.districtNTH?.value || ""}</TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell key={index}>
          {`${data.translate("common.ward")} NTH`}
        </TableCell>
      ),
      renderCell: ({ item, colIdx, data }: any) => (
        <TableCell key={colIdx}>{item?.wardNTH?.value || ""}</TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell key={index}>
          {`${data.translate("recordsManagement.relationNTH")}`}
        </TableCell>
      ),
      renderCell: ({ item, colIdx }: any) => (
        <TableCell key={colIdx}>{item.relationNTH}</TableCell>
      ),
    },

    ...column,

    {
      renderHeader: ({ index, data }: any) => (
        <TableCell className="status fix" key={index}>
          {data.translate("recordsManagement.status")}
        </TableCell>
      ),
      renderCell: ({ item, colIdx, data }: any) => (
        <TableCell
          key={colIdx}
          className={`${!!item.isError ? "red status fix" : "status fix"}`}
        >
          {item?.isError === 1
            ? data.translate("recordsManagement.compulsoryField")
            : item?.isError === 2
            ? data.translate("recordsManagement.alreadyCode")
            : ""}
        </TableCell>
      ),
    },
    {
      renderHeader: ({ index, data }: any) => (
        <TableCell key={index} className="clsAction fix">
          {data.translate("common.action")}
        </TableCell>
      ),
      renderCell: ({ item, rowIdx, colIdx, event }: any) => (
        <TableCell
          key={colIdx}
          className={`${!!item.isError ? "red" : ""} clsAction fix`}
        >
          <IconButton
            className={`${!!item.isError ? "red" : ""}`}
            onClick={event("delete", { rowIdx })}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </TableCell>
      ),
    },
  ];
}
