import { TextField, Stack, Grid, MenuItem, Button } from "@material-ui/core";
import { CommonTable, Loading } from "@vna/lib/dist/components";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DesktopDatePicker from "@material-ui/lab/DesktopDatePicker";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import UploadMultiFile from "./ImportFile/uploadMultiFile";
import NumberFormat from "react-number-format";
import _ from "lodash";

export const gender = ["Nam", "Nữ"];

export const subsidyForms = [
  { id: 0, name: "Một lần" },
  { id: 1, name: "Hàng tháng" },
  { id: 2, name: "Hàng năm" },
  { id: 3, name: "Bổ sung" },
];

export const beneficiaries = [
  { id: 0, name: "Người có công" },
  { id: 1, name: "Thân nhân" },
];

export const beneficiaryObjects = ["Thân nhân", "Người thờ cúng"];

export const bhytSupport = ["Không", "Có"];

export const burialGrave = [
  "Nghĩa trang",
  "Gia đình quản lý",
  "Không có thông tin",
];

export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const relation = [
  "Cha đẻ",
  "Mẹ đẻ",
  "Cha nuôi",
  "Mẹ nuôi",
  "Vợ",
  "Chồng",
  "Con đẻ",
  "Con nuôi",
];

export const objects = ["QN", "TNXP", "CNVC", "Đối tượng khác"];

export const convertRewards = {
  0: "Huân chương Chiến thắng hạng nhất",
  1: "Huân chương Chiến thắng hạng nhì",
  2: "Huân chương Chiến thắng hạng ba",
  3: "Huy chương Chiến thắng hạng nhất",
  4: "Huy chương Chiến thắng hạng nhì",
  5: "Huy chương Chiến thắng hạng ba",
  6: "Huân chương Kháng chiến chống Pháp hạng nhất",
  7: "Huân chương Kháng chiến chống Pháp hạng nhì",
  8: "Huân chương Kháng chiến chống Pháp hạng ba",
  9: "Huân chương",
  10: "Huy chương",
  11: "Bằng khen",
};

export const converContantToReward = (name: string) => {
  switch (name) {
    case "huanchuongchienthanghangnhat":
    case "nghiatrang":
    case "qn":
      return 0;
    case "huanchuongchienthanghangnhi":
    case "giadinhquanly":
    case "tnxp":
      return 1;
    case "huanchuongchienthanghangba":
    case "khongcothongtin":
    case "cnvc":
      return 2;
    case "huychuongchienthanghangnhat":
    case "doituongkhac":
      return 3;
    case "huychuongchienthanghangnhi":
      return 4;
    case "huychuongchienthanghangba":
      return 5;
    case "huanchuongkhangchienchongphaphangnhat":
      return 6;
    case "huanchuongkhangchienchongphaphangnhi":
      return 7;
    case "huanchuongkhangchienchongphaphangba":
      return 8;
    case "huanchuong":
      return 9;
    case "huychuong":
      return 10;
    case "bangkhen":
      return 11;
  }
};

export function convertSelect(name, value) {
  switch (name) {
    case "object":
      return objects[value];
    case "burialGrave":
      return burialGrave[value];
    case "reward":
      return convertRewards[value];
  }
}

export function Date({
  classes,
  label,
  disable,
  value,
  name,
  dispatch,
  type,
  err,
  format,
}: any) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack>
        <DesktopDatePicker
          label={label}
          inputFormat={format || "dd/MM/yyyy"} //"MM/yyyy"
          value={value || null}
          disabled={!!disable}
          onChange={(e: any) => {
            dispatch({ type, name, value: e });
          }}
          renderInput={(params: any) => (
            <TextField
              {...params}
              fullWidth
              helperText={false}
              className={classes || ""}
              error={err || false}
            />
          )}
        />
      </Stack>
    </LocalizationProvider>
  );
}

export function TextInput({
  label,
  required,
  disabled,
  value,
  name,
  dispatch,
  type,
  err,
}: any) {
  return (
    <TextField
      fullWidth
      disabled={disabled || false}
      label={label}
      required={required}
      value={value || ""}
      error={err || false}
      onChange={(e) => dispatch({ type, name, value: e.target.value })}
    />
  );
}

