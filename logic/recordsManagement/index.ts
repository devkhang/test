export { default as recordsReducer } from "./recordsReducer";
export { style } from "./style";
export { columns } from "./columns";
export { default as HeadTab } from "../components/HeadTab";
export { default as HeadSelect } from "./components/HeadSelect";

export const getNameById = (data: any, name: string) => {
  const item = (data || []).find((item: any) => item.id === name);
  const nameItem = item?.name || "";
  return nameItem;
};

export const status = [
  { name: "common.finish", id: [4, 5, 6, 7, 8] },
  { name: "common.updating", id: [0, 1, 2, 3] },
  { name: "recordsManagement.comeStt", id: [6] },
  { name: "recordsManagement.moveStt", id: [7] },
];
