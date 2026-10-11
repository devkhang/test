import _ from "lodash";
import * as XLSX from "ts-xlsx";
import { getRoleId } from "../../../util";
import User from "api/User";

const getDataFromEx = (file: any, roles: any, unitId: any) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      try {
        const rows: any = [];
        const arrayBuffer: any = fileReader.result;
        const data = new Uint8Array(arrayBuffer);
        const arr = new Array();
        for (let i = 0; i != data.length; ++i)
          arr[i] = String.fromCharCode(data[i]);
        const bstr = arr.join("");
        const workbook = XLSX.read(bstr, { type: "binary" });
        const first_sheet_name = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[first_sheet_name];
        const dataImport = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers: any = [
          "username",
          "fullName",
          "realRole",
          "role",
          "gender",
          "dateOfBirth",
          "email",
        ];
        const content = dataImport.slice(5, dataImport.length + 1);
        content.forEach((row: any) => {
          let rowdata: any = {};
          row.forEach((element: any, index: any) => {
            rowdata[headers[index]] = element;
          });
          !_.isEmpty(rowdata) && rows.push(rowdata);
        });

        const newRows = rows.reduce((arr: any, item: any) => {
          arr = [
            ...arr,
            {
              username: item.username,
              password: "12345678",
              fullName: item.fullName,
              dateOfBirth: _.isEmpty(item.dateOfBirth)
                ? null
                : new Date(item.dateOfBirth),
              gender: item?.gender?.toUpperCase() === "NAM" ? 0 : 1,
              realRole: item.realRole || "",
              role: getRoleId(roles, item.role),
              email: item.email || "",
              unitId: unitId,
              doet_id: unitId, //hard theo form select
            },
          ];
          return arr;
        }, []);

        return resolve(newRows);
      } catch (error) {
        reject(error);
      }
    };
    fileReader.readAsArrayBuffer(file);
  });
};

export default function importFileReducer({
  state,
  action,
  dispatch,
  translate,
  enqueueSnackbar,
  props,
}: any) {
  const { onClose, onClick } = props;
  const cases: any = {
    getFile: async () => {
      const { e, name } = action;

      const file =
        name === "onChange" ? e.target.files[0] : e.dataTransfer.files[0];

      const {
        datas: { roles, unitId },
      } = props;

      dispatch("onLoading");

      const rows: any = await getDataFromEx(file, roles, unitId);

      const newRows: any = (rows || []).map((item: any, index: number) => {
        if (item.realRole === "" || item.role === "") {
          return { ...item, isError: true };
        }
        return item;
      });

      return { rows: newRows, loading: false };
    },

    delete: () => {
      const {
        data: { rowIdx },
      } = action;
      const { rows } = state;
      rows.splice(rowIdx, 1);

      return { rows };
    },

    saveNew: async () => {
      const { rows } = state;
      const params = { users: rows.filter((item: any) => !item.isError) };

      const data = await User.import(params);

      if (data.err === 0) {
        enqueueSnackbar(`${translate("common.add")} : ${data.success} `, {
          variant: "success",
        });
        onClick && onClick();
        onClose && onClose();
      } else if (data.err > 0) {
        enqueueSnackbar(
          `${translate("common.success")}: ${data.success}, ${translate(
            "common.noSuccsess"
          )}: ${data.err}`,
          {
            variant: "warning",
          }
        );
      } else {
        enqueueSnackbar(translate("common.errorMes"), {
          variant: "error",
        });
      }
      return;
    },

    back: () => {
      onClose && onClose();
      return;
    },

    onLoading: () => {
      return { loading: true };
    },
  };

  return cases[action.type] && cases[action.type]();
}
