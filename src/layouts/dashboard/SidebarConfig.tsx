import React, { useEffect, useState } from "react";
import IconLeftMenu from "../../components/IconLeftMenu";
import { get } from "src/hooks/useLocalStorage";
import _ from "lodash";

// ----------------------------------------------------------------------

const setData = (array: any) => {
  return array.reduce((arr: any, item: any) => {
    if (_.isEmpty(item.parentId)) {
      const children = array
        .filter((i) => +i.parentId === item.id)
        .map((e) => ({ title: e.name, path: e.url, icon: getIcon(e?.icon) }));
      const childArr = _.isEmpty(children) ? {} : { children: [...children] };
      arr = [
        ...arr,
        {
          title: item.name,
          path: item?.url || "",
          icon: getIcon(item?.icon),
          ...childArr,
        },
      ];
    }
    return arr;
  }, []);
};

const getIcon = (name: string) => (
  <IconLeftMenu name={`${name}`} sx={{ width: "100%", height: "100%" }} />
);

const sidebarConfig = () => {
  const [itemMenu, setItemMenu] = useState([]);
  const menu = get("views");
  const getItemMenu = async () => {
    setItemMenu(menu || []);
  };

  useEffect(() => {
    if (_.isEmpty(itemMenu)) {
      getItemMenu();
    } else return;
  }, []);

  const item = setData(itemMenu);

  return [
    {
      subheader: "Quản lý NCC",
      items: item,
    },
  ];
};

export default sidebarConfig;
