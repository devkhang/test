import { get } from "src/hooks/useLocalStorage";

export const leftSidebarReducer = ({ state, action }): any => {
  const avatar_default = "public/static/mock-images/avatars/avatar_default.jpg";
  const logoImg = "/favicon/logoLD.png";

  const cases: any = {
    initial: () => {
      const getUser = get("user");
      const avt = get("avatar");
      const getHeader = get("setHeader");
      const infoDomain = get("infoDomain");

      const res: any = {};
      if (getUser !== null) {
        res.user = {
          avatar: avt || avatar_default,
          fullName: getUser?.fullName || "",
          realRole: getUser?.realRole || "",
          id: getUser?.id || "",
        };
      }
      if (getHeader !== null) {
        res.header = {
          logo: getHeader?.logo || logoImg,
          name: getHeader?.name || "",
          province:
            getHeader?.province?.value || infoDomain?.province?.value || "",
        };
      }
      return { ...res };
    },
  };
  return cases[action.type] && cases[action.type]();
};