export function DateInput({
  event,
  item,
  name,
  error,
  rowIdx,
  dispatch,
  classes,
}: any) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack>
        <DesktopDatePicker
          inputFormat="dd/MM/yyyy"
          value={item[name] || null}
          onChange={event(dispatch, {
            name,
            rowIdx,
            item,
          })}
          renderInput={(params) => (
            <TextField {...params} error={error} className={classes || ""} />
          )}
        />
      </Stack>
    </LocalizationProvider>
  );
}

export function Table({
  loading,
  columns,
  rows,
  data,
  errors,
  classes,
  dispatch,
}: any) {
  return (
    <Loading loading={loading}>
      <CommonTable
        columns={columns}
        rows={rows}
        data={{ data, errors }}
        classes={classes}
        event={(type: any, data: any) =>
          (ele: any, ...rest: any[]) => {
            dispatch({ type, data, ele, rest });
          }}
      />
    </Loading>
  );
}

export function UploadFile({ files, name, dispatch }: any) {
  return (
    <UploadMultiFile
      files={files}
      onDrop={(acceptedFiles) =>
        dispatch({ type: "handleDropFile", name, data: acceptedFiles })
      }
      dispatch={dispatch}
      nameFile={name}
    />
  );
}

export function gird({
  label,
  isDate,
  isMoney,
  translate,
  dispatch,
  other,
  name,
  classes,
}) {
  return (
    <Grid sx={{ display: "flex" }} item xs={6} xl={3} lg={3} direction="row">
      {!!isDate ? (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack sx={{ width: "100%" }}>
            <DesktopDatePicker
              label={translate(label)}
              inputFormat="dd/MM/yyyy"
              value={other[name] || null}
              onChange={(e: any) => {
                dispatch({ type: "onChange", name, e });
              }}
              renderInput={(params: any) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText={false}
                  className={`${classes.textField}`}
                />
              )}
            />
          </Stack>
        </LocalizationProvider>
      ) : !!isMoney ? (
        <NumberFormat
          customInput={TextField}
          thousandsGroupStyle="thousand"
          value={other[name] || ""}
          decimalSeparator="."
          displayType="input"
          label={translate(label)}
          type="text"
          fullWidth
          thousandSeparator={true}
          allowNegative={false}
          onChange={(e) => dispatch({ type: "onChange", name, e })}
        />
      ) : (
        <TextField
          label={translate(label)}
          fullWidth
          value={other[name] || ""}
          onChange={(e) => dispatch({ type: "onChange", name, e })}
        />
      )}
    </Grid>
  );
}

