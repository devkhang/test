import { Button, MenuItem, Stack, TextField } from "@material-ui/core";
import {
  DownloadOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@material-ui/icons";
import { reports } from "logic/statisticReport";
import { get } from "src/hooks/useLocalStorage";
import jwt from "jwt-decode";

export default function HeadSelect(props: any) {
  const token = get("token");
  let uploadable = false;
  if (token) {
    const userInfo: any = jwt(token);
    uploadable =
      userInfo?.role?.role === "superAdmin" ||
      userInfo?.role?.role === "leader";
  }
  const {
    dispatch,
    data: { years, year, month, doets, doet, type, startDate, endDate },
  } = props;
  const disabled =
    !year ||
    !type ||
    !doet ||
    (type === "bc-01" && !month) ||
    (type === "bc-02" && !month);
  return (
    <Stack spacing={2} direction="row" mt={2} alignItems="center">
      <TextField
        select
        sx={{ minWidth: "120px" }}
        label="Năm"
        value={year}
        onChange={(e) =>
          dispatch({
            type: "onChange",
            name: "year",
            value: e.target.value,
          })
        }
      >
        {(years || []).map((item: any, index: number) => (
          <MenuItem key={index} value={item}>
            {item.year}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        fullWidth
        title={type}
        label="Mẫu báo cáo"
        value={type}
        onChange={(e) => {
          dispatch({
            type: "onChange",
            name: "month",
            value: null,
          });
          dispatch({
            type: "onChange",
            name: "type",
            value: e.target.value,
          });
        }}
      >
        {reports.map((item: any) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        fullWidth
        title={doet.name}
        label="Đơn vị"
        value={doet}
        onChange={(e) =>
          dispatch({
            type: "onChange",
            name: "doet",
            value: e.target.value,
          })
        }
      >
        {doets.map((item: any) => (
          <MenuItem key={item.id} value={item}>
            {item.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        sx={{ minWidth: "120px" }}
        disabled={type !== "bc-01" && type !== "bc-04"}
        label="Tháng"
        value={month}
        onChange={(e) =>
          dispatch({
            type: "onChange",
            name: "month",
            value: e.target.value,
          })
        }
      >
        <MenuItem value={1}>Tháng 1</MenuItem>
        <MenuItem value={2}>Tháng 2</MenuItem>
        <MenuItem value={3}>Tháng 3</MenuItem>
        <MenuItem value={4}>Tháng 4</MenuItem>
        <MenuItem value={5}>Tháng 5</MenuItem>
        <MenuItem value={6}>Tháng 6</MenuItem>
        <MenuItem value={7}>Tháng 7</MenuItem>
        <MenuItem value={8}>Tháng 8</MenuItem>
        <MenuItem value={9}>Tháng 9</MenuItem>
        <MenuItem value={10}>Tháng 10</MenuItem>
        <MenuItem value={11}>Tháng 11</MenuItem>
        <MenuItem value={12}>Tháng 12</MenuItem>
      </TextField>
      <Button
        startIcon={<SearchOutlined />}
        variant="contained"
        color="primary"
        sx={{ minWidth: "120px" }}
        onClick={() => dispatch({ type: "getLink", name: "onSearch" })}
        disabled={disabled}
      >
        Xem BC
      </Button>
      <Button
        startIcon={<DownloadOutlined />}
        color="info"
        variant="outlined"
        sx={{ minWidth: "120px" }}
        onClick={() => dispatch({ type: "getLink", name: "exports" })}
        disabled={disabled}
      >
        Xuất BC
      </Button>
      {uploadable && (
        <>
          <Button
            startIcon={<UploadOutlined />}
            variant="contained"
            color="info"
            sx={{ minWidth: "120px" }}
            onClick={() => dispatch({ type: "onUpload" })}
            disabled={disabled}
          >
            Tải lên
          </Button>
          {type === "bc-01" && (
            <Button
              startIcon={<DownloadOutlined />}
              color="info"
              sx={{ minWidth: "120px" }}
              onClick={() =>
                dispatch({ type: "getReport", name: "bc-01", token: token, fileName:'bc-01.xlsx' })
              }
            >
              Tải mẫu
            </Button>
          )}
          {type === "bc-02" && (
            <Button
              startIcon={<DownloadOutlined />}
              color="info"
              sx={{ minWidth: "120px" }}
              onClick={() =>
                dispatch({ type: "getReport", name: "bc-02", token: token ,fileName:'bc-02.xlsx'})
              }
            >
              Tải mẫu
            </Button>
          )}
          {type === "bc-03" && (
            <Button
              startIcon={<DownloadOutlined />}
              color="info"
              sx={{ minWidth: "120px" }}
              onClick={() =>
                dispatch({ type: "getReport", name: "bc-03", token: token, fileName:'bc-03.xlsx' })
              }
            >
              Tải mẫu
            </Button>
          )}
          {type === "bc-04" && (
            <Button
              startIcon={<DownloadOutlined />}
              color="info"
              sx={{ minWidth: "120px" }}
              onClick={() =>
                dispatch({ type: "getReport", name: "bc-04", token: token, fileName:'bc-04.xlsx' })
              }
            >
              Tải mẫu
            </Button>
          )}
          {type === "bc-05" && (
            <Button
              startIcon={<DownloadOutlined />}
              color="info"
              sx={{ minWidth: "120px" }}
              onClick={() =>
                dispatch({ type: "getReport", name: "bc-05", token: token, fileName:'bc-05.xlsx' })
              }
            >
              Tải mẫu
            </Button>
          )}
        </>
      )}
    </Stack>
  );
}
