export { default as HeadSelect } from "./HeadSelect";
export { default as statisticReportReducer } from "./statisticReportsReducer";
export { styles } from "./styles";

export const reports = [
  {
    name: "Báo cáo số lượng đối tượng đang hưởng trợ cấp hàng tháng",
    id: "bc-01",
  },
  {
    name: "Báo cáo số liệu chi tiết đối tượng thương binh, người hưởng chính sách như thương binh, thương binh loại B",
    id: "bc-02",
  },
  {
    name: "Báo cáo số lượng đối tượng đang hưởng trợ cấp một lần",
    id: "bc-03",
  },
  {
    name: "Báo cáo chi trả trợ cấp hàng tháng",
    id: "bc-04",
  },
  {
    name: "Báo cáo tình hình chi trả trợ cấp một lần",
    id: "bc-05",
  },
];