export function girdExport({ label, translate, dispatch, arr, classes }) {
  return (
    <>
      {arr.length > 1 ? (
        <TextField
          className={`${classes.select}`}
          select
          value={""}
          size={"small"}
          label={translate(label)}
          InputLabelProps={{ shrink: false }}
          onChange={(e: any) =>
            dispatch({ type: "exports", value: e.target.value, e })
          }
        >
          {arr.map((item: any, key: number) => (
            <MenuItem key={key} value={item.key}>
              {translate(item.name)}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <Button
          className={`${classes.buttons}`}
          onClick={() => dispatch({ type: "exports", value: arr[0].key })}
        >
          {translate(label)}
        </Button>
      )}
    </>
  );
}

export function categoryLO(key) {
  switch (key) {
    case "LT":
      return [
        {
          label: "recordsManagement.decidedDateOther",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.decidedOther", name: "decided" },
        {
          label: "recordsManagement.decidedDateOnceOther",
          name: "decidedDateOnce",
          isDate: true,
        },
        { label: "recordsManagement.decidedOnceOther", name: "decidedOnce" },
        {
          label: "recordsManagement.newspaperMoneyOther",
          name: "newspaperMoney",
          isMoney: true,
        },
        {
          label: "recordsManagement.allowanceOther",
          name: "allowance",
          isMoney: true,
        },
      ];
    case "TKN":
      return [
        {
          label: "recordsManagement.decidedDateOther",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.decidedOther", name: "decided" },
        {
          label: "recordsManagement.decidedDateOnceOther",
          name: "decidedDateOnce",
          isDate: true,
        },
        { label: "recordsManagement.decidedOnceOther", name: "decidedOnce" },
        {
          label: "recordsManagement.newspaperMoneyOther",
          name: "newspaperMoney",
          isMoney: true,
        },
        {
          label: "recordsManagement.allowanceOther",
          name: "allowance",
          isMoney: true,
        },
      ];
    case "LS":
      return [
        {
          label: "recordsManagement.decidedDateOnceLSOther",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.decidedOnceLSOther", name: "decided" },
        {
          label: "recordsManagement.decidedDateLSOther",
          name: "decidedDateOnce",
          isDate: true,
        },
        { label: "recordsManagement.decidedLSOther", name: "decidedOnce" },
        {
          label: "recordsManagement.allowanceLSOther",
          name: "allowance",
          isMoney: true,
        },
      ];
    case "BM":
      return [
        {
          label: "recordsManagement.decidedDateOther",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.decidedOther", name: "decided" },
        {
          label: "recordsManagement.decidedDateOnceOther",
          name: "decidedDateOnce",
          isDate: true,
        },
        { label: "recordsManagement.decidedOnceOther", name: "decidedOnce" },
        {
          label: "recordsManagement.allowanceOther",
          name: "allowance",
          isMoney: true,
        },
      ];
    case "AHLL":
      return [
        {
          label: "recordsManagement.decidedDateOther",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.decidedOther", name: "decided" },
        {
          label: "recordsManagement.startDate",
          name: "startDate",
          isDate: true,
        },
        {
          label: "recordsManagement.decidedDateOnceOther",
          name: "decidedDateOnce",
          isDate: true,
        },
        { label: "recordsManagement.decidedOnceOther", name: "decidedOnce" },
      ];
    case "AHKC":
      return [
        {
          label: "recordsManagement.decidedDateOther",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.decidedOther", name: "decided" },
        {
          label: "recordsManagement.startDate",
          name: "startDate",
          isDate: true,
        },
        {
          label: "recordsManagement.decidedDateOnceOther",
          name: "decidedDateOnce",
          isDate: true,
        },
        { label: "recordsManagement.decidedOnceOther", name: "decidedOnce" },
      ];
    case "AQ":
      return [
        {
          label: "recordsManagement.decidedDateOther",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.decidedOther", name: "decided" },
        {
          label: "recordsManagement.startDate",
          name: "startDate",
          isDate: true,
        },
        {
          label: "recordsManagement.decidedDateOnceOther",
          name: "decidedDateOnce",
          isDate: true,
        },
        { label: "recordsManagement.decidedOnceOther", name: "decidedOnce" },
      ];
    case "BB":
      return [
        {
          label: "recordsManagement.decidedDateOther",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.decidedOther", name: "decided" },
      ];
    case "BT":
      return [
        {
          label: "recordsManagement.decidedDateOther",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.decidedOther", name: "decided" },
        {
          label: "recordsManagement.startDate",
          name: "startDate",
          isDate: true,
        },
        {
          label: "recordsManagement.decidedDateOnceOther",
          name: "decidedDateOnce",
          isDate: true,
        },
        { label: "recordsManagement.decidedOnceOther", name: "decidedOnce" },
      ];
    case "KC":
      return [
        {
          label: "recordsManagement.decidedDateOnceOther",
          name: "decidedDateOnce",
          isDate: true,
        },
        { label: "recordsManagement.decidedOnceOther", name: "decidedOnce" },
      ];
    case "CC":
      return [
        {
          label: "recordsManagement.decidedDateOther",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.decidedOther", name: "decided" },
        {
          label: "recordsManagement.startDate",
          name: "startDate",
          isDate: true,
        },
        {
          label: "recordsManagement.decidedDateOnceOther",
          name: "decidedDateOnce",
          isDate: true,
        },
        { label: "recordsManagement.decidedOnceOther", name: "decidedOnce" },
      ];
    case "HH":
      return [
        {
          label: "recordsManagement.decidedDateOther",
          name: "decidedDate",
          isDate: true,
        },
        { label: "recordsManagement.decidedOther", name: "decided" },
        {
          label: "recordsManagement.allowanceOther",
          name: "allowance",
          isMoney: true,
        },
      ];
  }
}

export function categoryExport(key) {
  switch (key) {
    case "LT":
      return [
        {
          label: "recordsManagement.printForm",
          arr: [
            { name: "recordsManagement.LT1", key: "LT1" },
            { name: "recordsManagement.LT2", key: "LT2" },
          ],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [
            { name: "recordsManagement.LT4", key: "LT4" },
            { name: "recordsManagement.LT5", key: "LT5" },
          ],
        },
      ];
    case "TKN":
      return [
        {
          label: "recordsManagement.printForm",
          arr: [
            { name: "recordsManagement.TKN1", key: "TKN1" },
            { name: "recordsManagement.TKN2", key: "TKN2" },
          ],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [
            { name: "recordsManagement.LT4", key: "TKN4" },
            { name: "recordsManagement.LT5", key: "TKN5" },
          ],
        },
      ];
    case "LS":
      return [
        {
          label: "recordsManagement.printForm",
          arr: [{ name: "recordsManagement.LS4", key: "LS4" }],
        },
        {
          label: "recordsManagement.HS",
          arr: [{ name: "recordsManagement.HS2", key: "HS1" }],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [
            { name: "recordsManagement.LT4", key: "LS5" },
            { name: "recordsManagement.LT5", key: "LS6" },
          ],
        },
      ];
    case "BM":
      return [
        {
          label: "recordsManagement.printForm",
          arr: [
            { name: "recordsManagement.BM1", key: "BM1" },
            { name: "recordsManagement.BM2", key: "BM2" },
          ],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [
            { name: "recordsManagement.LT4", key: "BM3" },
            { name: "recordsManagement.LT5", key: "BM4" },
          ],
        },
      ];
    case "AHLL":
      return [
        {
          label: "recordsManagement.printForm",
          arr: [
            { name: "recordsManagement.AH1", key: "AH1" },
            { name: "recordsManagement.AH2", key: "AH2" },
          ],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [
            { name: "recordsManagement.LT4", key: "AH3" },
            { name: "recordsManagement.LT5", key: "AH4" },
          ],
        },
      ];
    case "AHKC":
      return [
        {
          label: "recordsManagement.printForm",
          arr: [
            { name: "recordsManagement.AH1", key: "AH1" },
            { name: "recordsManagement.AH2", key: "AH2" },
          ],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [
            { name: "recordsManagement.LT4", key: "AH3" },
            { name: "recordsManagement.LT5", key: "AH4" },
          ],
        },
      ];
    case "AQ":
      return [
        {
          label: "recordsManagement.HS",
          arr: [{ name: "recordsManagement.HS2", key: "HS2" }],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [
            { name: "recordsManagement.LT4", key: "TB3" },
            { name: "recordsManagement.LT5", key: "TB4" },
          ],
        },
      ];
    case "BB":
      return [
        {
          label: "recordsManagement.HS",
          arr: [{ name: "recordsManagement.HS3", key: "HS3" }],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [{ name: "recordsManagement.LT4", key: "BB3" }],
        },
      ];
    case "BT":
      return [
        {
          label: "recordsManagement.printForm",
          arr: [
            { name: "recordsManagement.TD1", key: "TD1" },
            { name: "recordsManagement.TD2", key: "TD2" },
            { name: "recordsManagement.TD3", key: "TD3" },
          ],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [
            { name: "recordsManagement.LT4", key: "TD4" },
            { name: "recordsManagement.LT5", key: "TD5" },
          ],
        },
      ];
    case "KC":
      return [
        {
          label: "recordsManagement.printForm",
          arr: [{ name: "recordsManagement.KC1", key: "KC1" }],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [{ name: "recordsManagement.LT5", key: "KC2" }],
        },
      ];
    case "CC":
      return [
        {
          label: "recordsManagement.printForm",
          arr: [{ name: "recordsManagement.CC1", key: "CC1" }],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [
            { name: "recordsManagement.LT4", key: "CC2" },
            { name: "recordsManagement.LT5", key: "CC3" },
          ],
        },
      ];
    case "HH":
      return [
        {
          label: "recordsManagement.printForm",
          arr: [{ name: "recordsManagement.HH1", key: "HH1" }],
        },
        {
          label: "recordsManagement.HS",
          arr: [{ name: "recordsManagement.HS4", key: "HS4" }],
        },
        {
          label: "recordsManagement.printDesitions",
          arr: [{ name: "recordsManagement.LT4", key: "HH4" }],
        },
      ];
  }
}

export function categoryDowFile(key) {
  switch (key) {
    case "LT":
      return "https://drive.google.com/uc?id=1aCPV-2PuKh6QwQyHQmYLI0ShMijaLVs5&export=download";

    case "TKN":
      return "https://drive.google.com/uc?id=14YP1_1puwQ5ZMkSarNNeNoIoDSgxVnal&export=download";

    case "LS":
      return "https://drive.google.com/uc?id=1pCoprOvHxll37dBtlrm-ok29cKuf-70w&export=download";

    case "BM":
      return "https://drive.google.com/uc?id=1uS0K0ZhqJMloGeB0_-Y28h9Kej3SwsR2&export=download";

    case "AHLL":
      return "https://drive.google.com/uc?id=1jGqOClP4p2zeEKyYyQ3DAI4Li50MQmpw&export=download";

    case "AHKC":
      return "https://drive.google.com/uc?id=1jGqOClP4p2zeEKyYyQ3DAI4Li50MQmpw&export=download";

    case "AQ":
      return "https://drive.google.com/uc?id=1OaYUmg3fsu8E_LLkNiiMSpkrs9cMoio1&export=download";

    case "BB":
      return "https://drive.google.com/uc?id=1Y5wvf0vN-5xQX6Lz5iQq2T6zXuTWWhox&export=download";

    case "BT":
      return "https://drive.google.com/uc?id=1prqIqG6B-JSBnZtlQIzAIEr42JOSzlH3&export=download";

    case "KC":
      return "https://drive.google.com/uc?id=102wsUTHF59WqpVpmS3aw92xE4UTbFHPX&export=download";

    case "CC":
      return "https://drive.google.com/uc?id=1DVRG-W1M3koWtyERqDiaNv1ewuRpzlNX&export=download";

    case "HH":
      return "https://drive.google.com/uc?id=1Z9t1Phg7vJQl_Zm3BGxklRCNhjX3AaAU&export=download";
  }
}

export function categoryIPF(key) {
  switch (key) {
    case "LT":
      return [
        {
          label: "recordsManagement.dateJoinClan",
          name: "dateJoinClan",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.date",
          name: "date",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.position",
          name: "position",
          type: "infos",
        },
        { label: "recordsManagement.organ", name: "organ", type: "infos" },
        {
          label: "recordsManagement.retire",
          name: "retire",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.startDateRevolution",
          name: "startDateRevolution",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.endDateRevolution",
          name: "endDateRevolution",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.identityCard",
          name: "identityCard",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyDate",
          name: "supplyDate",
          isDate: true,
          type: "infoNcc",
        },
        { label: "recordsManagement.place", name: "place", type: "infoNcc" },
      ];
    case "TKN":
      return [
        {
          label: "recordsManagement.dateJoinClan",
          name: "dateJoinClan",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.date",
          name: "date",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.position",
          name: "position",
          type: "infos",
        },
        { label: "recordsManagement.organ", name: "organ", type: "infos" },
        {
          label: "recordsManagement.retire",
          name: "retire",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.roleRevolution",
          name: "roleRevolution",
          type: "infos",
        },
        {
          label: "recordsManagement.takeOfficeDate",
          name: "takeOfficeDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.revolutionCM",
          name: "note",
          ellipsis: true,
          type: "infos",
        },
        {
          label: "recordsManagement.identityCard",
          name: "identityCard",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyDate",
          name: "supplyDate",
          isDate: true,
          type: "infoNcc",
        },
        { label: "recordsManagement.place", name: "place", type: "infoNcc" },
      ];
    case "LS":
      return [
        {
          label: "recordsManagement.deadTime",
          name: "dead",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.degreeTQGCIp",
          name: "degree",
          type: "infos",
        },
        {
          label: "recordsManagement.decidedTQGCIp",
          name: "decided",
          type: "infos",
        },
        {
          label: "recordsManagement.timeDegreeTp",
          name: "decidedDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.deathCertificateNum",
          name: "deathCertificateNum",
          type: "infos",
        },
        {
          label: "recordsManagement.deathCertificateDate",
          name: "deathCertificateDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.objectTo",
          name: "object",
          //isSelect: true,
          type: "infos",
        },
        {
          label: "recordsManagement.burialGrave",
          name: "burialGrave",
          //isSelect: true,
          type: "infos",
        },
        {
          label: "recordsManagement.revolutionCM",
          name: "note",
          type: "infos",
          ellipsis: true,
        },
        {
          label: "recordsManagement.identityCard",
          name: "identityCard",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyDate",
          name: "date",
          isDate: true,
          type: "infoNcc",
        },
        {
          label: "recordsManagement.enlistmentDate",
          name: "enlistmentDate",
          isDate: true,
          type: "infoNcc",
        },
        {
          label: "recordsManagement.level",
          name: "level",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.sacrificialUnit",
          name: "sacrificialUnit",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.sacrificialPlace",
          name: "sacrificialPlace",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.sacrificialCase",
          name: "sacrificialCase",
          type: "infoNcc",
        },
      ];
    case "BM":
      return [
        {
          label: "recordsManagement.organManagerHsg",
          name: "organManager",
          type: "infos",
        },
        {
          label: "recordsManagement.decidedPTDHIp",
          name: "decided",
          type: "infos",
        },
        {
          label: "recordsManagement.decidedDateIp",
          name: "decidedDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.identityCard",
          name: "identityCard",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyDate",
          name: "supplyDate",
          isDate: true,
          type: "infoNcc",
        },
        { label: "recordsManagement.place", name: "place", type: "infoNcc" },
      ];
    case "AHLL":
      return [
        {
          label: "recordsManagement.organManager",
          name: "organManager",
          type: "infos",
        },
        {
          label: "recordsManagement.decidedPTDHIp",
          name: "decided",
          type: "infos",
        },
        {
          label: "recordsManagement.decidedDateIp",
          name: "decidedDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.decisionKind",
          name: "decisionKind",
          type: "infos",
        },
        {
          label: "recordsManagement.identityCard",
          name: "identityCard",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyDate",
          name: "supplyDate",
          isDate: true,
          type: "infoNcc",
        },
        { label: "recordsManagement.place", name: "place", type: "infoNcc" },
      ];
    case "AHKC":
      return [
        {
          label: "recordsManagement.organManager",
          name: "organManager",
          type: "infos",
        },
        {
          label: "recordsManagement.decidedPTDHIp",
          name: "decided",
          type: "infos",
        },
        {
          label: "recordsManagement.decidedDateIp",
          name: "decidedDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.decisionKind",
          name: "decisionKind",
          type: "infos",
        },
        {
          label: "recordsManagement.identityCard",
          name: "identityCard",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyDate",
          name: "supplyDate",
          isDate: true,
          type: "infoNcc",
        },
        { label: "recordsManagement.place", name: "place", type: "infoNcc" },
      ];
    case "AQ":
      return [
        {
          label: "recordsManagement.injuredCertificateNumber",
          name: "injured",
          type: "infos",
        },
        {
          label: "recordsManagement.injuredVerifyDate",
          name: "verifyDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.injuredDate",
          name: "injuredDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.inspectionNum",
          name: "inspectionNum",
          type: "infos",
        },
        {
          label: "recordsManagement.inspectionDate",
          name: "inspectionDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.inspectionBoard",
          name: "inspectionBoard",
          type: "infos",
        },
        {
          label: "recordsManagement.identityCard",
          name: "identityCard",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyDate",
          name: "supplyDate",
          isDate: true,
          type: "infoNcc",
        },
        { label: "recordsManagement.place", name: "place", type: "infoNcc" },
        {
          label: "recordsManagement.enlistmentTime",
          name: "enlistmentDate",
          isDate: true,
          type: "infoNcc",
        },
        { label: "recordsManagement.organ", name: "unit", type: "infoNcc" },
        { label: "recordsManagement.rank", name: "rank", type: "infoNcc" },
        {
          label: "recordsManagement.injuredPlace",
          name: "injuredPlace",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.injuredCase",
          name: "injuredCase",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.injuredCondition",
          name: "injuredCondition",
          type: "infoNcc",
        },
      ];
    case "BB":
      return [
        {
          label: "recordsManagement.sickSoldierCertificateNumber",
          name: "injured",
          type: "infos",
        },
        {
          label: "recordsManagement.injuredVerifyDate",
          name: "verifyDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.medicalAssessmentNum",
          name: "medicalAssessmentNum",
          type: "infos",
        },
        {
          label: "recordsManagement.medicalAssessmentDate",
          name: "medicalAssessmentDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.medicalCondition",
          name: "medicalCondition",
          type: "infos",
        },
        {
          label: "recordsManagement.identityCard",
          name: "identityCard",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyDate",
          name: "supplyDate",
          isDate: true,
          type: "infoNcc",
        },
        { label: "recordsManagement.place", name: "place", type: "infoNcc" },
        {
          label: "recordsManagement.enlistmentTime",
          name: "enlistmentDate",
          isDate: true,
          type: "infoNcc",
        },
        {
          label: "recordsManagement.enlistmentUnit",
          name: "enlistmentUnit",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.demobilizationTime",
          name: "demobilizationTime",
          isDate: true,
          type: "infoNcc",
        },
        {
          label: "recordsManagement.demobilizationUnit",
          name: "demobilizationUnit",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.demobilizationRank",
          name: "demobilizationRank",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.CATime",
          name: "CATime",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.CTTime",
          name: "CTTime",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.KKTime",
          name: "KKTime",
          type: "infoNcc",
        },
      ];
    case "BT":
      return [
        {
          label: "recordsManagement.identityCard",
          name: "identityCard",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyDate",
          name: "supplyDate",
          isDate: true,
          type: "infoNcc",
        },
        { label: "recordsManagement.place", name: "place", type: "infoNcc" },
        {
          label: "recordsManagement.decidedNum",
          name: "decided",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.decisionDate",
          name: "decidedDate",
          isDate: true,
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyOrgan",
          name: "organ",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.subsidy",
          name: "subsidy",
          isMoney: true,
          type: "infoNcc",
        },
      ];
    case "KC":
      return [
        {
          label: "recordsManagement.reward",
          name: "reward",
          isSelect: true,
          type: "infos",
        },
        {
          label: "recordsManagement.decidedPTDHIp",
          name: "decided",
          type: "infos",
        },
        {
          label: "recordsManagement.decidedDate",
          name: "decidedDate",
          type: "infos",
        },
        {
          label: "recordsManagement.startDateKC",
          name: "startDateRevolution",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.endDateKC",
          name: "endDateRevolution",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.identityCard",
          name: "identityCard",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyDate",
          name: "supplyDate",
          isDate: true,
          type: "infoNcc",
        },
        { label: "recordsManagement.place", name: "place", type: "infoNcc" },
      ];
    case "CC":
      return [
        {
          label: "recordsManagement.reward",
          name: "reward",
          isSelect: true,
          type: "infos",
        },
        {
          label: "recordsManagement.decidedPTDHIp",
          name: "decided",
          type: "infos",
        },
        {
          label: "recordsManagement.decidedDateIp",
          name: "decidedDate",
          isDate: true,
          type: "infos",
        },
      ];
    case "HH":
      return [
        {
          label: "recordsManagement.medicalAssessmentNum",
          name: "medicalAssessmentNum",
          type: "infos",
        },
        {
          label: "recordsManagement.medicalAssessmentDate",
          name: "medicalAssessmentDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.certificationNum",
          name: "certificationNum",
          type: "infos",
        },
        {
          label: "recordsManagement.certificationDate",
          name: "certificationDate",
          isDate: true,
          type: "infos",
        },
        {
          label: "recordsManagement.identityCard",
          name: "identityCard",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.supplyDate",
          name: "supplyDate",
          isDate: true,
          type: "infoNcc",
        },
        { label: "recordsManagement.place", name: "place", type: "infoNcc" },

        {
          label: "recordsManagement.enlistmentTime",
          name: "enlistmentDate",
          isDate: true,
          type: "infoNcc",
        },
        {
          label: "recordsManagement.proof",
          name: "proof",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.organ",
          name: "unit",
          type: "infoNcc",
        },
        {
          label: "recordsManagement.disabilityCondition",
          name: "disabilityCondition",
          type: "infoNcc",
        },
      ];
    default:
      return [];
  }
}
