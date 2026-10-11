export { default as userManagementReducer } from "./reducer";
export { style } from "./style";
export { default as HeadSelect } from "./components/HeadSelect";
export { default as Dialog } from "./components/Dialog";
export { columns } from './Columns'

export const getNameById = (data: any, name: string) => {
  const item = (data || []).find((item: any) => item.id === name);
  const nameItem = item?.name || "";
  return nameItem;
};
